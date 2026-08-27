import {
  COMPANY,
  publicSiteUrl,
  stripeBoostConfigured,
  stripeConfigured,
  stripeEmailConfigured,
} from "@/lib/config";
import { getStripe } from "@/lib/stripe";
import { getClient, getLead, listClients, upsertClient } from "@/lib/store";
import { uniqueSlug } from "@/lib/slug";
import type { Client } from "@/lib/types";

export const CHECKOUT_KINDS = [
  "plan",
  "plan_and_boost",
  "plan_and_email",
  "plan_and_boost_and_email",
  "boost",
  "email",
  "boost_and_email",
] as const;

export type CheckoutKind = (typeof CHECKOUT_KINDS)[number];

export const BOOST_NOT_CONFIGURED =
  "Local Boost is not connected yet. Uncheck the add-on to pay for the $200 launch and $69/month plan, or try again after the Boost prices are set.";

export const EMAIL_NOT_CONFIGURED =
  "Business Email is not connected yet. Uncheck the add-on to pay for the $200 launch and $69/month plan, or try again after the Business Email prices are set.";

export const STRIPE_NOT_CONFIGURED =
  "Stripe is not configured. Add STRIPE_SECRET_KEY, STRIPE_SETUP_PRICE_ID, and STRIPE_MONTHLY_PRICE_ID.";

export function isCheckoutKind(
  value: string | undefined | null,
): value is CheckoutKind {
  return CHECKOUT_KINDS.includes(value as CheckoutKind);
}

export function kindHasPlan(kind: CheckoutKind) {
  return kind === "plan" || kind.startsWith("plan_and_");
}

export function kindHasBoost(kind: CheckoutKind) {
  return kind === "boost" || kind.includes("boost");
}

export function kindHasEmail(kind: CheckoutKind) {
  return kind === "email" || kind.includes("email");
}

export function resolveCheckoutKind(input: {
  includeBoost?: boolean;
  includeEmail?: boolean;
  boostOnly?: boolean;
  emailOnly?: boolean;
  alreadyPaid?: boolean;
}): CheckoutKind {
  const boost = Boolean(input.boostOnly || input.includeBoost);
  const email = Boolean(input.emailOnly || input.includeEmail);
  const addonOnly =
    Boolean(input.boostOnly || input.emailOnly) ||
    (Boolean(input.alreadyPaid) && (boost || email));

  if (addonOnly) {
    if (boost && email) return "boost_and_email";
    if (boost) return "boost";
    if (email) return "email";
  }
  if (boost && email) return "plan_and_boost_and_email";
  if (boost) return "plan_and_boost";
  if (email) return "plan_and_email";
  return "plan";
}

function requirePrice(id: string | undefined, message: string) {
  if (!id) throw new Error(message);
  return { price: id, quantity: 1 };
}

export function checkoutLineItems(kind: CheckoutKind) {
  const items: { price: string; quantity: number }[] = [];
  if (kindHasPlan(kind)) {
    items.push(
      requirePrice(process.env.STRIPE_SETUP_PRICE_ID, STRIPE_NOT_CONFIGURED),
      requirePrice(process.env.STRIPE_MONTHLY_PRICE_ID, STRIPE_NOT_CONFIGURED),
    );
  }
  if (kindHasBoost(kind)) {
    items.push(
      requirePrice(process.env.STRIPE_BOOST_SETUP_PRICE_ID, BOOST_NOT_CONFIGURED),
      requirePrice(
        process.env.STRIPE_BOOST_MONTHLY_PRICE_ID,
        BOOST_NOT_CONFIGURED,
      ),
    );
  }
  if (kindHasEmail(kind)) {
    items.push(
      requirePrice(process.env.STRIPE_EMAIL_SETUP_PRICE_ID, EMAIL_NOT_CONFIGURED),
      requirePrice(
        process.env.STRIPE_EMAIL_MONTHLY_PRICE_ID,
        EMAIL_NOT_CONFIGURED,
      ),
    );
  }
  return items;
}

function checkoutDescription(kind: CheckoutKind, businessName: string) {
  if (kind === "email") {
    return `${COMPANY.shortName} Business Email for ${businessName}`;
  }
  if (kind === "boost") {
    return `${COMPANY.shortName} Local Boost for ${businessName}`;
  }
  if (kind === "boost_and_email") {
    return `${COMPANY.shortName} add-ons for ${businessName}`;
  }
  return `${COMPANY.shortName} hosting for ${businessName}`;
}

export async function createCheckoutForClient(
  client: Client,
  options: {
    includeBoost?: boolean;
    includeEmail?: boolean;
    boostOnly?: boolean;
    emailOnly?: boolean;
  } = {},
) {
  const kind = resolveCheckoutKind({
    includeBoost: options.includeBoost,
    includeEmail: options.includeEmail,
    boostOnly: options.boostOnly,
    emailOnly: options.emailOnly,
    alreadyPaid: client.paymentStatus === "paid",
  });

  if (kindHasPlan(kind) && !stripeConfigured()) {
    throw new Error(STRIPE_NOT_CONFIGURED);
  }
  if (kindHasBoost(kind) && !stripeBoostConfigured()) {
    throw new Error(BOOST_NOT_CONFIGURED);
  }
  if (kindHasEmail(kind) && !stripeEmailConfigured()) {
    throw new Error(EMAIL_NOT_CONFIGURED);
  }

  const stripe = getStripe();
  if (!stripe) throw new Error(STRIPE_NOT_CONFIGURED);

  const includeBoost = kindHasBoost(kind);
  const includeEmail = kindHasEmail(kind);
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
      businessEmail: includeEmail ? "true" : "false",
    },
    subscription_data: {
      metadata: {
        clientId: client.id,
        checkoutKind: kind,
        localBoost: includeBoost ? "true" : "false",
        businessEmail: includeEmail ? "true" : "false",
      },
      description: checkoutDescription(kind, client.businessName),
    },
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return session.url;
}

function newClientFromLeadFields(
  lead: NonNullable<Awaited<ReturnType<typeof getLead>>>,
  taken: string[],
): Client {
  const notes: Client["notes"] = [];
  if (lead.wantsLocalBoost) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: "Asked for optional Local Boost at signup (not paid until checkout completes).",
      createdAt: new Date().toISOString(),
    });
  }
  if (lead.wantsBusinessEmail) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: "Asked for optional Business Email at signup (not paid until checkout completes).",
      createdAt: new Date().toISOString(),
    });
  }
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
    stripeEmailSubscriptionId: null,
    businessEmail: false,
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    notes,
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
