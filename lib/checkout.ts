import { COMPANY, publicSiteUrl, stripeConfigured } from "@/lib/config";
import { getStripe } from "@/lib/stripe";
import { getClient, getLead, listClients, upsertClient } from "@/lib/store";
import { uniqueSlug } from "@/lib/slug";
import type { Client } from "@/lib/types";

export async function createCheckoutForClient(client: Client) {
  if (!stripeConfigured()) {
    throw new Error(
      "Stripe is not configured. Add STRIPE_SECRET_KEY, STRIPE_SETUP_PRICE_ID, and STRIPE_MONTHLY_PRICE_ID.",
    );
  }
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured.");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: client.stripeCustomerId ? undefined : client.email || undefined,
    customer: client.stripeCustomerId || undefined,
    line_items: [
      { price: process.env.STRIPE_SETUP_PRICE_ID, quantity: 1 },
      { price: process.env.STRIPE_MONTHLY_PRICE_ID, quantity: 1 },
    ],
    success_url: `${publicSiteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${publicSiteUrl()}/checkout/cancel`,
    metadata: { clientId: client.id },
    subscription_data: {
      metadata: { clientId: client.id },
      description: `${COMPANY.shortName} hosting for ${client.businessName}`,
    },
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return session.url;
}

export async function clientFromLead(leadId: string) {
  const lead = await getLead(leadId);
  if (!lead) return null;
  const taken = (await listClients()).map((c) => c.slug);
  const client: Client = {
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
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    notes: [],
    editRequests: [],
    createdAt: new Date().toISOString(),
  };
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
