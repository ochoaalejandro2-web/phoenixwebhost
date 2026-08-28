import assert from "node:assert/strict";
import test from "node:test";
import {
  dayKey,
  isLikelyBot,
  shiftDay,
  sumVisits,
  totalsFromRows,
  visitWindows,
} from "./visits.ts";

test("Phoenix calendar day is YYYY-MM-DD", () => {
  assert.equal(dayKey(new Date("2026-08-28T18:00:00Z")), "2026-08-28");
  assert.equal(dayKey(new Date("2026-08-29T06:30:00Z")), "2026-08-28");
});

test("visit windows include today in the 7 and 30 day ranges", () => {
  const { today, last7From, last30From } = visitWindows("2026-08-28");
  assert.equal(today, "2026-08-28");
  assert.equal(last7From, "2026-08-22");
  assert.equal(last30From, "2026-07-30");
  assert.equal(shiftDay("2026-03-01", -1), "2026-02-28");
});

test("totals add one row per day across today, 7, and 30", () => {
  const rows = {
    "2026-08-28": 3,
    "2026-08-27": 2,
    "2026-08-22": 5,
    "2026-08-21": 9,
    "2026-07-30": 4,
    "2026-07-29": 100,
  };
  const totals = totalsFromRows(rows, "2026-08-28");
  assert.equal(totals.today, 3);
  assert.equal(totals.last7, 3 + 2 + 5);
  assert.equal(totals.last30, 3 + 2 + 5 + 9 + 4);
  assert.equal(sumVisits(rows, "2026-08-28", "2026-08-28"), 3);
});

test("known crawlers are not counted as visits", () => {
  assert.equal(isLikelyBot("Mozilla/5.0 (compatible; Googlebot/2.1)"), true);
  assert.equal(isLikelyBot("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)"), false);
});
