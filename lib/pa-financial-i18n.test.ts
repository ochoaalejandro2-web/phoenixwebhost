import assert from "node:assert/strict";
import test from "node:test";
import {
  PA_FINANCIAL_LEGAL,
  PA_FINANCIAL_SLUG,
  paFinancialAbout,
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
  assert.equal(JSON.stringify(seo).includes("Phoenixwebhost"), false);
});
