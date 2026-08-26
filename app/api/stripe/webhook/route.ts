import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  getClient,
  getClientByStripeCustomer,
  getClientByStripeSubscription,
  upsertClient,
} from "@/lib/store";
import { applyPaymentFailed, applyPaymentSucceeded } from "@/lib/billing";

export const runtime = "nodejs";

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
  const customerId =
    typeof object.customer === "string"
      ? object.customer
      : object.customer?.id;
  if (customerId) {
    const byCustomer = await getClientByStripeCustomer(customerId);
    if (byCustomer) return byCustomer;
  }
  const subId =
    typeof object.subscription === "string"
      ? object.subscription
      : object.subscription?.id ||
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
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;
    const next = applyPaymentSucceeded({
      ...client,
      stripeCustomerId: customerId || client.stripeCustomerId,
      stripeSubscriptionId: subscriptionId || client.stripeSubscriptionId,
      siteStatus: client.siteStatus === "paused" ? "live" : client.siteStatus,
    });
    await upsertClient(next);
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice & {
      subscription?: string | { id?: string } | null;
    };
    const customerId =
      typeof invoice.customer === "string"
        ? invoice.customer
        : invoice.customer?.id;
    const parentSub = invoice.parent?.subscription_details?.subscription;
    const legacySub = invoice.subscription;
    const sub = parentSub ?? legacySub;
    const subscriptionId = typeof sub === "string" ? sub : sub?.id;
    const nextInvoice =
      invoice.lines.data[0]?.period?.end
        ? new Date(invoice.lines.data[0].period.end * 1000).toISOString()
        : undefined;
    const next = applyPaymentSucceeded(
      {
        ...client,
        stripeCustomerId: customerId || client.stripeCustomerId,
        stripeSubscriptionId: subscriptionId || client.stripeSubscriptionId,
      },
      new Date().toISOString(),
      nextInvoice,
    );
    await upsertClient(next);
  }

  if (
    event.type === "invoice.payment_failed" ||
    event.type === "customer.subscription.deleted"
  ) {
    await upsertClient(applyPaymentFailed(client));
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    if (sub.status === "past_due" || sub.status === "unpaid") {
      await upsertClient(applyPaymentFailed(client));
    }
    if (sub.status === "active") {
      await upsertClient(
        applyPaymentSucceeded({
          ...client,
          stripeSubscriptionId: sub.id,
        }),
      );
    }
  }

  return NextResponse.json({ received: true });
}
