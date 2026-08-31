import { PRICING } from "./config.ts";
import type { Client } from "./types.ts";

const WALK_IN_BOOK_SLUGS = new Set([
  "desert-peak-roofing",
  "ironwood-handyman",
  "casa-luna-salon",
  "mesa-street-kitchen",
  "palo-verde-yards",
  "hola-tax-service",
]);

export const STUDIO_INBOX = "studio";

export const BOOK_NOT_CONFIGURED =
  "Book a job checkout is not connected yet. Uncheck it to pay for the website, or wait until the Book a job prices are set.";
export const MISSED_NOT_CONFIGURED =
  "Missed-call text-back checkout is not connected yet. Uncheck it to pay for the website, or wait until those prices are set.";
export const REVIEWS_NOT_CONFIGURED =
  "Review texts checkout is not connected yet. Uncheck it to pay for the website, or wait until that price is set.";
export const VOICE_NOT_CONFIGURED =
  "Voice receptionist checkout is not connected yet. Uncheck it to pay for the website, or wait until those prices are set.";
export const DOMAIN_NOT_CONFIGURED =
  "Domain checkout is not connected yet. Uncheck it to pay for the website, or wait until the .com price is set.";

export type PaidExtras = {
  includeBook?: boolean;
  includeMissedCall?: boolean;
  includeReviews?: boolean;
  includeVoice?: boolean;
  includeDomain?: boolean;
};

function requirePrice(id: string | undefined, message: string) {
  if (!id) throw new Error(message);
  return { price: id, quantity: 1 };
}

export function extraLineItems(extras: PaidExtras) {
  const items: { price: string; quantity: number }[] = [];
  if (extras.includeBook) {
    items.push(
      requirePrice(process.env.STRIPE_BOOK_SETUP_PRICE_ID, BOOK_NOT_CONFIGURED),
      requirePrice(process.env.STRIPE_BOOK_MONTHLY_PRICE_ID, BOOK_NOT_CONFIGURED),
    );
  }
  if (extras.includeMissedCall) {
    items.push(
      requirePrice(process.env.STRIPE_MISSED_SETUP_PRICE_ID, MISSED_NOT_CONFIGURED),
      requirePrice(
        process.env.STRIPE_MISSED_MONTHLY_PRICE_ID,
        MISSED_NOT_CONFIGURED,
      ),
    );
  }
  if (extras.includeReviews) {
    items.push(
      requirePrice(
        process.env.STRIPE_REVIEW_MONTHLY_PRICE_ID,
        REVIEWS_NOT_CONFIGURED,
      ),
    );
  }
  if (extras.includeVoice) {
    items.push(
      requirePrice(process.env.STRIPE_VOICE_SETUP_PRICE_ID, VOICE_NOT_CONFIGURED),
      requirePrice(process.env.STRIPE_VOICE_MONTHLY_PRICE_ID, VOICE_NOT_CONFIGURED),
    );
  }
  if (extras.includeDomain) {
    items.push(
      requirePrice(process.env.STRIPE_DOMAIN_YEARLY_PRICE_ID, DOMAIN_NOT_CONFIGURED),
    );
  }
  return items;
}

export function extrasMetadata(extras: PaidExtras) {
  return {
    bookAJob: extras.includeBook ? "true" : "false",
    missedCallTextback: extras.includeMissedCall ? "true" : "false",
    reviewTexts: extras.includeReviews ? "true" : "false",
    voiceReceptionist: extras.includeVoice ? "true" : "false",
    domainRegister: extras.includeDomain ? "true" : "false",
  };
}

export function extrasFromMetadata(meta?: {
  bookAJob?: string;
  missedCallTextback?: string;
  reviewTexts?: string;
  voiceReceptionist?: string;
  domainRegister?: string;
} | null): PaidExtras {
  return {
    includeBook: meta?.bookAJob === "true",
    includeMissedCall: meta?.missedCallTextback === "true",
    includeReviews: meta?.reviewTexts === "true",
    includeVoice: meta?.voiceReceptionist === "true",
    includeDomain: meta?.domainRegister === "true",
  };
}

function note(body: string, at: string) {
  return { id: `note_${crypto.randomUUID()}`, body, createdAt: at };
}

export function applyBookPurchased(client: Client, at = new Date().toISOString()): Client {
  if (client.bookAJob) return client;
  return {
    ...client,
    bookAJob: true,
    notes: [
      note(
        `Book a job purchased: ${PRICING.bookSetupLabel} setup + ${PRICING.bookMonthlyLabel}/month. Customers can pick a day and leave a job note on the site.`,
        at,
      ),
      ...client.notes,
    ],
  };
}

export function applyMissedCallPurchased(
  client: Client,
  at = new Date().toISOString(),
): Client {
  if (client.missedCallTextback) return client;
  return {
    ...client,
    missedCallTextback: true,
    notes: [
      note(
        `Missed-call text-back purchased: ${PRICING.missedSetupLabel} setup + ${PRICING.missedMonthlyLabel}/month. We set this up when you buy — not live on the site yet.`,
        at,
      ),
      ...client.notes,
    ],
  };
}

export function applyReviewTextsPurchased(
  client: Client,
  at = new Date().toISOString(),
): Client {
  if (client.reviewTexts) return client;
  return {
    ...client,
    reviewTexts: true,
    notes: [
      note(
        `Review texts purchased: ${PRICING.reviewMonthlyLabel}/month. We set this up when you buy — not live on the site yet.`,
        at,
      ),
      ...client.notes,
    ],
  };
}

export function applyVoicePurchased(client: Client, at = new Date().toISOString()): Client {
  if (client.voiceReceptionist) return client;
  return {
    ...client,
    voiceReceptionist: true,
    notes: [
      note(
        `Voice receptionist purchased: ${PRICING.voiceSetupLabel} setup + ${PRICING.voiceMonthlyLabel}/month, ${PRICING.voiceIncludedMinutes} minutes included, extra minutes ${PRICING.voiceExtraMinuteLabel}. Forward a number or we issue one. We set this up when you buy — not the included website chat.`,
        at,
      ),
      ...client.notes,
    ],
  };
}

export function applyDomainPurchased(
  client: Client,
  at = new Date().toISOString(),
): Client {
  if (client.domainRegister) return client;
  return {
    ...client,
    domainRegister: true,
    notes: [
      note(
        `Domain register purchased: about ${PRICING.domainYearlyLabel} for a .com first year. We register it in the customer’s name. They keep the login. Phoenixwebhost only points DNS.`,
        at,
      ),
      ...client.notes,
    ],
  };
}

export function applyPaidExtras(client: Client, extras: PaidExtras): Client {
  let next = client;
  if (extras.includeBook) next = applyBookPurchased(next);
  if (extras.includeMissedCall) next = applyMissedCallPurchased(next);
  if (extras.includeReviews) next = applyReviewTextsPurchased(next);
  if (extras.includeVoice) next = applyVoicePurchased(next);
  if (extras.includeDomain) next = applyDomainPurchased(next);
  return next;
}

export function clientShowsBookJob(
  client: Pick<Client, "bookAJob" | "id" | "slug">,
) {
  return (
    Boolean(client.bookAJob) ||
    client.id.startsWith("demo_") ||
    WALK_IN_BOOK_SLUGS.has(client.slug)
  );
}
