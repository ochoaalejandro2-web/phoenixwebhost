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
    "Registro de Negocios",
  );
  assert.match(paFinancialAbout("", "en"), /Latino/);
  assert.match(paFinancialCopy("en").tagline, /Hispanic community/);
  assert.match(paFinancialCopy("es").tagline, /comunidad latina/);
  assert.match(paFinancialCopy("en").heroLede, /bilingual/i);
  assert.equal(paFinancialCopy("en").aboutKicker, "For the Latino community");
  const seo = paFinancialSeo("en");
  assert.equal(seo.brand, PA_FINANCIAL_LEGAL);
  assert.equal(seo.icon, "/clients/pa-financial/icon.png");
  assert.equal(PA_FINANCIAL_LOGO, "/clients/pa-financial/logo-brand.png");
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
  assert.match(en.aboutLead, /Personal and business tax preparation/);
  assert.match(en.aboutLead, /W-2 \/ 1099 \/ Uber/);
  assert.match(en.aboutLead, /ITIN/);
  assert.match(en.aboutLead, /business registration/i);
  assert.match(en.aboutLead, /bookkeeping \/ payroll/i);
  assert.match(es.aboutLead, /Preparación de impuestos personales y de negocio/);
  assert.match(es.aboutLead, /W-2 \/ 1099 \/ Uber/);
  assert.match(es.aboutLead, /ITIN/);
  assert.match(es.aboutLead, /registro de negocios/i);
  assert.match(es.aboutLead, /bookkeeping \/ nómina/i);
  assert.equal(en.whatWeDo.length, 5);
  assert.equal(es.whatWeDo.length, 5);
  assert.deepEqual(
    en.whatWeDo.map((item) => item.title),
    [
      "Personal and Business Tax Preparation",
      "W-2 / 1099 / Uber",
      "ITIN Number Processing",
      "Business Registration",
      "Bookkeeping / Payroll",
    ],
  );
  assert.deepEqual(
    es.whatWeDo.map((item) => item.title),
    en.whatWeDo.map((item) => item.title),
  );
  assert.equal(
    paFinancialServiceLabel("Personal and Business Tax Preparation", "es"),
    "Preparación de Impuestos Personales y Negocio",
  );
  assert.equal(paFinancialServiceLabel("W-2 / 1099 / Uber", "es"), "W-2 / 1099 / Uber");
  assert.equal(
    paFinancialServiceLabel("ITIN Number Processing", "es"),
    "Trámite de ITIN Number",
  );
  assert.equal(
    paFinancialServiceLabel("Bookkeeping / Payroll", "es"),
    "Bookkeeping / Nómina",
  );
  assert.match(es.whatWeDo[1].blurb, /Uber/i);
  assert.match(en.whatWeDo[2].title, /ITIN/);
  assert.match(en.whatWeDo[4].title, /Bookkeeping \/ Payroll/);
  assert.match(paFinancialAbout("", "en"), /Patricia Escobedo/);
  assert.match(paFinancialAbout("", "en"), /ITIN/);
  assert.match(
    paFinancialServiceBlurb("Personal and Business Tax Preparation", "en"),
    /household/i,
  );
  assert.match(paFinancialServiceBlurb("W-2 / 1099 / Uber", "en"), /rideshare/i);
  assert.match(paFinancialServiceBlurb("Bookkeeping / Payroll", "es"), /nómina/i);
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

test("P&A Financial circular brand logo is the white PNG and only the appointment seal spins", () => {
  const logo = readFileSync(
    new URL("../public/clients/pa-financial/logo-brand.png", import.meta.url),
  );
  assert.equal(logo[0], 0x89);
  assert.equal(logo[1], 0x50);
  assert.equal(logo[2], 0x4e);
  assert.equal(logo[3], 0x47);
  assert.ok(logo.length > 20_000);
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /@keyframes pa-logo-spin/);
  assert.match(css, /\.pa-appoint-logo[\s\S]*animation:\s*pa-logo-spin 16s linear infinite/);
  assert.match(css, /\.pa-brand-logo[\s\S]*6\.5rem/);
  assert.match(
    css,
    /prefers-reduced-motion:\s*reduce[\s\S]*theme-tax-pro[\s\S]*\.pa-appoint-logo[\s\S]*animation:\s*none/,
  );
  const site = readFileSync(
    new URL("../components/sites/TaxOfficeSite.tsx", import.meta.url),
    "utf8",
  );
  assert.match(site, /href="#appointment"/);
  assert.match(site, /pa-logo-spin/);
  assert.match(site, /pa-appoint-logo/);
  assert.match(site, /telHref\(phone\)/);
  assert.match(site, /isTaxProLayout/);
});
