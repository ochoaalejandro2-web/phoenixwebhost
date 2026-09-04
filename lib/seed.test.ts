import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  applySeedDemoBookJob,
  mergeMissingBySlug,
  refreshDesertSparkleDemoCopy,
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

test("desert sparkle cleaning seed is a live paid cleaning demo", () => {
  const src = readFileSync(new URL("../data/seed.ts", import.meta.url), "utf8");
  const start = src.indexOf('slug: "desert-sparkle-cleaning"');
  assert.ok(start > 0);
  const chunk = src.slice(start, start + 2800);
  assert.match(chunk, /template: "cleaning"/);
  assert.match(chunk, /siteStatus: "live"/);
  assert.match(chunk, /paymentStatus: "paid"/);
  assert.match(chunk, /sample: true/);
  assert.doesNotMatch(chunk, /siteStatus: "offline"/);
  assert.doesNotMatch(chunk, /paymentStatus: "overdue"/);
  const aboutMatch = chunk.match(/about:\s*"([^"]+)"/);
  assert.ok(aboutMatch);
  assert.ok(aboutMatch[1].length < 220);
  assert.match(aboutMatch[1], /Weekly house cleaning/);
  assert.match(aboutMatch[1], /West Valley/);
  assert.match(aboutMatch[1], /sample name/);
  assert.doesNotMatch(aboutMatch[1], /placeholder name/);
  assert.doesNotMatch(aboutMatch[1], /A real Tolleson or Avondale cleaner/);
});

test("existing desert sparkle about is refreshed from seed without touching other clients", () => {
  const seed = [
    {
      slug: "desert-sparkle-cleaning",
      about: "Weekly house cleaning, deep cleans, and move-out jobs.",
    },
    { slug: "ironwood-handyman", about: "Old handyman copy stays." },
  ];
  const stale = [
    {
      slug: "desert-sparkle-cleaning",
      about:
        "Sample layout for a West Valley house-cleaning crew — not a live customer.",
    },
    { slug: "ironwood-handyman", about: "Old handyman copy stays." },
  ];
  const next = refreshDesertSparkleDemoCopy(stale, seed);
  assert.equal(next.added, true);
  assert.equal(
    next.items.find((row) => row.slug === "desert-sparkle-cleaning")?.about,
    "Weekly house cleaning, deep cleans, and move-out jobs.",
  );
  assert.equal(
    next.items.find((row) => row.slug === "ironwood-handyman")?.about,
    "Old handyman copy stays.",
  );

  const alreadyFresh = refreshDesertSparkleDemoCopy(next.items, seed);
  assert.equal(alreadyFresh.added, false);
});

test("mesa street kitchen seed is a live paid restaurant demo", () => {
  const src = readFileSync(new URL("../data/seed.ts", import.meta.url), "utf8");
  const start = src.indexOf('slug: "mesa-street-kitchen"');
  assert.ok(start > 0);
  const chunk = src.slice(start, start + 1600);
  assert.match(chunk, /template: "restaurant"/);
  assert.match(chunk, /siteStatus: "live"/);
  assert.match(chunk, /paymentStatus: "paid"/);
  assert.doesNotMatch(chunk, /siteStatus: "offline"/);
  assert.doesNotMatch(chunk, /paymentStatus: "overdue"/);
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

