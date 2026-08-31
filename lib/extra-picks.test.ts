import assert from "node:assert/strict";
import test from "node:test";
import {
  extraFlagsFromPicks,
  parseExtraPicks,
  requestWithExtra,
} from "./extra-picks.ts";

test("extra query picks domain with the other optional extras", () => {
  assert.deepEqual(parseExtraPicks("domain"), ["domain"]);
  assert.deepEqual(parseExtraPicks("domain,email,voice"), [
    "domain",
    "email",
    "voice",
  ]);
  assert.deepEqual(parseExtraPicks(["book", "missed"]), ["book", "missed"]);
  assert.deepEqual(parseExtraPicks("cart,whmcs"), []);
  assert.deepEqual(extraFlagsFromPicks(["domain", "reviews"]), {
    includeDomain: true,
    includeEmail: false,
    includeBook: false,
    includeMissed: false,
    includeReviews: true,
    includeVoice: false,
  });
  assert.equal(requestWithExtra("en", "domain"), "/request?extra=domain");
  assert.equal(requestWithExtra("es", "email"), "/es/request?extra=email");
});
