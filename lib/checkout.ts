import {
  COMPANY,
  publicSiteUrl,
  stripeBoostConfigured,
  stripeConfigured,
} from "@/lib/config";
import { getStripe } from "@/lib/stripe";
import { getClient, getLead, listClients, upsertClient } from "@/lib/store";
import { uniqueSlug } from "@/lib/slug";
import type { Client } from "@/lib/types";

export type CheckoutKind = "plan" | "plan_and_boost" | "boost";

export const BOOST_NOT_CONFIGURED =
  "Local Boost is not connected yet. Uncheck the add-on to pay for the $200 launch and $69/month plan, or try again after the Boost prices are set.";

export const STRIPE_NOT_CONFIGURED =
  "Stripe is not configured. Add STRIPE_SECRET_KEY, STRIPE_SETUP_PRICE_ID, and STRIPE_MONTHLY_PRICE_ID.";

export function resolveCheckoutKind(input: {
  includeBoost?: boolean;
  boostOnly?: boolean;
  alreadyPaid?: boolean;
}): CheckoutKind {
  if (input.boostOnly) return "boost";
  if (!input.includeBoost) return "plan";
  return input.alreadyPaid ? "boost" : "plan_and_boost";
}

function requirePrice(id: string | undefined, message: string) {
  if (!id) throw new Error(message);
  return { price: id, quantity: 1 };
}

export function checkoutLineItems(kind: CheckoutKind) {
  const items: { price: string; quantity: number }[] = [];
  if (kind !== "boost") {
    items.push(
      requirePrice(process.env.STRIPE_SETUP_PRICE_ID, STRIPE_NOT_CONFIGURED),
      requirePrice(process.env.STRIPE_MONTHLY_PRICE_ID, STRIPE_NOT_CONFIGURED),
    );
  }
  if (kind !== "plan") {
    items.push(
      requirePrice(process.env.STRIPE_BOOST_SETUP_PRICE_ID, BOOST_NOT_CONFIGURED),
      requirePrice(
        process.env.STRIPE_BOOST_MONTHLY_PRICE_ID,
        BOOST_NOT_CONFIGURED,
      ),
    );
  }
  return items;
}

export async function createCheckoutForClient(
  client: Client,
  options: { includeBoost?: boolean; boostOnly?: boolean } = {},
) {
  const kind = resolveCheckoutKind({
    includeBoost: options.includeBoost,
    boostOnly: options.boostOnly,
    alreadyPaid: client.paymentStatus === "paid",
  });

  if (kind === "plan") {
    if (!stripeConfigured()) throw new Error(STRIPE_NOT_CONFIGURED);
  } else if (!stripeBoostConfigured()) {
    throw new Error(BOOST_NOT_CONFIGURED);
  } else if (kind === "plan_and_boost" && !stripeConfigured()) {
    throw new Error(STRIPE_NOT_CONFIGURED);
  }

  const stripe = getStripe();
  if (!stripe) throw new Error(STRIPE_NOT_CONFIGURED);

  const includeBoost = kind !== "plan";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: client.stripeCustomerId ? undefined : client.email || undefined,
    customer: client.stripeCustomerId || undefined,
    line_items: checkoutLineItems(kind),
    success_url: `${publicSiteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${publicSiteUrl()}/checkout/cancel`,
    metadata: {
      clientId: client.id,
      checkoutKind: kind,
      localBoost: includeBoost ? "true" : "false",
    },
    subscription_data: {
      metadata: {
        clientId: client.id,
        checkoutKind: kind,
        localBoost: includeBoost ? "true" : "false",
      },
      description:
        kind === "boost"
          ? `${COMPANY.shortName} Local Boost for ${client.businessName}`
          : `${COMPANY.shortName} hosting for ${client.businessName}`,
    },
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return session.url;
}

function newClientFromLeadFields(
  lead: NonNullable<Awaited<ReturnType<typeof getLead>>>,
  taken: string[],
): Client {
  return {
    id: `cli_${crypto.randomUUID()}`,
    businessName: lead.businessName,
    slug: uniqueSlug(lead.businessName, taken),
    contactName: lead.name,
    email: lead.email,
    phone: lead.phone,
    address: "",
    city: lead.city || "Arizona",
    hours: "",
    tagline: lead.businessName,
    about: lead.message || `${lead.businessName} is a local Arizona business.`,
    services: [],
    template: "professional",
    customDomain: null,
    siteStatus: "paused",
    paymentStatus: "unpaid",
    lastPaymentAt: null,
    nextInvoiceAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeBoostSubscriptionId: null,
    localBoost: false,
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    notes: lead.wantsLocalBoost
      ? [
          {
            id: `note_${crypto.randomUUID()}`,
            body: "Asked for optional Local Boost at signup (not paid until checkout completes).",
            createdAt: new Date().toISOString(),
          },
        ]
      : [],
    editRequests: [],
    createdAt: new Date().toISOString(),
  };
}

export async function clientFromLead(leadId: string) {
  const lead = await getLead(leadId);
  if (!lead) return null;
  const taken = (await listClients()).map((c) => c.slug);
  const client = newClientFromLeadFields(lead, taken);
  await upsertClient(client);
  return client;
}

export async function resolveCheckoutClient(input: {
  leadId?: string;
  clientId?: string;
}) {
  if (input.clientId) return getClient(input.clientId);
  if (input.leadId) return clientFromLead(input.leadId);
  return null;
}
