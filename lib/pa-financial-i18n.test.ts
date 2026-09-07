import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  PA_FINANCIAL_AZ_REFUND,
  PA_FINANCIAL_IRS_PAYMENTS,
  PA_FINANCIAL_IRS_REFUND,
  PA_FINANCIAL_LEGAL,
  PA_FINANCIAL_LOGO,
  PA_FINANCIAL_OWNER,
  PA_FINANCIAL_SLUG,
  PA_FINANCIAL_TEL,
  paFinancialAbout,
  paFinancialCopy,
  paFinancialHours,
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
  assert.equal(PA_FINANCIAL_LOGO, "/clients/pa-financial/logo-brand.svg");
  assert.equal(PA_FINANCIAL_TEL, "tel:7205010501");
  assert.match(PA_FINANCIAL_OWNER, /\/clients\/pa-financial\/patricia\.jpg/);
  assert.equal(paFinancialCopy("en").scheduleTitle, "Schedule Your Appointment");
  assert.match(paFinancialCopy("en").scheduleBlurb, /Call or schedule/);
  assert.equal(paFinancialCopy("en").footerSocial, "Social Media");
  assert.equal(JSON.stringify(seo).includes("Phoenixwebhost"), false);
});

test("P&A Financial What we do copy names the real services in both languages", () => {
  const en = paFinancialCopy("en");
  const es = paFinancialCopy("es");
  assert.equal(en.aboutTitle, "What we do");
  assert.equal(es.aboutTitle, "Qué hacemos");
  assert.equal(en.navAbout, "What we do");
  assert.equal(es.navAbout, "Qué hacemos");
  assert.match(en.aboutLead, /Income tax preparation/);
  assert.match(en.aboutLead, /ITIN/);
  assert.match(en.aboutLead, /business registration/i);
  assert.match(en.aboutLead, /bookkeeping/i);
  assert.match(es.aboutLead, /impuestos/);
  assert.match(es.aboutLead, /ITIN/);
  assert.match(es.aboutLead, /registro de negocios/i);
  assert.match(es.aboutLead, /Contabilidad/);
  assert.equal(en.whatWeDo.length, 3);
  assert.equal(es.whatWeDo.length, 3);
  assert.match(en.whatWeDo[0].title, /Income tax/i);
  assert.match(es.whatWeDo[0].title, /impuestos/i);
  assert.match(en.whatWeDo[1].blurb, /ITIN/);
  assert.match(es.whatWeDo[2].title, /Registro/);
  assert.match(paFinancialAbout("", "en"), /Patricia Escobedo/);
  assert.match(paFinancialAbout("", "en"), /ITIN/);
  assert.match(paFinancialServiceBlurb("Income Tax Preparation", "en"), /File on time/);
  assert.equal(paFinancialServicesTitle("en"), "Our Services");
});

test("P&A Financial offers call and schedule appointment in both languages", () => {
  const en = paFinancialCopy("en");
  const es = paFinancialCopy("es");
  assert.equal(en.readyCta, "Ready to call or schedule an appointment?");
  assert.equal(es.readyCta, "¿Listo para llamar o programar una cita?");
  assert.equal(en.scheduleCta, "Schedule appointment");
  assert.equal(es.scheduleCta, "Programar una cita");
  assert.match(en.hours, /call or schedule/);
  assert.match(es.hours, /llame o programe/);
  assert.equal(paFinancialHours("en"), en.hours);
  assert.equal(PA_FINANCIAL_TEL, "tel:7205010501");
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

test("P&A Financial circular brand logo spins unless motion is reduced", () => {
  const logo = readFileSync(
    new URL("../public/clients/pa-financial/logo-brand.svg", import.meta.url),
    "utf8",
  );
  assert.match(logo, /P&amp;A Financial LLC/);
  assert.match(logo, /1040/);
  assert.match(logo, /INCOME TAXES AND BOOKKEEPING/);
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /@keyframes pa-logo-spin/);
  assert.match(css, /animation:\s*pa-logo-spin 16s linear infinite/);
  assert.match(
    css,
    /prefers-reduced-motion:\s*reduce[\s\S]*theme-tax-pro[\s\S]*\.pa-logo-spin[\s\S]*animation:\s*none/,
  );
  const site = readFileSync(
    new URL("../components/sites/TaxOfficeSite.tsx", import.meta.url),
    "utf8",
  );
  assert.match(site, /href="#appointment"/);
  assert.match(site, /pa-logo-spin/);
  assert.match(site, /telHref\(phone\)/);
  assert.match(site, /isTaxProLayout/);
});
