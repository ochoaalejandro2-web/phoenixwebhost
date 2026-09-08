import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { copy } from "./i18n.ts";
import { OFFER_PACKAGE_IDS, PACKAGE_BUY_URLS, PACKAGES } from "./packages.ts";

const laborDay = /Labor Day|\$29\.99|ends Tuesday|launch special/i;

function homepageOfferBlob() {
  const en = copy.en;
  return [
    en.heroKicker,
    en.heroTitle,
    en.heroLead,
    en.proofLine,
    en.packagesKicker,
    en.packagesTitle,
    en.packagesLead,
    en.packageLaunchHint,
    en.packageMonthHint,
    en.requestLead,
    en.packagePickerHelp,
    en.howSteps.map((step) => `${step.t} ${step.d}`).join(" "),
    PACKAGES.starter.copy.en.blurb,
    PACKAGES.pro.copy.en.blurb,
  ].join("\n");
}

test("homepage hero and plan copy match the 30-day free Starter-or-Pro offer", () => {
  const en = copy.en;
  const es = copy.es;
  assert.match(en.heroKicker, /30 days free/i);
  assert.match(en.heroKicker, /Cancel anytime/i);
  assert.match(en.heroTitle, /30 days free/i);
  assert.match(en.heroTitle, /Starter or Pro/i);
  assert.match(en.heroLead, /buy your domain/i);
  assert.match(en.heroLead, /couple-page/i);
  assert.match(en.heroLead, /AI receptionist/i);
  assert.match(en.heroLead, /tax-office/i);
  assert.match(en.packagesTitle, /Starter or Pro/i);
  assert.equal(/Premium/i.test(en.packagesTitle), false);
  assert.equal(/Premium/i.test(en.heroLead), false);
  assert.match(en.packagesLead, /after the trial/i);
  assert.match(en.requestLead, /30 days free/i);
  assert.equal(/Premium/i.test(en.requestLead), false);

  assert.match(es.heroKicker, /30 días gratis/i);
  assert.match(es.heroTitle, /Starter o Pro/i);
  assert.match(es.packagesTitle, /Starter o Pro/i);
  assert.equal(/Premium/i.test(es.heroLead), false);
});

test("homepage and plan cards do not mention Labor Day, $29.99, or ends Tuesday", () => {
  const blob = homepageOfferBlob();
  assert.equal(laborDay.test(blob), false);
  assert.equal(laborDay.test([copy.es.heroTitle, copy.es.heroLead, copy.es.packagesLead].join(" ")), false);
});

test("homepage plan cards keep existing Starter and Pro Stripe buy links", () => {
  assert.equal(PACKAGES.starter.buyUrl, PACKAGE_BUY_URLS.starter);
  assert.equal(PACKAGES.pro.buyUrl, PACKAGE_BUY_URLS.pro);
  assert.match(PACKAGES.starter.buyUrl, /^https:\/\/buy\.stripe\.com\//);
  assert.match(PACKAGES.pro.buyUrl, /^https:\/\/buy\.stripe\.com\//);
});

test("homepage PackagesSection renders the offer cards, not Premium", () => {
  const section = readFileSync(
    new URL("../components/marketing/PackagesSection.tsx", import.meta.url),
    "utf8",
  );
  const page = readFileSync(
    new URL("../components/marketing/MarketingPage.tsx", import.meta.url),
    "utf8",
  );
  assert.match(section, /OFFER_PACKAGE_IDS\.map/);
  assert.doesNotMatch(section, /import \{[^}]*\bPACKAGE_IDS\b/);
  assert.match(section, /pkg\.buyUrl/);
  assert.match(section, /lg:grid-cols-2/);
  assert.match(page, /packageIds=\{OFFER_PACKAGE_IDS\}/);
  assert.deepEqual([...OFFER_PACKAGE_IDS], ["starter", "pro"]);
});
