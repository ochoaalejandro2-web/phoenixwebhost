import assert from "node:assert/strict";
import test from "node:test";
import {
  apexWwwRedirectHost,
  clientHostDecision,
  customDomainMatchesHost,
  findClientByCustomDomain,
  normalizeCustomDomain,
  resolveDemoSubdomainSlug,
  subdomainSlug,
} from "./custom-domain.ts";

const hola = {
  slug: "hola-tax-service",
  customDomain: "www.hola-tax-service.com",
};

test("normalizeCustomDomain strips protocol, path, port, and case", () => {
  assert.equal(
    normalizeCustomDomain("https://WWW.Hola-Tax-Service.com/path?x=1"),
    "www.hola-tax-service.com",
  );
  assert.equal(normalizeCustomDomain("hola-tax-service.com:443"), "hola-tax-service.com");
  assert.equal(normalizeCustomDomain("  "), null);
});

test("www and apex of a stored custom domain both match", () => {
  assert.equal(
    customDomainMatchesHost("www.hola-tax-service.com", "hola-tax-service.com"),
    true,
  );
  assert.equal(
    customDomainMatchesHost("www.hola-tax-service.com", "www.hola-tax-service.com"),
    true,
  );
  assert.equal(
    customDomainMatchesHost("hola-tax-service.com", "www.hola-tax-service.com"),
    true,
  );
  assert.equal(
    customDomainMatchesHost("www.hola-tax-service.com", "phoenixwebhost.com"),
    false,
  );
});

test("findClientByCustomDomain maps apex to the www-stored client", () => {
  const clients = [
    { slug: "other", customDomain: null },
    hola,
  ];
  assert.equal(
    findClientByCustomDomain(clients, "hola-tax-service.com")?.slug,
    "hola-tax-service",
  );
  assert.equal(
    findClientByCustomDomain(clients, "WWW.HOLA-TAX-SERVICE.COM:443")?.slug,
    "hola-tax-service",
  );
  assert.equal(findClientByCustomDomain(clients, "unknown.com"), null);
});

test("apex of a www custom domain 301s to www and keeps path + query", () => {
  assert.equal(
    apexWwwRedirectHost("hola-tax-service.com", hola.customDomain),
    "www.hola-tax-service.com",
  );
  assert.equal(
    apexWwwRedirectHost("www.hola-tax-service.com", hola.customDomain),
    null,
  );
  const decision = clientHostDecision({
    host: "hola-tax-service.com",
    pathname: "/portal/login",
    search: "?lang=es",
    protocol: "https:",
    slug: hola.slug,
    customDomain: hola.customDomain,
    viaCustomDomain: true,
  });
  assert.deepEqual(decision, {
    type: "redirect",
    url: "https://www.hola-tax-service.com/portal/login?lang=es",
    status: 301,
  });
});

test("www custom domain rewrites to the generated client site", () => {
  assert.deepEqual(
    clientHostDecision({
      host: "www.hola-tax-service.com",
      pathname: "/",
      search: "",
      protocol: "https:",
      slug: hola.slug,
      customDomain: hola.customDomain,
      viaCustomDomain: true,
    }),
    {
      type: "rewrite",
      pathname: "/s/hola-tax-service",
      search: "",
    },
  );
  assert.deepEqual(
    clientHostDecision({
      host: "www.hola-tax-service.com",
      pathname: "/portal/staff/login",
      search: "?lang=en",
      protocol: "https:",
      slug: hola.slug,
      customDomain: hola.customDomain,
      viaCustomDomain: true,
    }),
    {
      type: "rewrite",
      pathname: "/s/hola-tax-service/portal/staff/login",
      search: "?lang=en",
    },
  );
});

test("/es on a client host rewrites to that client with lang=es, not marketing /es", () => {
  assert.deepEqual(
    clientHostDecision({
      host: "www.hola-tax-service.com",
      pathname: "/es",
      search: "",
      protocol: "https:",
      slug: hola.slug,
      customDomain: hola.customDomain,
      viaCustomDomain: true,
    }),
    {
      type: "rewrite",
      pathname: "/s/hola-tax-service",
      search: "?lang=es",
    },
  );
});

test("portal paths that already include /s/ stay put so logins do not bounce", () => {
  assert.deepEqual(
    clientHostDecision({
      host: "www.hola-tax-service.com",
      pathname: "/s/hola-tax-service/portal/login",
      search: "",
      protocol: "https:",
      slug: hola.slug,
      customDomain: hola.customDomain,
      viaCustomDomain: true,
    }),
    { type: "next" },
  );
});

test("subdomain custom domains are not redirected to an invented www host", () => {
  assert.equal(
    apexWwwRedirectHost("tax.other-shop.com", "tax.other-shop.com"),
    null,
  );
});

test("client subdomains of the platform root still resolve a slug", () => {
  assert.equal(
    subdomainSlug("hola-tax-service.phoenixwebhost.com", "phoenixwebhost.com"),
    "hola-tax-service",
  );
  assert.equal(subdomainSlug("www.phoenixwebhost.com", "phoenixwebhost.com"), null);
  assert.equal(subdomainSlug("phoenixwebhost.com", "phoenixwebhost.com"), null);
});

test("short walk-in hosts map onto the stored demo slugs", () => {
  const slugs = [
    "desert-peak-roofing",
    "ironwood-handyman",
    "casa-luna-salon",
    "mesa-street-kitchen",
    "palo-verde-yards",
    "desert-sparkle-cleaning",
    "hola-tax-service",
  ];
  assert.equal(resolveDemoSubdomainSlug("ironwood", slugs), "ironwood-handyman");
  assert.equal(resolveDemoSubdomainSlug("paloverde", slugs), "palo-verde-yards");
  assert.equal(resolveDemoSubdomainSlug("desertpeak", slugs), "desert-peak-roofing");
  assert.equal(resolveDemoSubdomainSlug("desertsparkle", slugs), "desert-sparkle-cleaning");
  assert.equal(
    resolveDemoSubdomainSlug("ironwood-handyman", slugs),
    "ironwood-handyman",
  );
  assert.equal(resolveDemoSubdomainSlug("unknown-shop", slugs), null);
});
