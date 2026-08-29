import assert from "node:assert/strict";
import test from "node:test";
import {
  adsFlagsFromTier,
  adsTierFromFlags,
  adsTierLabel,
  clientHasAdsTier,
  countAdsFlags,
  normalizeAdsFlags,
  parseAdsTier,
} from "./ads.ts";

test("ads flags are mutually exclusive", () => {
  assert.deepEqual(normalizeAdsFlags({ wantsLocalBoost: true, wantsTraffic: true }), {
    wantsLocalBoost: false,
    wantsTraffic: false,
    wantsLoud: false,
  });
  assert.deepEqual(adsFlagsFromTier("traffic"), {
    wantsLocalBoost: false,
    wantsTraffic: true,
    wantsLoud: false,
  });
  assert.equal(adsTierFromFlags({ wantsTraffic: true }), "traffic");
  assert.equal(adsTierFromFlags({ localBoost: true }), "boost");
  assert.equal(parseAdsTier("loud"), "loud");
  assert.equal(parseAdsTier("seo"), "none");
  assert.equal(adsTierLabel("boost"), "Local Boost");
  assert.equal(countAdsFlags({ includeBoost: true, includeTraffic: true }), 2);
  assert.equal(clientHasAdsTier({ localBoost: true }), true);
  assert.equal(clientHasAdsTier({ trafficAds: false, loudAds: false }), false);
});
