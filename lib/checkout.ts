import { ADS_ALREADY_ACTIVE } from "@/lib/ads";
import {
  BOOST_NOT_CONFIGURED,
  checkoutLineItems,
  EMAIL_NOT_CONFIGURED,
  kindHasBoost,
  kindHasEmail,
  kindHasLoud,
  kindHasPlan,
  kindHasTraffic,
  LOUD_NOT_CONFIGURED,
  resolveCheckoutKind,
  STRIPE_NOT_CONFIGURED,
  TRAFFIC_NOT_CONFIGURED,
  type CheckoutKind,
} from "@/lib/checkout-kind";
import {
  COMPANY,
  publicSiteUrl,
  stripeBookConfigured,
  stripeBoostConfigured,
  stripeConfigured,
  stripeEmailConfigured,
  stripeLoudConfigured,
  stripeMissedCallConfigured,
  stripeReviewTextsConfigured,
  stripeTrafficConfigured,
  stripeVoiceConfigured,
} from "@/lib/config";
import {
  BOOK_NOT_CONFIGURED,
  extraLineItems,
  extrasMetadata,
  MISSED_NOT_CONFIGURED,
  REVIEWS_NOT_CONFIGURED,
  VOICE_NOT_CONFIGURED,
  type PaidExtras,
} from "@/lib/site-addons";
import { buildClientFromLead } from "@/lib/demo";
import { getStripe } from "@/lib/stripe";
import { ensureLiveExtraPrices } from "@/lib/stripe-extra-prices";
import {
  getClient,
  getLead,
  listClients,
  updateLead,
  upsertClient,
} from "@/lib/store";
import type { Client } from "@/lib/types";

export {
  BOOST_NOT_CONFIGURED,
  CHECKOUT_KINDS,
  checkoutLineItems,
  EMAIL_NOT_CONFIGURED,
  isCheckoutKind,
  kindHasBoost,
  kindHasEmail,
  kindHasLoud,
  kindHasPlan,
  kindHasTraffic,
  LOUD_NOT_CONFIGURED,
  resolveCheckoutKind,
  STRIPE_NOT_CONFIGURED,
  TRAFFIC_NOT_CONFIGURED,
} from "@/lib/checkout-kind";
export type { CheckoutKind, CheckoutOptions } from "@/lib/checkout-kind";

function checkoutDescription(kind: CheckoutKind, businessName: string) {
  if (kind === "email") {
    return `${COMPANY.shortName} Business Email for ${businessName}`;
  }
  if (kind === "boost") {
    return `${COMPANY.shortName} Local Boost for ${businessName}`;
  }
  if (kind === "traffic") {
    return `${COMPANY.shortName} Traffic for ${businessName}`;
  }
  if (kind === "loud") {
    return `${COMPANY.shortName} Loud for ${businessName}`;
  }
  if (kind === "addons") {
    return `${COMPANY.shortName} add-ons for ${businessName}`;
  }
  if (
    kind === "boost_and_email" ||
    kind === "traffic_and_email" ||
    kind === "loud_and_email"
  ) {
    return `${COMPANY.shortName} add-ons for ${businessName}`;
  }
  return `${COMPANY.shortName} hosting for ${businessName}`;
}

function assertNoAdsConflict(client: Client, kind: CheckoutKind) {
  const buyingBoost = kindHasBoost(kind);
  const buyingTraffic = kindHasTraffic(kind);
  const buyingLoud = kindHasLoud(kind);
  if (buyingBoost && (client.trafficAds || client.loudAds)) {
    throw new Error(ADS_ALREADY_ACTIVE);
  }
  if (buyingTraffic && (client.localBoost || client.loudAds)) {
    throw new Error(ADS_ALREADY_ACTIVE);
  }
  if (buyingLoud && (client.localBoost || client.trafficAds)) {
    throw new Error(ADS_ALREADY_ACTIVE);
  }
}

export async function createCheckoutForClient(
  client: Client,
  options: {
    includeBoost?: boolean;
    includeTraffic?: boolean;
    includeLoud?: boolean;
    includeEmail?: boolean;
    boostOnly?: boolean;
    trafficOnly?: boolean;
    loudOnly?: boolean;
    emailOnly?: boolean;
    includeBook?: boolean;
    includeMissedCall?: boolean;
    includeReviews?: boolean;
    includeVoice?: boolean;
    bookOnly?: boolean;
    missedOnly?: boolean;
    reviewsOnly?: boolean;
    voiceOnly?: boolean;
    leadId?: string;
  } = {},
) {
  const extras: PaidExtras = {
    includeBook: Boolean(options.includeBook || options.bookOnly),
    includeMissedCall: Boolean(options.includeMissedCall || options.missedOnly),
    includeReviews: Boolean(options.includeReviews || options.reviewsOnly),
    includeVoice: Boolean(options.includeVoice || options.voiceOnly),
  };
  const buyingClassicAddon = Boolean(
    options.includeBoost ||
      options.includeTraffic ||
      options.includeLoud ||
      options.includeEmail ||
      options.boostOnly ||
      options.trafficOnly ||
      options.loudOnly ||
      options.emailOnly,
  );
  const extrasRequested = Boolean(
    extras.includeBook ||
      extras.includeMissedCall ||
      extras.includeReviews ||
      extras.includeVoice,
  );
  const extrasOnly =
    extrasRequested &&
    !buyingClassicAddon &&
    (client.paymentStatus === "paid" ||
      Boolean(
        options.bookOnly ||
          options.missedOnly ||
          options.reviewsOnly ||
          options.voiceOnly,
      ));
  const kind = extrasOnly
    ? "addons"
    : resolveCheckoutKind({
        includeBoost: options.includeBoost,
        includeTraffic: options.includeTraffic,
        includeLoud: options.includeLoud,
        includeEmail: options.includeEmail,
        boostOnly: options.boostOnly,
        trafficOnly: options.trafficOnly,
        loudOnly: options.loudOnly,
        emailOnly: options.emailOnly,
        alreadyPaid: client.paymentStatus === "paid",
      });

  assertNoAdsConflict(client, kind);
  if (extrasRequested) await ensureLiveExtraPrices();

  if (kindHasPlan(kind) && !stripeConfigured()) {
    throw new Error(STRIPE_NOT_CONFIGURED);
  }
  if (kindHasBoost(kind) && !stripeBoostConfigured()) {
    throw new Error(BOOST_NOT_CONFIGURED);
  }
  if (kindHasTraffic(kind) && !stripeTrafficConfigured()) {
    throw new Error(TRAFFIC_NOT_CONFIGURED);
  }
  if (kindHasLoud(kind) && !stripeLoudConfigured()) {
    throw new Error(LOUD_NOT_CONFIGURED);
  }
  if (kindHasEmail(kind) && !stripeEmailConfigured()) {
    throw new Error(EMAIL_NOT_CONFIGURED);
  }
  if (extras.includeBook && !stripeBookConfigured()) {
    throw new Error(BOOK_NOT_CONFIGURED);
  }
  if (extras.includeMissedCall && !stripeMissedCallConfigured()) {
    throw new Error(MISSED_NOT_CONFIGURED);
  }
  if (extras.includeReviews && !stripeReviewTextsConfigured()) {
    throw new Error(REVIEWS_NOT_CONFIGURED);
  }
  if (extras.includeVoice && !stripeVoiceConfigured()) {
    throw new Error(VOICE_NOT_CONFIGURED);
  }

  const stripe = getStripe();
  if (!stripe) throw new Error(STRIPE_NOT_CONFIGURED);

  const includeBoost = kindHasBoost(kind);
  const includeTraffic = kindHasTraffic(kind);
  const includeLoud = kindHasLoud(kind);
  const includeEmail = kindHasEmail(kind);
  const extraMeta = extrasMetadata(extras);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: client.stripeCustomerId ? undefined : client.email || undefined,
    customer: client.stripeCustomerId || undefined,
    line_items: [...checkoutLineItems(kind), ...extraLineItems(extras)],
    success_url: `${publicSiteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${publicSiteUrl()}/checkout/cancel`,
    metadata: {
      clientId: client.id,
      leadId: options.leadId || "",
      checkoutKind: kind,
      localBoost: includeBoost ? "true" : "false",
      trafficAds: includeTraffic ? "true" : "false",
      loudAds: includeLoud ? "true" : "false",
      businessEmail: includeEmail ? "true" : "false",
      ...extraMeta,
    },
    subscription_data: {
      metadata: {
        clientId: client.id,
        leadId: options.leadId || "",
        checkoutKind: kind,
        localBoost: includeBoost ? "true" : "false",
        trafficAds: includeTraffic ? "true" : "false",
        loudAds: includeLoud ? "true" : "false",
        businessEmail: includeEmail ? "true" : "false",
        ...extraMeta,
      },
      description: checkoutDescription(kind, client.businessName),
    },
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return session.url;
}

export async function clientFromLead(leadId: string) {
  const lead = await getLead(leadId);
  if (!lead) return null;
  if (lead.clientId) {
    const existing = await getClient(lead.clientId);
    if (existing) return existing;
  }
  const taken = (await listClients()).map((c) => c.slug);
  const client = buildClientFromLead(lead, taken);
  await upsertClient(client);
  await updateLead(lead.id, { clientId: client.id });
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
