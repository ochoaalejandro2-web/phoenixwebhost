import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  applySeedDemoBookJob,
  mergeMissingBySlug,
  refreshDesertSparkleDemoCopy,
  refreshPaFinancialArizonaCopy,
  refreshPaFinancialListedOfferings,
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

test("P&A Financial seed is a real paying tax-office client, not a demo", () => {
  const src = readFileSync(new URL("../data/seed.ts", import.meta.url), "utf8");
  const start = src.indexOf('id: "cli_pa_financial"');
  assert.ok(start > 0);
  const end = src.indexOf("export function mergeMissingSeedClients", start);
  const chunk = src.slice(start, end > start ? end : start + 2800);
  assert.match(chunk, /businessName: "P&A Financial LLC"/);
  assert.match(chunk, /slug: "pa-financial"/);
  assert.match(chunk, /contactName: "Patricia Escobedo"/);
  assert.match(chunk, /pafinancial19@gmail.com/);
  assert.match(chunk, /\(720\) 501-0501/);
  assert.match(chunk, /template: "tax"/);
  assert.match(chunk, /siteStatus: "live"/);
  assert.match(chunk, /paymentStatus: "paid"/);
  assert.match(chunk, /Personal and Business Tax Preparation/);
  assert.match(chunk, /W-2 \/ 1099 \/ Uber/);
  assert.match(chunk, /ITIN Number Processing/);
  assert.match(chunk, /Business Registration/);
  assert.match(chunk, /Bookkeeping \/ Payroll/);
  assert.doesNotMatch(chunk, /LLC Formation/);
  assert.doesNotMatch(chunk, /Personal Income Taxes/);
  assert.match(chunk, /logo-brand\.png/);
  assert.match(chunk, /By appointment/);
  assert.match(chunk, /Real paying client/);
  assert.match(chunk, /\$200 launch paid cash/);
  assert.match(chunk, /pataxesllc.com/);
  assert.match(chunk, /city: "Arizona"/);
  assert.doesNotMatch(chunk, /Colorado/);
  assert.doesNotMatch(chunk, /sample: true/);
  assert.doesNotMatch(chunk, /cus_demo_/);
  assert.doesNotMatch(chunk, /sub_demo_/);
  assert.doesNotMatch(chunk, /\.example/);
  assert.doesNotMatch(chunk, /siteStatus: "offline"/);
  assert.doesNotMatch(chunk, /paymentStatus: "overdue"/);
});

test("stale P&A Financial Colorado copy is swapped to Arizona", () => {
  const seed = [
    {
      slug: "pa-financial",
      city: "Arizona",
      about:
        "Patricia Escobedo has prepared taxes for more than eight years. Her journey began in Arizona.",
    },
    { slug: "hola-tax-service", city: "Phoenix", about: "Hola stays." },
  ];
  const stale = [
    {
      slug: "pa-financial",
      city: "Colorado",
      about:
        "Patricia Escobedo has prepared taxes for more than eight years. Her journey began in Colorado.",
    },
    { slug: "hola-tax-service", city: "Phoenix", about: "Hola stays." },
  ];
  const next = refreshPaFinancialArizonaCopy(stale, seed);
  assert.equal(next.added, true);
  const pa = next.items.find((row) => row.slug === "pa-financial");
  assert.equal(pa?.city, "Arizona");
  assert.match(String(pa?.about), /Arizona/);
  assert.equal(String(pa?.about).includes("Colorado"), false);
  assert.equal(
    next.items.find((row) => row.slug === "hola-tax-service")?.about,
    "Hola stays.",
  );
  assert.equal(refreshPaFinancialArizonaCopy(next.items, seed).added, false);
});

test("stale P&A Financial services and black/weak logos refresh from seed", () => {
  const seed = [
    {
      slug: "pa-financial",
      services: [
        "Personal and Business Tax Preparation",
        "W-2 / 1099 / Uber",
        "ITIN Number Processing",
        "Business Registration",
        "Bookkeeping / Payroll",
      ],
      about:
        "Personal and business tax preparation, W-2 / 1099 / Uber, ITIN processing, business registration, and bookkeeping / payroll.",
      logoSrc: "/clients/pa-financial/logo-brand.png",
    },
    {
      slug: "hola-tax-service",
      services: ["Personal tax preparation"],
      about: "Hola stays.",
      logoSrc: "/clients/hola-tax-service/logo.png",
    },
  ];
  const stale = [
    {
      slug: "pa-financial",
      services: [
        "Personal Income Taxes",
        "Business Income Taxes",
        "LLC Formation",
        "Bookkeeping",
      ],
      about:
        "Personal and business income taxes, LLC formation, and bookkeeping.",
      logoSrc: "/clients/pa-financial/logo-circle.jpg",
    },
    {
      slug: "hola-tax-service",
      services: ["Personal tax preparation"],
      about: "Hola stays.",
      logoSrc: "/clients/hola-tax-service/logo.png",
    },
  ];
  const next = refreshPaFinancialListedOfferings(stale, seed);
  assert.equal(next.added, true);
  const pa = next.items.find((row) => row.slug === "pa-financial");
  assert.deepEqual(pa?.services, seed[0].services);
  assert.equal(pa?.logoSrc, "/clients/pa-financial/logo-brand.png");
  assert.match(String(pa?.about), /tax preparation/i);
  assert.match(String(pa?.about), /W-2/);
  assert.match(String(pa?.about), /payroll/i);
  assert.equal(String(pa?.about).includes("LLC"), false);
  assert.equal(
    next.items.find((row) => row.slug === "hola-tax-service")?.about,
    "Hola stays.",
  );
  assert.equal(refreshPaFinancialListedOfferings(next.items, seed).added, false);
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

