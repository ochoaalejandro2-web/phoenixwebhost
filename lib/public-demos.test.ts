import assert from "node:assert/strict";
import test from "node:test";
import { PRICING } from "./config.ts";
import {
  PUBLIC_DEMOS,
  demoForTemplate,
  filterPublicDemos,
  filterTemplates,
} from "./public-demos.ts";

test("public demos are the real repo starting points, not invented shops", () => {
  const slugs = PUBLIC_DEMOS.map((demo) => demo.slug).sort();
  assert.deepEqual(slugs, [
    "casa-luna-salon",
    "desert-peak-roofing",
    "hola-tax-service",
    "ironwood-handyman",
    "mesa-street-kitchen",
    "palo-verde-yards",
  ]);
  for (const demo of PUBLIC_DEMOS) {
    assert.equal(demo.href, `/s/${demo.slug}`);
    assert.equal(demo.href.startsWith("/demo/"), false);
  }
  assert.equal(
    PUBLIC_DEMOS.some((demo) => /acme|fake shop|example landscaping/i.test(demo.name)),
    false,
  );
});

test("empty search returns every public demo", () => {
  assert.equal(filterPublicDemos("").length, PUBLIC_DEMOS.length);
  assert.equal(filterPublicDemos("   ").length, PUBLIC_DEMOS.length);
});

test("trade, city, name, and synonym queries find the matching live demo", () => {
  const landscaping = filterPublicDemos("landscaping");
  assert.equal(landscaping.length, 1);
  assert.equal(landscaping[0]?.slug, "palo-verde-yards");
  assert.equal(landscaping[0]?.href, "/s/palo-verde-yards");

  assert.equal(filterPublicDemos("yard")[0]?.slug, "palo-verde-yards");
  assert.equal(filterPublicDemos("lawn")[0]?.slug, "palo-verde-yards");
  assert.equal(filterPublicDemos("landscape")[0]?.slug, "palo-verde-yards");
  assert.equal(filterPublicDemos("jardineria")[0]?.slug, "palo-verde-yards");
  assert.ok(
    filterPublicDemos("Phoenix").some((row) => row.slug === "palo-verde-yards"),
  );

  assert.equal(filterPublicDemos("handyman")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("handy man")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("home repair")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("fixer")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("drywall")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("painting")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("odd jobs")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("reparaciones")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("manitas")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("Avondale")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("Ironwood")[0]?.slug, "ironwood-handyman");
  assert.equal(filterPublicDemos("repair")[0]?.slug, "ironwood-handyman");
  assert.ok(filterPublicDemos("repair").some((row) => row.slug === "ironwood-handyman"));

  assert.equal(filterPublicDemos("roofing")[0]?.slug, "desert-peak-roofing");
  assert.equal(filterPublicDemos("Tempe")[0]?.slug, "desert-peak-roofing");
  assert.equal(filterPublicDemos("Desert Peak")[0]?.slug, "desert-peak-roofing");

  assert.equal(filterPublicDemos("salon")[0]?.slug, "casa-luna-salon");
  assert.equal(filterPublicDemos("hair")[0]?.slug, "casa-luna-salon");
  assert.equal(filterPublicDemos("nails")[0]?.slug, "casa-luna-salon");
  assert.equal(filterPublicDemos("Scottsdale")[0]?.slug, "casa-luna-salon");

  assert.equal(filterPublicDemos("restaurant")[0]?.slug, "mesa-street-kitchen");
  assert.equal(filterPublicDemos("food")[0]?.slug, "mesa-street-kitchen");
  assert.equal(filterPublicDemos("taco")[0]?.slug, "mesa-street-kitchen");

  assert.equal(filterPublicDemos("tax")[0]?.slug, "hola-tax-service");
  assert.ok(filterPublicDemos("bookkeeping").some((row) => row.slug === "hola-tax-service"));
});

test("unknown queries return no demos", () => {
  assert.deepEqual(filterPublicDemos("submarine welding"), []);
});

test("template starting points stay mapped to those live demo URLs", () => {
  assert.equal(demoForTemplate("contractor")?.href, "/s/desert-peak-roofing");
  assert.equal(demoForTemplate("handyman")?.href, "/s/ironwood-handyman");
  assert.equal(demoForTemplate("salon")?.href, "/s/casa-luna-salon");
  assert.equal(demoForTemplate("restaurant")?.href, "/s/mesa-street-kitchen");
  assert.equal(demoForTemplate("landscaping")?.href, "/s/palo-verde-yards");
  assert.equal(demoForTemplate("tax")?.href, "/s/hola-tax-service");
  assert.equal(demoForTemplate("professional"), undefined);
  assert.ok(filterTemplates("landscaping").includes("landscaping"));
  assert.ok(filterTemplates("handyman").includes("handyman"));
  assert.ok(filterTemplates("manitas").includes("handyman"));
  assert.ok(filterTemplates("professional").includes("professional"));
});

test("plan copy on the public site is still $200 launch + $69/month", () => {
  assert.equal(PRICING.setupLabel, "$200");
  assert.equal(PRICING.monthlyLabel, "$69");
});
