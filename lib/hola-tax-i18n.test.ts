import assert from "node:assert/strict";
import test from "node:test";
import {
  HOLA_TAX_LLC_SERVICE,
  holaTaxAbout,
  holaTaxCopy,
  holaTaxSeo,
  holaTaxServiceLabel,
  tHolaTax,
  withHolaTaxLlcService,
} from "./hola-tax-i18n.ts";

function assertNoPrices(text: string) {
  assert.equal(/\$(200|69|99|79|49|19)\b/.test(text), false);
  assert.equal(/\$\d/.test(text), false);
  assert.equal(/filing fee/i.test(text), false);
}

test("Arizona LLC formation is labeled in English and Spanish", () => {
  assert.equal(HOLA_TAX_LLC_SERVICE, "Arizona LLC formation");
  assert.equal(holaTaxServiceLabel(HOLA_TAX_LLC_SERVICE, "en"), HOLA_TAX_LLC_SERVICE);
  assert.equal(
    holaTaxServiceLabel(HOLA_TAX_LLC_SERVICE, "es"),
    "Formación de LLC en Arizona",
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

test("Hola Tax LLC copy has no prices and is not a law-firm claim", () => {
  for (const locale of ["en", "es"] as const) {
    const copy = tHolaTax(locale);
    assert.match(copy.llcPromo, /LLC/);
    assert.match(copy.llcPromo, locale === "es" ? /bufete/ : /law firm/);
    assertNoPrices(copy.llcPromo);
    assertNoPrices(copy.about);
    assertNoPrices(JSON.stringify(copy.photos));
    assert.match(holaTaxAbout("", locale), /LLC/);
    assertNoPrices(JSON.stringify(holaTaxSeo(locale)));
  }
  assert.match(holaTaxCopy.en.photos.llcSigning, /paperwork/);
  assert.match(holaTaxCopy.en.photos.llcHandshake, /handshake|hands/i);
  assert.match(holaTaxCopy.es.photos.llcStorefront, /negocio/);
});
