import assert from "node:assert/strict";
import test from "node:test";
import {
  parseSiteLocale,
  resolveSiteLocale,
  siteLangCookieName,
  siteSupportsI18n,
  withSiteLangPath,
  withSiteLangQuery,
} from "./site-locale.ts";

test("query lang wins over the cookie", () => {
  assert.equal(
    resolveSiteLocale({ query: "es", cookie: "en" }),
    "es",
  );
  assert.equal(
    resolveSiteLocale({ query: ["en"], cookie: "es" }),
    "en",
  );
});

test("cookie is used when the query is missing", () => {
  assert.equal(resolveSiteLocale({ cookie: "es" }), "es");
  assert.equal(resolveSiteLocale({}), "en");
  assert.equal(resolveSiteLocale({ query: "fr", cookie: "nope" }), "en");
});

test("parseSiteLocale only accepts en and es", () => {
  assert.equal(parseSiteLocale("es"), "es");
  assert.equal(parseSiteLocale("en"), "en");
  assert.equal(parseSiteLocale("ES"), null);
  assert.equal(parseSiteLocale(""), null);
});

test("language cookie is per slug so shops do not share it", () => {
  assert.equal(siteLangCookieName("hola-tax-service"), "pwh_lang_hola-tax-service");
  assert.equal(
    siteLangCookieName("other-tax-shop"),
    "pwh_lang_other-tax-shop",
  );
});

test("i18n is on for Hola Tax and the tax-office template only", () => {
  assert.equal(siteSupportsI18n("hola-tax-service"), true);
  assert.equal(siteSupportsI18n("desert-peak-roofing"), false);
  assert.equal(siteSupportsI18n("any-shop", "tax"), true);
  assert.equal(siteSupportsI18n("any-shop", "contractor"), false);
});

test("withSiteLangQuery and withSiteLangPath keep lang on redirects", () => {
  assert.equal(withSiteLangQuery("sent=1", "es"), "sent=1&lang=es");
  assert.equal(withSiteLangQuery("", "en"), "lang=en");
  assert.equal(
    withSiteLangPath("/s/hola-tax-service/portal/login", "es"),
    "/s/hola-tax-service/portal/login?lang=es",
  );
  assert.equal(
    withSiteLangPath("/s/hola-tax-service#contact", "es"),
    "/s/hola-tax-service?lang=es#contact",
  );
});
