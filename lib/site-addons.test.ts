import assert from "node:assert/strict";
import test from "node:test";
import {
  BOOK_NOT_CONFIGURED,
  applyPaidExtras,
  clientShowsBookJob,
  extraLineItems,
  extrasFromMetadata,
  extrasMetadata,
} from "./site-addons.ts";
import type { Client } from "./types.ts";

function client(partial: Partial<Client> = {}): Client {
  return {
    id: "cli_test",
    businessName: "Test Shop",
    slug: "test-shop",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "Phoenix, AZ",
    hours: "",
    tagline: "",
    about: "",
    services: [],
    template: "contractor",
    customDomain: null,
    siteStatus: "live",
    paymentStatus: "paid",
    lastPaymentAt: null,
    nextInvoiceAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeBoostSubscriptionId: null,
    localBoost: false,
    stripeTrafficSubscriptionId: null,
    trafficAds: false,
    stripeLoudSubscriptionId: null,
    loudAds: false,
    stripeEmailSubscriptionId: null,
    businessEmail: false,
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    notes: [],
    editRequests: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

test("extra line items fail closed when Book a job prices are missing", () => {
  delete process.env.STRIPE_BOOK_SETUP_PRICE_ID;
  delete process.env.STRIPE_BOOK_MONTHLY_PRICE_ID;
  assert.throws(
    () => extraLineItems({ includeBook: true }),
    (error: unknown) =>
      error instanceof Error && error.message === BOOK_NOT_CONFIGURED,
  );
});

test("extra line items append Book and review prices without inventing ads kinds", () => {
  process.env.STRIPE_BOOK_SETUP_PRICE_ID = "price_book_setup";
  process.env.STRIPE_BOOK_MONTHLY_PRICE_ID = "price_book_month";
  process.env.STRIPE_REVIEW_MONTHLY_PRICE_ID = "price_review";
  assert.deepEqual(extraLineItems({ includeBook: true, includeReviews: true }), [
    { price: "price_book_setup", quantity: 1 },
    { price: "price_book_month", quantity: 1 },
    { price: "price_review", quantity: 1 },
  ]);
  delete process.env.STRIPE_BOOK_SETUP_PRICE_ID;
  delete process.env.STRIPE_BOOK_MONTHLY_PRICE_ID;
  delete process.env.STRIPE_REVIEW_MONTHLY_PRICE_ID;
});

test("extras metadata round-trips and applyPaidExtras sets Book a job", () => {
  const meta = extrasMetadata({ includeBook: true, includeVoice: true });
  assert.deepEqual(extrasFromMetadata(meta), {
    includeBook: true,
    includeMissedCall: false,
    includeReviews: false,
    includeVoice: true,
  });
  const next = applyPaidExtras(client(), { includeBook: true });
  assert.equal(next.bookAJob, true);
  assert.ok(next.notes[0]?.body.includes("Book a job"));
});

test("public demos show Book a job; new paid clients do not until purchased", () => {
  assert.equal(clientShowsBookJob({ id: "demo_lead_1", bookAJob: false }), true);
  assert.equal(clientShowsBookJob({ id: "cli_paid", bookAJob: false }), false);
  assert.equal(clientShowsBookJob({ id: "cli_paid", bookAJob: true }), true);
});
