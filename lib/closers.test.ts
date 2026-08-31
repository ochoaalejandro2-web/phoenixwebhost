import assert from "node:assert/strict";
import test from "node:test";
import {
  closerFromName,
  closerSellPath,
  launchSoldNote,
  parseCloserFromPath,
  sanitizeCloserCode,
} from "./closers.ts";

test("closer codes stay short, lowercase, and reject junk", () => {
  assert.equal(sanitizeCloserCode("Jose"), "jose");
  assert.equal(sanitizeCloserCode(" ana-maria "), "ana-maria");
  assert.equal(sanitizeCloserCode("a"), "");
  assert.equal(sanitizeCloserCode("../admin"), "");
  assert.equal(sanitizeCloserCode("https://client.phxhosting.net/cart.php"), "");
  assert.equal(closerFromName("Ana María"), "ana-maria");
});

test("unique closer paths and query-style sell links stay on Phoenixwebhost", () => {
  assert.equal(closerSellPath("jose"), "/r/jose");
  assert.equal(closerSellPath("jose", "es"), "/es/r/jose");
  assert.deepEqual(parseCloserFromPath("/r/jose"), {
    code: "jose",
    locale: "en",
  });
  assert.deepEqual(parseCloserFromPath("/es/r/ana-maria"), {
    code: "ana-maria",
    locale: "es",
  });
  assert.equal(parseCloserFromPath("/s/desert-peak-roofing"), null);
});

test("sold-note copy is launch-only and not an auto-payout", () => {
  const note = launchSoldNote("Jose (jose)");
  assert.match(note, /\$200 launch/);
  assert.match(note, /Stripe succeeded/);
  assert.match(note, /\$69\/month/);
  assert.match(note, /Do not auto-payout/);
  assert.doesNotMatch(note, /Stripe Connect|transfer|split/i);
});
