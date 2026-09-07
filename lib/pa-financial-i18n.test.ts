import assert from "node:assert/strict";
import test from "node:test";
import {
  PA_FINANCIAL_LEGAL,
  PA_FINANCIAL_LOGO,
  PA_FINANCIAL_OWNER,
  PA_FINANCIAL_SLUG,
  paFinancialAbout,
  paFinancialCopy,
  paFinancialSeo,
  paFinancialServiceBlurb,
  paFinancialServiceLabel,
  paFinancialServicesTitle,
} from "./pa-financial-i18n.ts";

test("P&A Financial copy stays on this shop", () => {
  assert.equal(PA_FINANCIAL_SLUG, "pa-financial");
  assert.match(paFinancialAbout("", "en"), /Patricia Escobedo/);
  assert.match(paFinancialAbout("", "en"), /Arizona/);
  assert.equal(paFinancialAbout("", "en").includes("Colorado"), false);
  assert.match(paFinancialAbout("", "es"), /ocho años/);
  assert.match(paFinancialAbout("", "es"), /Arizona/);
  assert.equal(
    paFinancialServiceLabel("Business Registration", "es"),
    "Registro de negocios",
  );
  assert.equal(paFinancialServicesTitle("en"), "Our Services");
  assert.match(
    paFinancialServiceBlurb("Income Tax Preparation", "en"),
    /accurately/,
  );
  const seo = paFinancialSeo("en");
  assert.equal(seo.brand, PA_FINANCIAL_LEGAL);
  assert.equal(seo.icon, "/clients/pa-financial/icon.png");
  assert.equal(PA_FINANCIAL_LOGO, "/clients/pa-financial/logo-circle.jpg");
  assert.match(PA_FINANCIAL_OWNER, /\/clients\/pa-financial\/patricia\.jpg/);
  assert.equal(paFinancialCopy("en").scheduleTitle, "Schedule Your Appointment");
  assert.match(paFinancialCopy("en").scheduleBlurb, /financial clarity/);
  assert.equal(paFinancialCopy("en").footerSocial, "Social Media");
  assert.equal(JSON.stringify(seo).includes("Phoenixwebhost"), false);
});
