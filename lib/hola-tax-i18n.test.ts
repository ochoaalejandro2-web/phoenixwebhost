import assert from "node:assert/strict";
import test from "node:test";
import {
  HOLA_TAX_BOOKKEEPING_CATCHUP,
  HOLA_TAX_BOOKKEEPING_MONTHLY,
  HOLA_TAX_BOOKKEEPING_SERVICE,
  HOLA_TAX_LLC_SERVICE,
  holaTaxAbout,
  holaTaxBookkeepingPriceText,
  holaTaxCopy,
  holaTaxSeo,
  holaTaxServiceLabel,
  tHolaTax,
  withHolaTaxBookkeepingService,
  withHolaTaxListedServices,
  withHolaTaxLlcService,
} from "./hola-tax-i18n.ts";

const PWH_PRICES = /\$200\b|\$69\b|\$79\b|\$49\b|\$19\b/;
const FORBIDDEN_BOOK_PRICES = /\$299|\$399|\$499/;

function assertNoPhoenixwebhostPrices(text: string) {
  assert.equal(PWH_PRICES.test(text), false);
  assert.equal(/phoenixwebhost/i.test(text), false);
  assert.equal(/stripe/i.test(text), false);
}

function assertNoPrices(text: string) {
  assertNoPhoenixwebhostPrices(text);
  assert.equal(/\$(200|69|99|79|49|19)\b/.test(text), false);
  assert.equal(/\$\d/.test(text), false);
  assert.equal(/filing fee/i.test(text), false);
}

function booksBlob(locale: "en" | "es") {
  const copy = tHolaTax(locale);
  return [
    copy.booksKicker,
    copy.booksTitle,
    copy.booksPrice,
    copy.booksHeroCta,
    copy.booksLead,
    ...copy.booksSteps,
    copy.booksTaxNote,
    copy.booksCatchup,
    holaTaxBookkeepingPriceText(locale),
  ].join("\n");
}

test("Arizona LLC formation is labeled in English and Spanish", () => {
  assert.equal(HOLA_TAX_LLC_SERVICE, "Arizona LLC formation");
  assert.equal(holaTaxServiceLabel(HOLA_TAX_LLC_SERVICE, "en"), HOLA_TAX_LLC_SERVICE);
  assert.equal(
    holaTaxServiceLabel(HOLA_TAX_LLC_SERVICE, "es"),
    "Formación de LLC en Arizona",
  );
});

test("Bookkeeping is labeled Contabilidad and keeps owner-locked prices", () => {
  assert.equal(HOLA_TAX_BOOKKEEPING_SERVICE, "Bookkeeping");
  assert.equal(HOLA_TAX_BOOKKEEPING_MONTHLY, "$199");
  assert.equal(HOLA_TAX_BOOKKEEPING_CATCHUP, "$349");
  assert.equal(
    holaTaxServiceLabel(HOLA_TAX_BOOKKEEPING_SERVICE, "en"),
    "Bookkeeping",
  );
  assert.equal(
    holaTaxServiceLabel(HOLA_TAX_BOOKKEEPING_SERVICE, "es"),
    "Contabilidad",
  );
});

test("stale Hola Tax service lists still get LLC next to small-business tax", () => {
  const next = withHolaTaxLlcService([
    "Personal tax preparation",
    "Small-business tax preparation",
    "ITIN applications",
  ]);
  assert.deepEqual(next, [
    "Personal tax preparation",
    "Small-business tax preparation",
    HOLA_TAX_LLC_SERVICE,
    "ITIN applications",
  ]);
  assert.deepEqual(withHolaTaxLlcService(next), next);
});

test("stale Hola Tax service lists still get Bookkeeping before year-round tax", () => {
  const next = withHolaTaxListedServices([
    "Personal tax preparation",
    "Small-business tax preparation",
    "ITIN applications",
    "Year-round tax support",
  ]);
  assert.deepEqual(next, [
    "Personal tax preparation",
    "Small-business tax preparation",
    HOLA_TAX_LLC_SERVICE,
    "ITIN applications",
    HOLA_TAX_BOOKKEEPING_SERVICE,
    "Year-round tax support",
  ]);
  assert.deepEqual(withHolaTaxListedServices(next), next);
  assert.deepEqual(
    withHolaTaxBookkeepingService([HOLA_TAX_BOOKKEEPING_SERVICE]),
    [HOLA_TAX_BOOKKEEPING_SERVICE],
  );
});

test("Hola Tax LLC copy has no prices and is not a law-firm claim", () => {
  for (const locale of ["en", "es"] as const) {
    const copy = tHolaTax(locale);
    assert.match(copy.llcPromo, /LLC/);
    assert.match(copy.llcPromo, locale === "es" ? /bufete/ : /law firm/);
    assertNoPrices(copy.llcPromo);
    assertNoPrices(copy.about);
    assertNoPrices(JSON.stringify(copy.photos));
    assert.match(holaTaxAbout("", locale), /LLC/);
    assert.match(holaTaxAbout("", locale), locale === "es" ? /contabilidad/i : /bookkeeping/i);
    assertNoPrices(JSON.stringify(holaTaxSeo(locale)));
  }
  assert.match(holaTaxCopy.en.photos.llcSigning, /paperwork/);
  assert.match(holaTaxCopy.en.photos.llcHandshake, /handshake|hands/i);
  assert.match(holaTaxCopy.es.photos.llcStorefront, /negocio/);
});

test("Hola Tax bookkeeping is $199/month for one solo small business", () => {
  for (const locale of ["en", "es"] as const) {
    const copy = tHolaTax(locale);
    const blob = booksBlob(locale);
    assert.equal(copy.booksPrice.includes(HOLA_TAX_BOOKKEEPING_MONTHLY), true);
    assert.equal(copy.booksCatchup.includes(HOLA_TAX_BOOKKEEPING_CATCHUP), true);
    assert.equal(copy.booksSteps.length, 3);
    assert.match(blob, /QuickBooks Online/);
    assert.match(
      blob,
      locale === "es" ? /no está incluida/i : /not included/i,
    );
    assert.match(
      blob,
      locale === "es" ? /paga cada mes/i : /pay monthly/i,
    );
    assert.match(
      blob,
      locale === "es" ? /conecta su banco una vez/i : /connect your bank once/i,
    );
    assert.match(
      blob,
      locale === "es" ? /clasifica y concilia/i : /categorizes and reconciles/i,
    );
    assert.match(
      blob,
      locale === "es" ? /reportes para sus impuestos/i : /reports for your taxes/i,
    );
    assert.match(
      blob,
      locale === "es" ? /food truck|limpieza|manitas/i : /cleaner|handyman|food truck/i,
    );
    assert.match(
      blob,
      locale === "es" ? /un banco/i : /one bank/i,
    );
    assert.equal(/enterprise/i.test(blob), false);
    assert.equal(/payroll/i.test(blob), false);
    assert.equal(/plaid/i.test(blob), false);
    assert.equal(FORBIDDEN_BOOK_PRICES.test(blob), false);
    assertNoPhoenixwebhostPrices(blob);
    assert.equal(blob.includes("$199"), true);
    assert.equal(blob.includes("$349"), true);
  }
  assert.match(tHolaTax("en").ctaCallOrText("(602) 545-3308"), /Call or text/);
  assert.match(tHolaTax("es").ctaCallOrText("(602) 545-3308"), /texto/);
});
