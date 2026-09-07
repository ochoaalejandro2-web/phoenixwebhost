import assert from "node:assert/strict";
import test from "node:test";
import { PRICING } from "./config.ts";
import {
  DEFAULT_PACKAGE_ID,
  EXTRA_EDIT_CENTS,
  EXTRA_EDIT_LABEL,
  PACKAGES,
  PACKAGE_IDS,
  PRO_MONTHLY_CARE_URL,
  formatMoney,
  parsePackageId,
  requestWithPackage,
} from "./packages.ts";

test("official website packages are Starter, Pro, and Premium with the published prices", () => {
  assert.deepEqual(PACKAGE_IDS, ["starter", "pro", "premium"]);
  assert.equal(DEFAULT_PACKAGE_ID, "pro");

  assert.equal(PACKAGES.starter.setupLabel, "$99");
  assert.equal(PACKAGES.starter.monthlyLabel, "$29.95");
  assert.equal(PACKAGES.starter.setupCents, 9_900);
  assert.equal(PACKAGES.starter.monthlyCents, 2_995);
  assert.equal(PACKAGES.starter.editsPerMonth, 1);
  assert.equal(PACKAGES.starter.popular, false);
  assert.equal(PACKAGES.starter.monthlyCareUrl, null);

  assert.equal(PACKAGES.pro.setupLabel, "$200");
  assert.equal(PACKAGES.pro.monthlyLabel, "$69");
  assert.equal(PACKAGES.pro.setupCents, 20_000);
  assert.equal(PACKAGES.pro.monthlyCents, 6_900);
  assert.equal(PACKAGES.pro.editsPerMonth, 2);
  assert.equal(PACKAGES.pro.popular, true);
  assert.equal(PACKAGES.pro.monthlyCareUrl, PRO_MONTHLY_CARE_URL);

  assert.equal(PACKAGES.premium.setupLabel, "$349");
  assert.equal(PACKAGES.premium.monthlyLabel, "$99.95");
  assert.equal(PACKAGES.premium.setupCents, 34_900);
  assert.equal(PACKAGES.premium.monthlyCents, 9_995);
  assert.equal(PACKAGES.premium.editsPerMonth, 4);
  assert.equal(PACKAGES.premium.popular, false);
  assert.equal(PACKAGES.premium.monthlyCareUrl, null);
});

test("Pro launch stays $200 — Labor Day $29.99 is not the package price", () => {
  assert.equal(PACKAGES.pro.setupLabel, "$200");
  assert.equal(PACKAGES.pro.setupCents, 20_000);
  assert.equal(PACKAGES.pro.monthlyLabel, "$69");
  assert.notEqual(PACKAGES.pro.setupLabel, "$29.99");
  assert.notEqual(PACKAGES.pro.monthlyLabel, "$29.99");
  assert.equal(PRICING.setupLabel, PACKAGES.pro.setupLabel);
  assert.equal(PRICING.monthlyLabel, PACKAGES.pro.monthlyLabel);
});

test("extra edits beyond the package cap are $49 flat, never unlimited", () => {
  assert.equal(EXTRA_EDIT_LABEL, "$49");
  assert.equal(EXTRA_EDIT_CENTS, 4_900);
  for (const id of PACKAGE_IDS) {
    const blob = [
      ...PACKAGES[id].copy.en.includes,
      ...PACKAGES[id].copy.en.notIncluded,
      ...PACKAGES[id].copy.es.includes,
      ...PACKAGES[id].copy.es.notIncluded,
    ].join(" ");
    assert.equal(/unlimited/i.test(blob), false);
    assert.equal(/ilimitad/i.test(blob), false);
  }
});

test("Starter does not include AI receptionist, booking, or ads", () => {
  const en = PACKAGES.starter.copy.en.notIncluded.join(" ");
  const es = PACKAGES.starter.copy.es.notIncluded.join(" ");
  assert.match(en, /No AI receptionist/i);
  assert.match(en, /No booking/i);
  assert.match(en, /No ads/i);
  assert.match(es, /Sin recepcionista/i);
  assert.match(es, /Sin reservas/i);
  assert.match(es, /Sin anuncios/i);
  assert.equal(/receptionist/i.test(PACKAGES.starter.copy.en.includes.join(" ")), false);
});

test("Pro marks Most Popular and lists receptionist; booking is an add-on", () => {
  assert.equal(PACKAGES.pro.popular, true);
  assert.match(PACKAGES.pro.copy.en.includes.join(" "), /AI receptionist/i);
  assert.match(PACKAGES.pro.copy.en.notIncluded.join(" "), /add-on/i);
  assert.match(PACKAGES.premium.copy.en.includes.join(" "), /Everything in Pro/i);
  assert.match(PACKAGES.premium.copy.en.includes.join(" "), /English \+ Spanish/i);
  assert.match(
    PACKAGES.premium.copy.en.includes.join(" "),
    /booking, review texts, or missed-call/i,
  );
});

test("package query parsing and request links", () => {
  assert.equal(parsePackageId("starter"), "starter");
  assert.equal(parsePackageId("PREMIUM"), "premium");
  assert.equal(parsePackageId("nope"), "pro");
  assert.equal(parsePackageId(undefined), "pro");
  assert.equal(requestWithPackage("en", "starter"), "/request?package=starter");
  assert.equal(requestWithPackage("es", "premium"), "/es/request?package=premium");
});

test("money labels keep cents when the published price is not a round dollar", () => {
  assert.equal(formatMoney(2_995), "$29.95");
  assert.equal(formatMoney(9_995), "$99.95");
  assert.equal(formatMoney(20_000), "$200");
  assert.equal(formatMoney(6_900), "$69");
});
