import assert from "node:assert/strict";
import test from "node:test";
import { createSeedState, mergeMissingSeedClients } from "../data/seed.ts";
import {
  applySeedDemoBookJob,
  mergeMissingBySlug,
  restoreMesaStreetKitchenDemo,
} from "./seed-merge.ts";

test("missing seed demos are appended without dropping existing clients", () => {
  const existing = [
    { slug: "hola-tax-service", name: "Hola Tax" },
    { slug: "palo-verde-yards", name: "Palo Verde" },
  ];
  const seed = [
    ...existing,
    { slug: "ironwood-handyman", name: "Ironwood Handyman" },
  ];
  const first = mergeMissingBySlug(existing, seed);
  assert.equal(first.added, true);
  assert.deepEqual(
    first.items.map((row) => row.slug),
    ["hola-tax-service", "palo-verde-yards", "ironwood-handyman"],
  );

  const second = mergeMissingBySlug(first.items, seed);
  assert.equal(second.added, false);
  assert.equal(second.items.length, first.items.length);
});

test("existing walk-in demos get Book a job turned on without dropping other clients", () => {
  const stale = [
    { slug: "palo-verde-yards", bookAJob: false },
    { slug: "a-new-paid-shop", bookAJob: false },
  ];
  const seed = [
    { slug: "palo-verde-yards", bookAJob: true },
    { slug: "a-new-paid-shop", bookAJob: false },
  ];
  const next = applySeedDemoBookJob(stale, seed);
  assert.equal(next.added, true);
  assert.equal(next.items.find((row) => row.slug === "palo-verde-yards")?.bookAJob, true);
  assert.equal(next.items.find((row) => row.slug === "a-new-paid-shop")?.bookAJob, false);
});

test("mesa street kitchen seed is a live paid restaurant demo", () => {
  const mesa = createSeedState().clients.find(
    (row) => row.slug === "mesa-street-kitchen",
  );
  assert.equal(mesa?.template, "restaurant");
  assert.equal(mesa?.siteStatus, "live");
  assert.equal(mesa?.paymentStatus, "paid");
  assert.equal(mesa?.offlineAt, null);
  assert.equal(mesa?.overdueSince, null);
});

test("stale offline mesa street kitchen is restored without touching other clients", () => {
  const now = "2026-01-01T00:00:00.000Z";
  const stale = [
    {
      slug: "mesa-street-kitchen",
      siteStatus: "offline",
      paymentStatus: "overdue",
      lastPaymentAt: now,
      nextInvoiceAt: now,
      reminderSentAt: now,
      overdueSince: now,
      offlineAt: now,
      filesKeptUntil: now,
      takenDownAt: null,
    },
    {
      slug: "a-real-unpaid-shop",
      siteStatus: "offline",
      paymentStatus: "overdue",
      lastPaymentAt: now,
      nextInvoiceAt: now,
      reminderSentAt: now,
      overdueSince: now,
      offlineAt: now,
      filesKeptUntil: now,
      takenDownAt: null,
    },
  ];
  const next = restoreMesaStreetKitchenDemo(stale);
  assert.equal(next.added, true);
  const mesa = next.items.find((row) => row.slug === "mesa-street-kitchen");
  const unpaid = next.items.find((row) => row.slug === "a-real-unpaid-shop");
  assert.equal(mesa?.siteStatus, "live");
  assert.equal(mesa?.paymentStatus, "paid");
  assert.equal(mesa?.offlineAt, null);
  assert.equal(mesa?.overdueSince, null);
  assert.equal(mesa?.reminderSentAt, null);
  assert.equal(mesa?.filesKeptUntil, null);
  assert.equal(unpaid?.siteStatus, "offline");
  assert.equal(unpaid?.paymentStatus, "overdue");
  assert.equal(unpaid?.offlineAt, now);

  const alreadyLive = restoreMesaStreetKitchenDemo(next.items);
  assert.equal(alreadyLive.added, false);
});

test("merge restores mesa street kitchen in an existing store without flipping other overdue clients", () => {
  const seed = createSeedState();
  const mesa = seed.clients.find((row) => row.slug === "mesa-street-kitchen");
  assert.ok(mesa);
  const unpaidShop = {
    ...mesa,
    id: "cli_real_unpaid",
    slug: "real-unpaid-shop",
    businessName: "Real Unpaid Shop",
    siteStatus: "offline" as const,
    paymentStatus: "overdue" as const,
    offlineAt: "2026-01-01T00:00:00.000Z",
    overdueSince: "2026-01-01T00:00:00.000Z",
  };
  const staleMesa = {
    ...mesa,
    siteStatus: "offline" as const,
    paymentStatus: "overdue" as const,
    offlineAt: "2026-01-01T00:00:00.000Z",
    overdueSince: "2026-01-01T00:00:00.000Z",
  };
  const { state, added } = mergeMissingSeedClients({
    ...seed,
    clients: [unpaidShop, staleMesa],
  });
  assert.equal(added, true);
  assert.equal(
    state.clients.find((row) => row.slug === "real-unpaid-shop")?.siteStatus,
    "offline",
  );
  assert.equal(
    state.clients.find((row) => row.slug === "real-unpaid-shop")?.paymentStatus,
    "overdue",
  );
  const restored = state.clients.find((row) => row.slug === "mesa-street-kitchen");
  assert.equal(restored?.siteStatus, "live");
  assert.equal(restored?.paymentStatus, "paid");
  assert.equal(restored?.offlineAt, null);
});
