import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  applyBusinessEmailPurchased,
  applyLocalBoostPurchased,
  applyPaymentFailed,
  applyPaymentSucceeded,
} from "@/lib/billing";
import {
  isCheckoutKind,
  kindHasBoost,
  kindHasEmail,
  kindHasPlan,
  type CheckoutKind,
} from "@/lib/checkout";
import { boostPriceIds, emailPriceIds } from "@/lib/config";
import {
  getClient,
  getClientByStripeCustomer,
  getClientByStripeSubscription,
  getLead,
  getLeadByClientId,
  updateLead,
  upsertClient,
} from "@/lib/store";
import { getStripe } from "@/lib/stripe";
import type { Client } from "@/lib/types";

export const runtime = "nodejs";

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

function metadataEmail(meta?: Stripe.Metadata | null) {
  return (
    meta?.businessEmail === "true" ||
    (isCheckoutKind(meta?.checkoutKind) && kindHasEmail(meta.checkoutKind))
  );
}

function metadataKind(meta?: Stripe.Metadata | null): CheckoutKind {
  if (isCheckoutKind(meta?.checkoutKind)) return meta.checkoutKind;
  const boost = metadataBoost(meta);
  const email = metadataEmail(meta);
  if (boost && email) return "plan_and_boost_and_email";
  if (boost) return "plan_and_boost";
  if (email) return "plan_and_email";
  return "plan";
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
) {
  const fromMetaBoost = metadataBoost(session.metadata);
  const fromMetaEmail = metadataEmail(session.metadata);
  if (fromMetaBoost && fromMetaEmail) {
    return { boost: true, email: true };
  }
  const prices = await sessionLinePriceIds(stripe, session);
  return {
    boost: fromMetaBoost || idsInclude(prices, boostPriceIds()),
    email: fromMetaEmail || idsInclude(prices, emailPriceIds()),
  };
}

function invoiceAddOns(invoice: Stripe.Invoice) {
  const meta =
    invoice.metadata || invoice.parent?.subscription_details?.metadata;
  const prices = invoice.lines.data.map((line) => linePriceId(line));
  return {
    boost:
      metadataBoost(meta) ||
      metadataBoost(invoice.metadata) ||
      idsInclude(prices, boostPriceIds()),
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
    client.stripeEmailSubscriptionId === subscriptionId
  );
}

function invoiceKind(
  invoice: Stripe.Invoice,
  addOns: { boost: boolean; email: boolean },
): CheckoutKind {
  const hasBase = invoiceHasBaseMonthly(invoice);
  if (hasBase) {
    if (addOns.boost && addOns.email) return "plan_and_boost_and_email";
    if (addOns.boost) return "plan_and_boost";
    if (addOns.email) return "plan_and_email";
    return "plan";
  }
  if (addOns.boost && addOns.email) return "boost_and_email";
  if (addOns.boost) return "boost";
  if (addOns.email) return "email";
  return metadataKind(
    invoice.metadata || invoice.parent?.subscription_details?.metadata,
  );
}

function applyCheckoutIds(
  client: Client,
  kind: CheckoutKind,
  customerId?: string,
  subscriptionId?: string,
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
  if (kindHasEmail(kind)) {
    next.stripeEmailSubscriptionId = subscriptionId;
  }
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

function clearAddonSubscription(client: Client, subscriptionId: string): Client {
  const next = { ...client };
  const notes: string[] = [];
  if (next.stripeBoostSubscriptionId === subscriptionId) {
    next.localBoost = false;
    next.stripeBoostSubscriptionId = null;
    notes.push("Local Boost subscription ended.");
  }
  if (next.stripeEmailSubscriptionId === subscriptionId) {
    next.businessEmail = false;
    next.stripeEmailSubscriptionId = null;
    notes.push("Business Email subscription ended.");
  }
  return withAddonNotes(next, notes);
}

async function markLeadPurchased(clientId: string, leadId?: string) {
  const fromMeta = leadId ? await getLead(leadId) : null;
  const lead = fromMeta || (await getLeadByClientId(clientId));
  if (!lead) return;
  await updateLead(lead.id, { purchased: true, clientId });
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
    let resolvedKind: CheckoutKind = kind;
    if (!kindHasPlan(kind)) {
      resolvedKind = kind;
    } else if (addOns.boost && addOns.email) {
      resolvedKind = "plan_and_boost_and_email";
    } else if (addOns.boost) {
      resolvedKind = "plan_and_boost";
    } else if (addOns.email) {
      resolvedKind = "plan_and_email";
    }
    let next = applyCheckoutIds(client, resolvedKind, customerId, subscriptionId);
    if (kindHasPlan(resolvedKind)) {
      next = applyPaymentSucceeded({
        ...next,
        siteStatus: client.siteStatus === "paused" ? "live" : client.siteStatus,
      });
    }
    if (addOns.boost) next = applyLocalBoostPurchased(next);
    if (addOns.email) next = applyBusinessEmailPurchased(next);
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
    const kind = invoiceKind(invoice, addOns);
    let next = applyCheckoutIds(client, kind, customerId, subscriptionId);
    if (kindHasPlan(kind)) {
      next = applyPaymentSucceeded(next, new Date().toISOString(), nextInvoice);
    }
    if (addOns.boost) next = applyLocalBoostPurchased(next);
    if (addOns.email) next = applyBusinessEmailPurchased(next);
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
      const bodies: string[] = [];
      if (kindHasBoost(kind) || client.stripeBoostSubscriptionId === subscriptionId) {
        bodies.push("Local Boost payment failed. Website hosting is unchanged.");
      }
      if (kindHasEmail(kind) || client.stripeEmailSubscriptionId === subscriptionId) {
        bodies.push(
          "Business Email payment failed. Website hosting is unchanged.",
        );
      }
      await upsertClient(
        withAddonNotes(
          client,
          bodies.length
            ? bodies
            : ["Add-on payment failed. Website hosting is unchanged."],
        ),
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
        const bodies: string[] = [];
        if (kindHasBoost(kind) || client.stripeBoostSubscriptionId === sub.id) {
          bodies.push(
            "Local Boost is past due. Website hosting is unchanged.",
          );
        }
        if (kindHasEmail(kind) || client.stripeEmailSubscriptionId === sub.id) {
          bodies.push(
            "Business Email is past due. Website hosting is unchanged.",
          );
        }
        await upsertClient(
          withAddonNotes(
            client,
            bodies.length
              ? bodies
              : ["Add-on is past due. Website hosting is unchanged."],
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
      );
      if (!addonOnly) {
        next = applyPaymentSucceeded(next);
      }
      if (metadataBoost(sub.metadata)) {
        next = applyLocalBoostPurchased(next);
      }
      if (metadataEmail(sub.metadata)) {
        next = applyBusinessEmailPurchased(next);
      }
      await upsertClient(next);
    }
  }

  return NextResponse.json({ received: true });
}
