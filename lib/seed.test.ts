import assert from "node:assert/strict";
import test from "node:test";
import {
  applySeedDemoBookJob,
  mergeMissingBySlug,
  restoreSeedWalkInDemos,
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

test("stale Mesa Street Kitchen unpaid fixture is restored to a live sample", () => {
  const stale = {
    slug: "mesa-street-kitchen",
    siteStatus: "offline",
    paymentStatus: "overdue",
    lastPaymentAt: "2026-07-01T00:00:00.000Z",
    nextInvoiceAt: "2026-08-01T00:00:00.000Z",
    reminderSentAt: "2026-08-20T00:00:00.000Z",
    overdueSince: "2026-08-20T00:00:00.000Z",
    offlineAt: "2026-08-22T00:00:00.000Z",
    filesKeptUntil: "2026-09-21T00:00:00.000Z",
    takenDownAt: null,
    sample: false,
    notes: [
      {
        id: "note_ms_1",
        body: "Card failed. Reminder emailed. Site set to temporarily offline after grace period.",
        createdAt: "2026-08-22T00:00:00.000Z",
      },
    ],
  };
  const realUnpaid = {
    slug: "valley-plumbing",
    siteStatus: "offline",
    paymentStatus: "overdue",
    lastPaymentAt: "2026-07-01T00:00:00.000Z",
    nextInvoiceAt: "2026-08-01T00:00:00.000Z",
    reminderSentAt: "2026-08-20T00:00:00.000Z",
    overdueSince: "2026-08-20T00:00:00.000Z",
    offlineAt: "2026-08-22T00:00:00.000Z",
    filesKeptUntil: "2026-09-21T00:00:00.000Z",
    takenDownAt: null,
    sample: false,
    notes: [
      {
        id: "note_vp_1",
        body: "Unpaid after reminder. Site set to temporarily offline. Files kept for 30 days.",
        createdAt: "2026-08-22T00:00:00.000Z",
      },
    ],
  };
  const seed = [
    {
      slug: "mesa-street-kitchen",
      siteStatus: "live",
      paymentStatus: "paid",
      lastPaymentAt: "2026-08-27T00:00:00.000Z",
      nextInvoiceAt: "2026-09-26T00:00:00.000Z",
      reminderSentAt: null,
      overdueSince: null,
      offlineAt: null,
      filesKeptUntil: null,
      takenDownAt: null,
      sample: true,
      notes: [
        {
          id: "note_ms_1",
          body: "Sample restaurant site for the restaurant template. Paid and live like Ironwood Handyman. Not a customer account.",
          createdAt: "2026-08-27T00:00:00.000Z",
        },
      ],
    },
  ];
  const next = restoreSeedWalkInDemos([stale, realUnpaid], seed);
  assert.equal(next.added, true);
  const mesa = next.items.find((row) => row.slug === "mesa-street-kitchen");
  assert.equal(mesa?.siteStatus, "live");
  assert.equal(mesa?.paymentStatus, "paid");
  assert.equal(mesa?.offlineAt, null);
  assert.equal(mesa?.overdueSince, null);
  assert.equal(mesa?.sample, true);
  assert.match(mesa?.notes[0]?.body || "", /Sample restaurant site/);
  const unpaid = next.items.find((row) => row.slug === "valley-plumbing");
  assert.equal(unpaid?.siteStatus, "offline");
  assert.equal(unpaid?.paymentStatus, "overdue");
});

test("Hola Tax unpaid records are not restored by the walk-in demo merge", () => {
  const stale = {
    slug: "hola-tax-service",
    siteStatus: "offline",
    paymentStatus: "overdue",
    lastPaymentAt: "2026-07-01T00:00:00.000Z",
    nextInvoiceAt: "2026-08-01T00:00:00.000Z",
    reminderSentAt: "2026-08-20T00:00:00.000Z",
    overdueSince: "2026-08-20T00:00:00.000Z",
    offlineAt: "2026-08-22T00:00:00.000Z",
    filesKeptUntil: "2026-09-21T00:00:00.000Z",
    takenDownAt: null,
    sample: false,
    notes: [],
  };
  const seed = [
    {
      ...stale,
      siteStatus: "live",
      paymentStatus: "paid",
      reminderSentAt: null,
      overdueSince: null,
      offlineAt: null,
      filesKeptUntil: null,
    },
  ];
  const next = restoreSeedWalkInDemos([stale], seed);
  assert.equal(next.added, false);
  assert.equal(next.items[0]?.siteStatus, "offline");
  assert.equal(next.items[0]?.paymentStatus, "overdue");
});
