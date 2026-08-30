import assert from "node:assert/strict";
import test from "node:test";
import { applySeedDemoBookJob, mergeMissingBySlug } from "./seed-merge.ts";

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
