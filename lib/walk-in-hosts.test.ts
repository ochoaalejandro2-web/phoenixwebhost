import assert from "node:assert/strict";
import test from "node:test";
import { clientHostDecision } from "./custom-domain.ts";
import {
  pickClientBySlug,
  resolveKnownCustomDomain,
  resolveWalkInHostSlug,
  walkInDisplayHost,
} from "./walk-in-hosts.ts";

test("short walk-in hosts always map to the stored demo slugs", () => {
  assert.equal(resolveWalkInHostSlug("ironwood"), "ironwood-handyman");
  assert.equal(resolveWalkInHostSlug("IRONWOOD"), "ironwood-handyman");
  assert.equal(resolveWalkInHostSlug("paloverde"), "palo-verde-yards");
  assert.equal(resolveWalkInHostSlug("palo-verde"), "palo-verde-yards");
  assert.equal(resolveWalkInHostSlug("desertpeak"), "desert-peak-roofing");
  assert.equal(resolveWalkInHostSlug("desert-peak"), "desert-peak-roofing");
  assert.equal(resolveWalkInHostSlug("desertsparkle"), "desert-sparkle-cleaning");
  assert.equal(resolveWalkInHostSlug("desert-sparkle"), "desert-sparkle-cleaning");
  assert.equal(resolveWalkInHostSlug("ironwood-handyman"), "ironwood-handyman");
  assert.equal(resolveWalkInHostSlug("unknown-shop"), null);
});

test("a stale short-slug row loses to the canonical walk-in demo", () => {
  const clients = [
    { slug: "ironwood", phone: undefined as unknown as string },
    { slug: "ironwood-handyman", phone: "(480) 555-0100" },
    { slug: "palo-verde-yards", phone: "(480) 555-0111" },
  ];
  assert.equal(pickClientBySlug(clients, "ironwood")?.slug, "ironwood-handyman");
  assert.equal(
    pickClientBySlug(clients, "ironwood-handyman")?.slug,
    "ironwood-handyman",
  );
  assert.equal(pickClientBySlug(clients, "paloverde")?.slug, "palo-verde-yards");
  assert.equal(pickClientBySlug(clients, "missing")?.slug, undefined);
});

test("hola-tax custom hosts stay on the tax office, not a demo subdomain", () => {
  assert.deepEqual(resolveKnownCustomDomain("hola-tax-service.com"), {
    slug: "hola-tax-service",
    customDomain: "www.hola-tax-service.com",
  });
  assert.deepEqual(resolveKnownCustomDomain("www.hola-tax-service.com"), {
    slug: "hola-tax-service",
    customDomain: "www.hola-tax-service.com",
  });
  assert.equal(resolveKnownCustomDomain("ironwood.phoenixwebhost.com"), null);
  assert.equal(resolveKnownCustomDomain("phoenixwebhost.com"), null);
});

test("walk-in hosts rewrite to /s/[canonical] the same way custom domains do", () => {
  assert.deepEqual(
    clientHostDecision({
      host: "ironwood.phoenixwebhost.com",
      pathname: "/",
      search: "",
      protocol: "https:",
      slug: "ironwood-handyman",
      customDomain: null,
      viaCustomDomain: false,
    }),
    { type: "rewrite", pathname: "/s/ironwood-handyman", search: "" },
  );
  assert.deepEqual(
    clientHostDecision({
      host: "desertpeak.phoenixwebhost.com",
      pathname: "/es",
      search: "",
      protocol: "https:",
      slug: "desert-peak-roofing",
      customDomain: null,
      viaCustomDomain: false,
    }),
    { type: "rewrite", pathname: "/s/desert-peak-roofing", search: "?lang=es" },
  );
  assert.deepEqual(
    clientHostDecision({
      host: "www.hola-tax-service.com",
      pathname: "/",
      search: "",
      protocol: "https:",
      slug: "hola-tax-service",
      customDomain: "www.hola-tax-service.com",
      viaCustomDomain: true,
    }),
    { type: "rewrite", pathname: "/s/hola-tax-service", search: "" },
  );
});

test("marketing chrome uses the short walk-in host labels", () => {
  assert.equal(
    walkInDisplayHost("ironwood-handyman", "ironwood-handyman.phoenixwebhost.com"),
    "ironwood.phoenixwebhost.com",
  );
  assert.equal(
    walkInDisplayHost("desert-sparkle-cleaning", "desert-sparkle-cleaning.phoenixwebhost.com"),
    "desertsparkle.phoenixwebhost.com",
  );
  assert.equal(
    walkInDisplayHost("casa-luna-salon", "casa-luna-salon.phoenixwebhost.com"),
    "casa-luna-salon.phoenixwebhost.com",
  );
});
