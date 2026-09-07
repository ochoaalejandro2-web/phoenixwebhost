import assert from "node:assert/strict";
import test from "node:test";
import {
  PA_FINANCIAL_BRAND,
  PA_FINANCIAL_EMAIL,
  PA_FINANCIAL_LEGAL,
  PA_FINANCIAL_LOGO_SRC,
  PA_FINANCIAL_OWNER,
  PA_FINANCIAL_PHONE,
  PA_FINANCIAL_SERVICES,
  PA_FINANCIAL_SLUG,
  paFinancialAbout,
  paFinancialCopy,
  paFinancialHours,
  paFinancialPageTitle,
  paFinancialSeo,
  paFinancialServiceLabel,
} from "./pa-financial-i18n.ts";

test("P&A Financial copy is the tax office, not Phoenixwebhost marketing", () => {
  for (const locale of ["en", "es"] as const) {
    const blob = JSON.stringify(paFinancialCopy[locale]);
    assert.equal(blob.includes("Phoenixwebhost"), false);
    assert.equal(blob.includes("$200"), false);
    assert.equal(blob.includes("$69"), false);
    assert.match(paFinancialAbout("", locale), /Patricia Escobedo/);
    assert.match(paFinancialAbout("", locale), /Colorado/);
    assert.match(
      paFinancialAbout("", locale),
      locale === "es" ? /hispana/i : /Hispanic/i,
    );
    assert.match(paFinancialHours(locale), locale === "es" ? /cita/i : /appointment/i);
    const seo = paFinancialSeo(locale);
    assert.equal(seo.brand, PA_FINANCIAL_LEGAL);
    assert.match(seo.title, /P&A Financial LLC/);
    assert.equal(seo.icon, null);
  }
  assert.equal(PA_FINANCIAL_SLUG, "pa-financial");
  assert.equal(PA_FINANCIAL_BRAND, "P&A Financial");
  assert.equal(PA_FINANCIAL_OWNER, "Patricia Escobedo");
  assert.equal(PA_FINANCIAL_PHONE, "(720) 501-0501");
  assert.equal(PA_FINANCIAL_EMAIL, "pafinancial19@gmail.com");
  assert.equal(PA_FINANCIAL_LOGO_SRC, null);
});

test("P&A Financial lists only the three sold services and translates them", () => {
  assert.deepEqual([...PA_FINANCIAL_SERVICES], [
    "Income Tax Preparation",
    "ITIN Number Processing and Renewal",
    "Business Registration",
  ]);
  assert.equal(
    paFinancialServiceLabel("Income Tax Preparation", "es"),
    "Preparación de impuestos sobre la renta",
  );
  assert.equal(
    paFinancialServiceLabel("ITIN Number Processing and Renewal", "es"),
    "Trámite y renovación de número ITIN",
  );
  assert.equal(
    paFinancialServiceLabel("Business Registration", "es"),
    "Registro de negocios",
  );
});

test("P&A Financial does not invent reviews, an address, or prices", () => {
  const en = JSON.stringify(paFinancialCopy.en);
  const es = JSON.stringify(paFinancialCopy.es);
  assert.match(paFinancialCopy.en.reviewsSoon, /coming soon/i);
  assert.match(paFinancialCopy.es.reviewsSoon, /pronto/i);
  assert.equal(/★★|Rosa M|Andre W|Lucia F|salon|acne/i.test(en + es), false);
  assert.equal(/\$\d/.test(en + es), false);
  assert.match(paFinancialCopy.en.addressSoon, /coming soon/i);
});

test("P&A Financial page titles stay on this shop", () => {
  assert.match(paFinancialPageTitle("home", "en"), /Tax preparation/);
  assert.match(paFinancialPageTitle("about", "en"), /About Us/);
  assert.match(paFinancialPageTitle("services", "es"), /Servicios/);
  assert.match(paFinancialPageTitle("contact", "es"), /Contacto/);
});
