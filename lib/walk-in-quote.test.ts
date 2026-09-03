import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyWalkInFlags,
  formatUsd,
  formatUsdRange,
  selectedExtraPicks,
  selectedQuotedPicks,
  walkInQuote,
  walkInShowsOrdering,
} from "./walk-in-quote.ts";

test("base quote is always $200 launch + $69/month with no hidden extras", () => {
  const quote = walkInQuote(emptyWalkInFlags());
  assert.equal(quote.setupLabel, "$200");
  assert.equal(quote.monthlyLabel, "$69");
  assert.equal(quote.firstPayLabel, "$269");
  assert.deepEqual(quote.quoted, []);
  assert.equal(quote.lines[0]?.id, "base");
});

test("toggling the existing upsell ladder updates launch, monthly, and first-pay totals", () => {
  const quote = walkInQuote({
    ...emptyWalkInFlags(),
    ads: "traffic",
    book: true,
    missed: true,
    reviews: true,
    voice: true,
  });
  // 200 + 49 book + 49 missed + 99 voice = 397 setup
  assert.equal(quote.setupMinCents, 39_700);
  // 69 + 199 traffic + 19 book + 29 missed + 29 reviews + 79 voice = 424
  assert.equal(quote.monthlyCents, 42_400);
  assert.equal(quote.firstPayMinCents, 82_100);
  assert.equal(formatUsd(quote.monthlyCents), "$424");
  assert.deepEqual(selectedExtraPicks({
    ...emptyWalkInFlags(),
    book: true,
    missed: true,
    reviews: true,
    voice: true,
  }), ["book", "missed", "reviews", "voice"]);
});

test("restaurant pickup ordering is a labeled add-on with a setup range, $149/month, and quoted extras stay quoted", () => {
  assert.equal(walkInShowsOrdering("restaurant"), true);
  assert.equal(walkInShowsOrdering("salon"), false);
  const quote = walkInQuote({
    ...emptyWalkInFlags(),
    ads: "loud",
    ordering: true,
    extraPage: true,
    photos: true,
    spanish: true,
    domain: true,
  });
  assert.equal(quote.setupLabel, formatUsdRange(49_900, 69_900));
  assert.equal(quote.monthlyCents, 6_900 + 34_900 + 14_900);
  assert.equal(quote.yearlyCents, 2_000);
  assert.deepEqual(quote.quoted, ["page", "photos", "spanish"]);
  assert.deepEqual(selectedQuotedPicks({
    ...emptyWalkInFlags(),
    ordering: true,
    extraPage: true,
    photos: true,
    spanish: true,
  }), ["ordering", "page", "photos", "spanish"]);
});
