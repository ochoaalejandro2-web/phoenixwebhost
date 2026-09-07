import assert from "node:assert/strict";
import test from "node:test";
import {
  PA_FINANCIAL_AZ_REFUND,
  PA_FINANCIAL_IRS_PAYMENTS,
  PA_FINANCIAL_IRS_REFUND,
  PA_FINANCIAL_LEGAL,
  PA_FINANCIAL_LOGO,
  PA_FINANCIAL_OWNER,
  PA_FINANCIAL_SLUG,
  paFinancialAbout,
  paFinancialCopy,
  paFinancialRefundLinks,
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
  assert.match(paFinancialAbout("", "en"), /Latino/);
  assert.match(paFinancialCopy("en").tagline, /Hispanic community/);
  assert.match(paFinancialCopy("es").tagline, /comunidad latina/);
  assert.match(paFinancialCopy("en").heroLede, /bilingual/i);
  assert.equal(paFinancialCopy("en").aboutKicker, "For the Latino community");
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

test("P&A Financial refund helper links stay public and bilingual", () => {
  assert.equal(PA_FINANCIAL_IRS_REFUND, "https://sa.www4.irs.gov/wmr/");
  assert.equal(PA_FINANCIAL_AZ_REFUND, "https://aztaxes.gov/Home/CheckRefund");
  assert.equal(PA_FINANCIAL_IRS_PAYMENTS, "https://www.irs.gov/payments");
  const en = paFinancialRefundLinks("en");
  const es = paFinancialRefundLinks("es");
  assert.equal(en.length, 3);
  assert.equal(es.length, 3);
  assert.deepEqual(
    en.map((link) => link.href),
    [
      PA_FINANCIAL_IRS_REFUND,
      PA_FINANCIAL_AZ_REFUND,
      PA_FINANCIAL_IRS_PAYMENTS,
    ],
  );
  assert.deepEqual(
    es.map((link) => link.href),
    [
      PA_FINANCIAL_IRS_REFUND,
      PA_FINANCIAL_AZ_REFUND,
      PA_FINANCIAL_IRS_PAYMENTS,
    ],
  );
  assert.equal(en[0].label, "IRS Where's My Refund");
  assert.equal(en[1].label, "Where is my state refund");
  assert.equal(en[2].label, "Payments | Internal Revenue Service");
  assert.equal(paFinancialCopy("en").refundTitle, "Check your refund");
  assert.equal(es[0].label, "¿Dónde está mi reembolso? (IRS)");
  assert.equal(es[1].label, "¿Dónde está mi reembolso estatal?");
  assert.equal(es[2].label, "Pagos | Internal Revenue Service");
  assert.equal(paFinancialCopy("es").refundTitle, "Consulte su reembolso");
});
