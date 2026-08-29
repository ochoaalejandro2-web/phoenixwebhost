import assert from "node:assert/strict";
import test from "node:test";
import {
  applyLocalBoostPurchased,
  applyLoudPurchased,
  applyTrafficPurchased,
} from "./billing-addons.ts";
import type { Client } from "./types.ts";

function sampleClient(overrides: Partial<Client> = {}): Client {
  return {
    id: "cli_test",
    businessName: "Test Shop",
    slug: "test-shop",
    contactName: "Alex",
    email: "alex@test.example",
    phone: "(480) 555-0100",
    address: "1 Main",
    city: "Phoenix, AZ",
    hours: "Mon–Fri",
    tagline: "Test",
    about: "Test",
    services: ["One"],
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
    createdAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

test("Local Boost purchase note stays the small-ad wording", () => {
  const next = applyLocalBoostPurchased(sampleClient());
  assert.equal(next.localBoost, true);
  assert.match(next.notes[0].body, /\$99/);
  assert.match(next.notes[0].body, /\$79\/month/);
  assert.doesNotMatch(next.notes[0].body, /Traffic|Loud|\$199|\$349/);
});

test("Traffic and Loud purchase notes are honest managed-ads copy", () => {
  const traffic = applyTrafficPurchased(sampleClient());
  assert.equal(traffic.trafficAds, true);
  assert.equal(traffic.localBoost, false);
  assert.match(traffic.notes[0].body, /\$199\/month/);
  assert.match(traffic.notes[0].body, /managed ads/);
  assert.match(traffic.notes[0].body, /Not a ranking promise/);
  assert.doesNotMatch(traffic.notes[0].body, /guaranteed first page|magic SEO/i);

  const loud = applyLoudPurchased(sampleClient());
  assert.equal(loud.loudAds, true);
  assert.match(loud.notes[0].body, /\$349\/month/);
  assert.match(loud.notes[0].body, /managed ads/);
  assert.match(loud.notes[0].body, /Not a ranking promise/);
  assert.doesNotMatch(loud.notes[0].body, /guaranteed first page|magic SEO/i);
});
