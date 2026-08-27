import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { applyLocalBoostPurchased, applyPaymentFailed, applyPaymentSucceeded } from "@/lib/billing";
import { boostPriceIds } from "@/lib/config";
import {
  getClient,
  getClientByStripeCustomer,
  getClientByStripeSubscription,
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
    meta?.checkoutKind === "plan_and_boost" ||
    meta?.checkoutKind === "boost"
  );
}

function metadataKind(meta?: Stripe.Metadata | null) {
  const kind = meta?.checkoutKind;
  if (kind === "boost" || kind === "plan_and_boost" || kind === "plan") {
    return kind;
  }
  return metadataBoost(meta) ? "plan_and_boost" : "plan";
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

function idsIncludeBoost(priceIds: Array<string | undefined>) {
  const boost = new Set(boostPriceIds());
  if (boost.size === 0) return false;
  return priceIds.some((id) => id && boost.has(id));
}

async function sessionBoughtBoost(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  if (metadataBoost(session.metadata)) return true;
  if (boostPriceIds().length === 0) return false;
  try {
    const items = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 20,
    });
    return idsIncludeBoost(items.data.map((item) => linePriceId(item)));
  } catch {
    return false;
  }
}

function invoiceBoughtBoost(invoice: Stripe.Invoice) {
  if (
    metadataBoost(invoice.metadata) ||
    metadataBoost(invoice.parent?.subscription_details?.metadata)
  ) {
    return true;
  }
  return idsIncludeBoost(invoice.lines.data.map((line) => linePriceId(line)));
}

function invoiceHasBaseMonthly(invoice: Stripe.Invoice) {
  const base = process.env.STRIPE_MONTHLY_PRICE_ID;
  if (!base) return false;
  return invoice.lines.data.some((line) => linePriceId(line) === base);
}

function isBoostOnlySubscription(client: Client, subscriptionId?: string) {
  return Boolean(
    subscriptionId &&
      client.stripeBoostSubscriptionId === subscriptionId &&
      client.stripeSubscriptionId !== subscriptionId,
  );
}

function invoiceKind(
  invoice: Stripe.Invoice,
  boughtBoost: boolean,
): ReturnType<typeof metadataKind> {
  const hasBase = invoiceHasBaseMonthly(invoice);
  if (hasBase) return boughtBoost ? "plan_and_boost" : "plan";
  if (boughtBoost) return "boost";
  return metadataKind(
    invoice.metadata || invoice.parent?.subscription_details?.metadata,
  );
}

function applyCheckoutIds(
  client: Client,
  kind: ReturnType<typeof metadataKind>,
  customerId?: string,
  subscriptionId?: string,
): Client {
  const next = {
    ...client,
    stripeCustomerId: customerId || client.stripeCustomerId,
  };
  if (kind === "boost") {
    return {
      ...next,
      stripeBoostSubscriptionId:
        subscriptionId || client.stripeBoostSubscriptionId,
    };
  }
  return {
    ...next,
    stripeSubscriptionId: subscriptionId || client.stripeSubscriptionId,
    stripeBoostSubscriptionId:
      kind === "plan_and_boost"
        ? subscriptionId || client.stripeBoostSubscriptionId
        : client.stripeBoostSubscriptionId,
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
    const boughtBoost = await sessionBoughtBoost(stripe, session);
    const resolvedKind =
      kind === "boost"
        ? "boost"
        : boughtBoost
          ? "plan_and_boost"
          : kind;
    let next = applyCheckoutIds(client, resolvedKind, customerId, subscriptionId);
    if (resolvedKind !== "boost") {
      next = applyPaymentSucceeded({
        ...next,
        siteStatus: client.siteStatus === "paused" ? "live" : client.siteStatus,
      });
    }
    if (boughtBoost) next = applyLocalBoostPurchased(next);
    await upsertClient(next);
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
    const boughtBoost = invoiceBoughtBoost(invoice);
    const kind = invoiceKind(invoice, boughtBoost);
    let next = applyCheckoutIds(client, kind, customerId, subscriptionId);
    if (kind !== "boost") {
      next = applyPaymentSucceeded(next, new Date().toISOString(), nextInvoice);
    }
    if (boughtBoost) next = applyLocalBoostPurchased(next);
    await upsertClient(next);
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice & {
      subscription?: string | { id?: string } | null;
    };
    const parentSub = invoice.parent?.subscription_details?.subscription;
    const subscriptionId = asId(parentSub ?? invoice.subscription);
    if (isBoostOnlySubscription(client, subscriptionId) || invoiceKind(invoice, invoiceBoughtBoost(invoice)) === "boost") {
      await upsertClient({
        ...client,
        notes: [
          {
            id: `note_${crypto.randomUUID()}`,
            body: "Local Boost payment failed. Website hosting is unchanged.",
            createdAt: new Date().toISOString(),
          },
          ...client.notes,
        ],
      });
    } else {
      await upsertClient(applyPaymentFailed(client));
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    if (isBoostOnlySubscription(client, sub.id) || metadataKind(sub.metadata) === "boost") {
      await upsertClient({
        ...client,
        localBoost: false,
        stripeBoostSubscriptionId: null,
        notes: [
          {
            id: `note_${crypto.randomUUID()}`,
            body: "Local Boost subscription ended.",
            createdAt: new Date().toISOString(),
          },
          ...client.notes,
        ],
      });
    } else {
      await upsertClient(applyPaymentFailed(client));
    }
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const boostOnly =
      isBoostOnlySubscription(client, sub.id) ||
      metadataKind(sub.metadata) === "boost";
    if (sub.status === "past_due" || sub.status === "unpaid") {
      if (boostOnly) {
        await upsertClient({
          ...client,
          notes: [
            {
              id: `note_${crypto.randomUUID()}`,
              body: "Local Boost is past due. Website hosting is unchanged.",
              createdAt: new Date().toISOString(),
            },
            ...client.notes,
          ],
        });
      } else {
        await upsertClient(applyPaymentFailed(client));
      }
    }
    if (sub.status === "active") {
      let next: Client = client;
      if (!boostOnly) {
        next = applyPaymentSucceeded({
          ...next,
          stripeSubscriptionId: sub.id,
          stripeBoostSubscriptionId:
            metadataKind(sub.metadata) === "plan_and_boost"
              ? sub.id
              : client.stripeBoostSubscriptionId,
        });
      } else {
        next = {
          ...next,
          stripeBoostSubscriptionId: sub.id,
        };
      }
      if (metadataBoost(sub.metadata)) {
        next = applyLocalBoostPurchased(next);
      }
      await upsertClient(next);
    }
  }

  return NextResponse.json({ received: true });
}
