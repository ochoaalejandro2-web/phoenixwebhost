import assert from "node:assert/strict";
import test from "node:test";
import {
  PA_FINANCIAL_LEGAL,
  PA_FINANCIAL_SLUG,
  paFinancialAbout,
  paFinancialSeo,
  paFinancialServiceLabel,
} from "./pa-financial-i18n.ts";

test("P&A Financial copy stays on this shop", () => {
  assert.equal(PA_FINANCIAL_SLUG, "pa-financial");
  assert.match(paFinancialAbout("", "en"), /Patricia Escobedo/);
  assert.match(paFinancialAbout("", "es"), /ocho años/);
  assert.equal(
    paFinancialServiceLabel("Business Registration", "es"),
    "Registro de negocios",
  );
  const seo = paFinancialSeo("en");
  assert.equal(seo.brand, PA_FINANCIAL_LEGAL);
  assert.equal(JSON.stringify(seo).includes("Phoenixwebhost"), false);
});
