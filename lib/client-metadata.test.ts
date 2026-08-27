import assert from "node:assert/strict";
import test from "node:test";
import { wwwHost } from "./custom-domain.ts";
import { holaTaxSeo } from "./hola-tax-i18n.ts";

test("Hola Tax SEO is the tax office, not Phoenixwebhost marketing", () => {
  const seo = holaTaxSeo("en");
  assert.equal(seo.brand, "Hola Tax Service");
  assert.equal(seo.title, "Hola Tax Service — Tax preparation in Phoenix");
  assert.match(seo.description, /602\) 545-3308/);
  assert.match(seo.description, /1327 E Northern Ave/);
  assert.equal(seo.icon, "/clients/hola-tax-service/icon.png");
  assert.equal(`https://${wwwHost("www.hola-tax-service.com")}`, "https://www.hola-tax-service.com");
  const blob = JSON.stringify(seo);
  assert.equal(blob.includes("Phoenixwebhost"), false);
  assert.equal(blob.includes("$200"), false);
  assert.equal(blob.includes("$69"), false);
});
