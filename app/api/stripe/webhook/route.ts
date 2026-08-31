import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  applyBusinessEmailPurchased,
  applyLocalBoostPurchased,
  applyLoudPurchased,
  applyPaymentFailed,
  applyPaymentSucceeded,
  applyTrafficPurchased,
} from "@/lib/billing";
import { applyPaidExtras, extrasFromMetadata } from "@/lib/site-addons";
import {
  isCheckoutKind,
  kindHasBoost,
  kindHasEmail,
  kindHasLoud,
  kindHasPlan,
  kindHasTraffic,
  resolveCheckoutKind,
  type CheckoutKind,
} from "@/lib/checkout-kind";
import {
  boostPriceIds,
  emailPriceIds,
  loudPriceIds,
  trafficPriceIds,
} from "@/lib/config";
import {
  getClient,
  getClientByStripeCustomer,
  getClientByStripeSubscription,
  getLead,
  getLeadByClientId,
  getCloserByCode,
  updateLead,
  upsertClient,
} from "@/lib/store";
import { sanitizeCloserCode, launchSoldNote } from "@/lib/closers";
import { getStripe } from "@/lib/stripe";
import type { Client } from "@/lib/types";

export const runtime = "nodejs";

type AddOns = {
  boost: boolean;
  traffic: boolean;
  loud: boolean;
  email: boolean;
};

function asId(
  value: string | { id?: string } | null | undefined,
): string | undefined {
  if (!value) return undefined;
  return typeof value === "string" ? value : value.id;
}

function metadataBoost(meta?: Stripe.Metadata | null) {
  return (
    meta?.localBoost === "true" ||
    (isCheckoutKind(meta?.checkoutKind) && kindHasBoost(meta.checkoutKind))
  );
}

function metadataTraffic(meta?: Stripe.Metadata | null) {
  return (
    meta?.trafficAds === "true" ||
    (isCheckoutKind(meta?.checkoutKind) && kindHasTraffic(meta.checkoutKind))
  );
}

function metadataLoud(meta?: Stripe.Metadata | null) {
  return (
    meta?.loudAds === "true" ||
    (isCheckoutKind(meta?.checkoutKind) && kindHasLoud(meta.checkoutKind))
  );
}

function metadataEmail(meta?: Stripe.Metadata | null) {
  return (
    meta?.businessEmail === "true" ||
    (isCheckoutKind(meta?.checkoutKind) && kindHasEmail(meta.checkoutKind))
  );
}

function metadataKind(meta?: Stripe.Metadata | null): CheckoutKind {
  if (isCheckoutKind(meta?.checkoutKind)) return meta.checkoutKind;
  try {
    return resolveCheckoutKind({
      includeBoost: metadataBoost(meta),
      includeTraffic: metadataTraffic(meta),
      includeLoud: metadataLoud(meta),
      includeEmail: metadataEmail(meta),
    });
  } catch {
    return "plan";
  }
}

function priceIdFromUnknown(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && "id" in value) {
    const id = (value as { id?: string }).id;
    return id;
  }
  return undefined;
}

function linePriceId(line: {
  price?: unknown;
  pricing?: { price_details?: { price?: unknown } | null } | null;
}): string | undefined {
  return (
    priceIdFromUnknown(line.pricing?.price_details?.price) ||
    priceIdFromUnknown(line.price)
  );
}

function idsInclude(priceIds: Array<string | undefined>, known: string[]) {
  const set = new Set(known);
  if (set.size === 0) return false;
  return priceIds.some((id) => id && set.has(id));
}

async function sessionLinePriceIds(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  try {
    const items = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 20,
    });
    return items.data.map((item) => linePriceId(item));
  } catch {
    return [];
  }
}

async function sessionAddOns(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<AddOns> {
  const fromMetaBoost = metadataBoost(session.metadata);
  const fromMetaTraffic = metadataTraffic(session.metadata);
  const fromMetaLoud = metadataLoud(session.metadata);
  const fromMetaEmail = metadataEmail(session.metadata);
  if (fromMetaBoost && fromMetaEmail && !fromMetaTraffic && !fromMetaLoud) {
    return { boost: true, traffic: false, loud: false, email: true };
  }
  const prices = await sessionLinePriceIds(stripe, session);
  return {
    boost: fromMetaBoost || idsInclude(prices, boostPriceIds()),
    traffic: fromMetaTraffic || idsInclude(prices, trafficPriceIds()),
    loud: fromMetaLoud || idsInclude(prices, loudPriceIds()),
    email: fromMetaEmail || idsInclude(prices, emailPriceIds()),
  };
}

function invoiceAddOns(invoice: Stripe.Invoice): AddOns {
  const meta =
    invoice.metadata || invoice.parent?.subscription_details?.metadata;
  const prices = invoice.lines.data.map((line) => linePriceId(line));
  return {
    boost:
      metadataBoost(meta) ||
      metadataBoost(invoice.metadata) ||
      idsInclude(prices, boostPriceIds()),
    traffic:
      metadataTraffic(meta) ||
      metadataTraffic(invoice.metadata) ||
      idsInclude(prices, trafficPriceIds()),
    loud:
      metadataLoud(meta) ||
      metadataLoud(invoice.metadata) ||
      idsInclude(prices, loudPriceIds()),
    email:
      metadataEmail(meta) ||
      metadataEmail(invoice.metadata) ||
      idsInclude(prices, emailPriceIds()),
  };
}

function invoiceHasBaseMonthly(invoice: Stripe.Invoice) {
  const base = process.env.STRIPE_MONTHLY_PRICE_ID;
  if (!base) return false;
  return invoice.lines.data.some((line) => linePriceId(line) === base);
}

function isAddonOnlySubscription(client: Client, subscriptionId?: string) {
  if (!subscriptionId) return false;
  if (client.stripeSubscriptionId === subscriptionId) return false;
  return (
    client.stripeBoostSubscriptionId === subscriptionId ||
    client.stripeTrafficSubscriptionId === subscriptionId ||
    client.stripeLoudSubscriptionId === subscriptionId ||
    client.stripeEmailSubscriptionId === subscriptionId ||
    client.stripeBookSubscriptionId === subscriptionId ||
    client.stripeMissedCallSubscriptionId === subscriptionId ||
    client.stripeReviewTextsSubscriptionId === subscriptionId ||
    client.stripeVoiceSubscriptionId === subscriptionId
  );
}

function invoiceKind(invoice: Stripe.Invoice, addOns: AddOns): CheckoutKind {
  const meta =
    invoice.metadata || invoice.parent?.subscription_details?.metadata;
  const fromMeta = metadataKind(meta);
  if (fromMeta === "addons") return "addons";
  const hasBase = invoiceHasBaseMonthly(invoice);
  const extras = extrasFromMetadata(meta);
  const extrasOnly =
    !hasBase &&
    !addOns.boost &&
    !addOns.traffic &&
    !addOns.loud &&
    !addOns.email &&
    Boolean(
      extras.includeBook ||
        extras.includeMissedCall ||
        extras.includeReviews ||
        extras.includeVoice ||
        extras.includeDomain,
    );
  if (extrasOnly) return "addons";
  try {
    return resolveCheckoutKind({
      includeBoost: addOns.boost,
      includeTraffic: addOns.traffic,
      includeLoud: addOns.loud,
      includeEmail: addOns.email,
      alreadyPaid: !hasBase,
    });
  } catch {
    return fromMeta;
  }
}

function applyCheckoutIds(
  client: Client,
  kind: CheckoutKind,
  customerId?: string,
  subscriptionId?: string,
  extras = extrasFromMetadata(null),
): Client {
  const next: Client = {
    ...client,
    stripeCustomerId: customerId || client.stripeCustomerId,
  };
  if (!subscriptionId) return next;
  if (kindHasPlan(kind)) {
    next.stripeSubscriptionId = subscriptionId;
  }
  if (kindHasBoost(kind)) {
    next.stripeBoostSubscriptionId = subscriptionId;
  }
  if (kindHasTraffic(kind)) {
    next.stripeTrafficSubscriptionId = subscriptionId;
  }
  if (kindHasLoud(kind)) {
    next.stripeLoudSubscriptionId = subscriptionId;
  }
  if (kindHasEmail(kind)) {
    next.stripeEmailSubscriptionId = subscriptionId;
  }
  if (extras.includeBook) next.stripeBookSubscriptionId = subscriptionId;
  if (extras.includeMissedCall) next.stripeMissedCallSubscriptionId = subscriptionId;
  if (extras.includeReviews) next.stripeReviewTextsSubscriptionId = subscriptionId;
  if (extras.includeVoice) next.stripeVoiceSubscriptionId = subscriptionId;
  return next;
}

function withAddonNotes(client: Client, bodies: string[]): Client {
  if (bodies.length === 0) return client;
  const at = new Date().toISOString();
  return {
    ...client,
    notes: [
      ...bodies.map((body) => ({
        id: `note_${crypto.randomUUID()}`,
        body,
        createdAt: at,
      })),
      ...client.notes,
    ],
  };
}

function applyPurchasedAddOns(
  client: Client,
  addOns: AddOns,
  extras = extrasFromMetadata(null),
): Client {
  let next = client;
  if (addOns.boost) next = applyLocalBoostPurchased(next);
  if (addOns.traffic) next = applyTrafficPurchased(next);
  if (addOns.loud) next = applyLoudPurchased(next);
  if (addOns.email) next = applyBusinessEmailPurchased(next);
  return applyPaidExtras(next, extras);
}

function kindFromAddOns(
  addOns: AddOns,
  hasPlan: boolean,
  fallback: CheckoutKind = "plan",
): CheckoutKind {
  const extrasOnly =
    !hasPlan &&
    !addOns.boost &&
    !addOns.traffic &&
    !addOns.loud &&
    !addOns.email;
  if (extrasOnly) return fallback === "addons" ? "addons" : fallback;
  try {
    return resolveCheckoutKind({
      includeBoost: addOns.boost,
      includeTraffic: addOns.traffic,
      includeLoud: addOns.loud,
      includeEmail: addOns.email,
      alreadyPaid: !hasPlan,
    });
  } catch {
    return hasPlan ? "plan" : "email";
  }
}

function clearAddonSubscription(client: Client, subscriptionId: string): Client {
  const next = { ...client };
  const notes: string[] = [];
  if (next.stripeBoostSubscriptionId === subscriptionId) {
    next.localBoost = false;
    next.stripeBoostSubscriptionId = null;
    notes.push("Local Boost subscription ended.");
  }
  if (next.stripeTrafficSubscriptionId === subscriptionId) {
    next.trafficAds = false;
    next.stripeTrafficSubscriptionId = null;
    notes.push("Traffic subscription ended.");
  }
  if (next.stripeLoudSubscriptionId === subscriptionId) {
    next.loudAds = false;
    next.stripeLoudSubscriptionId = null;
    notes.push("Loud subscription ended.");
  }
  if (next.stripeEmailSubscriptionId === subscriptionId) {
    next.businessEmail = false;
    next.stripeEmailSubscriptionId = null;
    notes.push("Business Email subscription ended.");
  }
  if (next.stripeBookSubscriptionId === subscriptionId) {
    next.bookAJob = false;
    next.stripeBookSubscriptionId = null;
    notes.push("Book a job subscription ended.");
  }
  if (next.stripeMissedCallSubscriptionId === subscriptionId) {
    next.missedCallTextback = false;
    next.stripeMissedCallSubscriptionId = null;
    notes.push("Missed-call text-back subscription ended.");
  }
  if (next.stripeReviewTextsSubscriptionId === subscriptionId) {
    next.reviewTexts = false;
    next.stripeReviewTextsSubscriptionId = null;
    notes.push("Review texts subscription ended.");
  }
  if (next.stripeVoiceSubscriptionId === subscriptionId) {
    next.voiceReceptionist = false;
    next.stripeVoiceSubscriptionId = null;
    notes.push("Voice receptionist subscription ended.");
  }
  return withAddonNotes(next, notes);
}

function addonFailureNotes(
  client: Client,
  kind: CheckoutKind,
  subscriptionId?: string,
  pastDue = false,
) {
  const failed = pastDue ? "is past due" : "payment failed";
  const bodies: string[] = [];
  if (
    kindHasBoost(kind) ||
    client.stripeBoostSubscriptionId === subscriptionId
  ) {
    bodies.push(`Local Boost ${failed}. Website hosting is unchanged.`);
  }
  if (
    kindHasTraffic(kind) ||
    client.stripeTrafficSubscriptionId === subscriptionId
  ) {
    bodies.push(`Traffic ${failed}. Website hosting is unchanged.`);
  }
  if (kindHasLoud(kind) || client.stripeLoudSubscriptionId === subscriptionId) {
    bodies.push(`Loud ${failed}. Website hosting is unchanged.`);
  }
  if (
    kindHasEmail(kind) ||
    client.stripeEmailSubscriptionId === subscriptionId
  ) {
    bodies.push(`Business Email ${failed}. Website hosting is unchanged.`);
  }
  return bodies.length
    ? bodies
    : [
        pastDue
          ? "Add-on is past due. Website hosting is unchanged."
          : "Add-on payment failed. Website hosting is unchanged.",
      ];
}

async function markLeadPurchased(clientId: string, leadId?: string) {
  const fromMeta = leadId ? await getLead(leadId) : null;
  const lead = fromMeta || (await getLeadByClientId(clientId));
  if (!lead) return;
  await updateLead(lead.id, { purchased: true, clientId });
}

async function applyCloserSold(
  client: Client,
  code: string | undefined,
): Promise<Client> {
  const closerCode = sanitizeCloserCode(code) || sanitizeCloserCode(client.closerCode);
  if (!closerCode) return client;
  if (client.closerCode === closerCode) {
    if (client.notes.some((row) => row.body.includes("Pay them the $200 launch"))) {
      return client;
    }
  }
  const closer = await getCloserByCode(closerCode);
  const label = closer ? `${closer.name} (${closer.code})` : closerCode;
  if (client.notes.some((row) => row.body.includes(`Sold by ${label}`))) {
    return { ...client, closerCode };
  }
  return {
    ...client,
    closerCode,
    notes: [
      {
        id: `note_${crypto.randomUUID()}`,
        body: launchSoldNote(label),
        createdAt: new Date().toISOString(),
      },
      ...client.notes,
    ],
  };
}

async function findClientFromEvent(event: Stripe.Event) {
  const object = event.data.object as {
    metadata?: { clientId?: string };
    customer?: string | { id?: string } | null;
    subscription?: string | { id?: string } | null;
    id?: string;
  };
  if (object.metadata?.clientId) {
    const byMeta = await getClient(object.metadata.clientId);
    if (byMeta) return byMeta;
  }
  const customerId = asId(object.customer);
  if (customerId) {
    const byCustomer = await getClientByStripeCustomer(customerId);
    if (byCustomer) return byCustomer;
  }
  const subId =
    asId(object.subscription) ||
    (event.type.startsWith("customer.subscription") ? object.id : undefined);
  if (subId) {
    const bySub = await getClientByStripeSubscription(subId);
    if (bySub) return bySub;
  }
  return null;
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 501 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const client = await findClientFromEvent(event);
  if (!client) {
    return NextResponse.json({ received: true, unmatched: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = asId(session.customer);
    const subscriptionId = asId(session.subscription);
    const kind = metadataKind(session.metadata);
    const addOns = await sessionAddOns(stripe, session);
    const extras = extrasFromMetadata(session.metadata);
    const resolvedKind = kindFromAddOns(addOns, kindHasPlan(kind), kind);
    let next = applyCheckoutIds(
      client,
      resolvedKind,
      customerId,
      subscriptionId,
      extras,
    );
    if (kindHasPlan(resolvedKind)) {
      next = applyPaymentSucceeded({
        ...next,
        siteStatus: client.siteStatus === "paused" ? "live" : client.siteStatus,
      });
    }
    next = applyPurchasedAddOns(next, addOns, extras);
    if (kindHasPlan(resolvedKind)) {
      const leadForCloser = session.metadata?.leadId
        ? await getLead(session.metadata.leadId)
        : null;
      next = await applyCloserSold(
        next,
        session.metadata?.closerCode || leadForCloser?.closerCode || undefined,
      );
    }
    await upsertClient(next);
    if (kindHasPlan(resolvedKind)) {
      await markLeadPurchased(next.id, session.metadata?.leadId);
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice & {
      subscription?: string | { id?: string } | null;
    };
    const customerId = asId(invoice.customer);
    const parentSub = invoice.parent?.subscription_details?.subscription;
    const legacySub = invoice.subscription;
    const subscriptionId = asId(parentSub ?? legacySub);
    const nextInvoice = invoice.lines.data[0]?.period?.end
      ? new Date(invoice.lines.data[0].period.end * 1000).toISOString()
      : undefined;
    const addOns = invoiceAddOns(invoice);
    const extras = extrasFromMetadata(
      invoice.metadata || invoice.parent?.subscription_details?.metadata,
    );
    const kind = invoiceKind(invoice, addOns);
    let next = applyCheckoutIds(client, kind, customerId, subscriptionId, extras);
    if (kindHasPlan(kind)) {
      next = applyPaymentSucceeded(next, new Date().toISOString(), nextInvoice);
    }
    next = applyPurchasedAddOns(next, addOns, extras);
    await upsertClient(next);
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice & {
      subscription?: string | { id?: string } | null;
    };
    const parentSub = invoice.parent?.subscription_details?.subscription;
    const subscriptionId = asId(parentSub ?? invoice.subscription);
    const addOns = invoiceAddOns(invoice);
    const kind = invoiceKind(invoice, addOns);
    if (isAddonOnlySubscription(client, subscriptionId) || !kindHasPlan(kind)) {
      await upsertClient(
        withAddonNotes(client, addonFailureNotes(client, kind, subscriptionId)),
      );
    } else {
      await upsertClient(applyPaymentFailed(client));
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    if (
      isAddonOnlySubscription(client, sub.id) ||
      !kindHasPlan(metadataKind(sub.metadata))
    ) {
      await upsertClient(clearAddonSubscription(client, sub.id));
    } else {
      await upsertClient(applyPaymentFailed(client));
    }
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const kind = metadataKind(sub.metadata);
    const addonOnly =
      isAddonOnlySubscription(client, sub.id) || !kindHasPlan(kind);
    if (sub.status === "past_due" || sub.status === "unpaid") {
      if (addonOnly) {
        await upsertClient(
          withAddonNotes(
            client,
            addonFailureNotes(client, kind, sub.id, true),
          ),
        );
      } else {
        await upsertClient(applyPaymentFailed(client));
      }
    }
    if (sub.status === "active") {
      let next: Client = applyCheckoutIds(
        client,
        kind,
        asId(sub.customer),
        sub.id,
        extrasFromMetadata(sub.metadata),
      );
      if (!addonOnly) {
        next = applyPaymentSucceeded(next);
      }
      next = applyPurchasedAddOns(
        next,
        {
          boost: metadataBoost(sub.metadata),
          traffic: metadataTraffic(sub.metadata),
          loud: metadataLoud(sub.metadata),
          email: metadataEmail(sub.metadata),
        },
        extrasFromMetadata(sub.metadata),
      );
      await upsertClient(next);
    }
  }

  return NextResponse.json({ received: true });
}
