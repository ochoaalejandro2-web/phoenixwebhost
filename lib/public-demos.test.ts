import assert from "node:assert/strict";
import test from "node:test";
import { PRICING } from "./config.ts";
import {
  PUBLIC_DEMOS,
  demoForTemplate,
  filterPublicDemos,
  filterTemplates,
  isAlwaysLiveWalkInDemo,
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
    "premium-carpentry-designs",
  ]);
  for (const demo of PUBLIC_DEMOS) {
    assert.equal(demo.href, `/s/${demo.slug}`);
    assert.equal(demo.href.startsWith("/demo/"), false);
  }
  assert.equal(
    PUBLIC_DEMOS.find((demo) => demo.slug === "ironwood-handyman")?.hostLabel,
    "ironwood.phoenixwebhost.com",
  );
  assert.equal(
    PUBLIC_DEMOS.find((demo) => demo.slug === "palo-verde-yards")?.hostLabel,
    "paloverde.phoenixwebhost.com",
  );
  assert.equal(
    PUBLIC_DEMOS.find((demo) => demo.slug === "desert-peak-roofing")?.hostLabel,
    "desertpeak.phoenixwebhost.com",
  );
  assert.equal(
    PUBLIC_DEMOS.find((demo) => demo.slug === "hola-tax-service")?.hostLabel,
    "www.hola-tax-service.com",
  );
  assert.equal(
    PUBLIC_DEMOS.find((demo) => demo.slug === "premium-carpentry-designs")?.hostLabel,
    "phoenixwebhost.com/s/premium-carpentry-designs",
  );
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

  assert.equal(filterPublicDemos("carpentry")[0]?.slug, "premium-carpentry-designs");
  assert.equal(filterPublicDemos("Premium Carpentry Designs")[0]?.slug, "premium-carpentry-designs");
  assert.equal(filterPublicDemos("cabinets")[0]?.slug, "premium-carpentry-designs");
  assert.equal(filterPublicDemos("millwork")[0]?.slug, "premium-carpentry-designs");
  assert.equal(filterPublicDemos("built-ins")[0]?.slug, "premium-carpentry-designs");
  assert.equal(filterPublicDemos("furniture")[0]?.slug, "premium-carpentry-designs");
  assert.equal(filterPublicDemos("gabinetes")[0]?.slug, "premium-carpentry-designs");
  assert.equal(filterPublicDemos("ebanisteria")[0]?.slug, "premium-carpentry-designs");
  assert.equal(
    filterPublicDemos("carpentry")[0]?.href,
    "/s/premium-carpentry-designs",
  );
  assert.ok(
    filterPublicDemos("Phoenix").some((row) => row.slug === "premium-carpentry-designs"),
  );

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
  assert.equal(demoForTemplate("carpentry")?.href, "/s/premium-carpentry-designs");
  assert.equal(demoForTemplate("salon")?.href, "/s/casa-luna-salon");
  assert.equal(demoForTemplate("restaurant")?.href, "/s/mesa-street-kitchen");
  assert.equal(demoForTemplate("landscaping")?.href, "/s/palo-verde-yards");
  assert.equal(demoForTemplate("tax")?.href, "/s/hola-tax-service");
  assert.equal(demoForTemplate("professional"), undefined);
  assert.ok(filterTemplates("landscaping").includes("landscaping"));
  assert.ok(filterTemplates("handyman").includes("handyman"));
  assert.ok(filterTemplates("carpentry").includes("carpentry"));
  assert.ok(filterTemplates("millwork").includes("carpentry"));
  assert.ok(filterTemplates("manitas").includes("handyman"));
  assert.ok(filterTemplates("professional").includes("professional"));
});

test("plan copy on the public site is still $200 launch + $69/month", () => {
  assert.equal(PRICING.setupLabel, "$200");
  assert.equal(PRICING.monthlyLabel, "$69");
});

test("walk-in template demos stay live; Hola Tax can still go unpaid", () => {
  assert.equal(isAlwaysLiveWalkInDemo("mesa-street-kitchen"), true);
  assert.equal(isAlwaysLiveWalkInDemo("desert-peak-roofing"), true);
  assert.equal(isAlwaysLiveWalkInDemo("ironwood-handyman"), true);
  assert.equal(isAlwaysLiveWalkInDemo("casa-luna-salon"), true);
  assert.equal(isAlwaysLiveWalkInDemo("palo-verde-yards"), true);
  assert.equal(isAlwaysLiveWalkInDemo("premium-carpentry-designs"), true);
  assert.equal(isAlwaysLiveWalkInDemo("hola-tax-service"), false);
  assert.equal(isAlwaysLiveWalkInDemo("a-real-unpaid-shop"), false);
});
