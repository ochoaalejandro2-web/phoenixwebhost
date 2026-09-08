import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("marketing header keeps the wordmark clear of See your site", () => {
  const chrome = readFileSync(
    new URL("../components/marketing/Chrome.tsx", import.meta.url),
    "utf8",
  );
  const header = chrome.slice(
    chrome.indexOf("export function SiteHeader"),
    chrome.indexOf("export function SiteFooter"),
  );

  assert.match(header, /flex-wrap/);
  assert.match(header, /gap-x-10/);
  assert.match(header, /shrink-0/);
  assert.doesNotMatch(header, /min-w-0 shrink/);
  assert.match(header, /c\.nav\.seeSite/);
  assert.match(header, /whitespace-nowrap hover:text-lime/);
});

test("client shops and tax portals do not use the marketing SiteHeader", () => {
  const shop = readFileSync(
    new URL("../components/sites/ShopSite.tsx", import.meta.url),
    "utf8",
  );
  const tax = readFileSync(
    new URL("../components/sites/TaxOfficeSite.tsx", import.meta.url),
    "utf8",
  );
  const portal = readFileSync(
    new URL("../components/tax-portal/PortalChrome.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(shop, /SiteHeader/);
  assert.doesNotMatch(tax, /SiteHeader/);
  assert.doesNotMatch(portal, /SiteHeader/);
  assert.match(shop, /shop-header/);
  assert.match(tax, /shop-header/);
});
