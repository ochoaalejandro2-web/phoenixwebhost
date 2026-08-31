import assert from "node:assert/strict";
import test from "node:test";
import { COMPANY, PRICING } from "./config.ts";
import { copy } from "./i18n.ts";
import {
  GATEWAY_MODEL,
  GATEWAY_URL,
  answerReceptionist,
  buildClientFacts,
  buildStudioFacts,
  extractListedPrices,
  fallbackAnswer,
  matchListedServices,
} from "./receptionist.ts";
import type { Client } from "./types.ts";

function client(partial: Partial<Client> & Pick<Client, "businessName" | "slug" | "template">): Client {
  return {
    id: partial.id || `cli_${partial.slug}`,
    contactName: "",
    email: "",
    phone: "(602) 555-0100",
    address: "100 N Central Ave",
    city: "Phoenix, AZ",
    hours: "Mon–Sat 7:00am–5:00pm",
    tagline: "",
    about: "",
    services: [],
    customDomain: null,
    siteStatus: "live",
    paymentStatus: "paid",
    lastPaymentAt: null,
    nextInvoiceAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeBoostSubscriptionId: null,
    localBoost: false,
    stripeTrafficSubscriptionId: null,
    trafficAds: false,
    stripeLoudSubscriptionId: null,
    loudAds: false,
    stripeEmailSubscriptionId: null,
    businessEmail: false,
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    notes: [],
    editRequests: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

const landscaping = client({
  businessName: "Palo Verde Yards",
  slug: "palo-verde-yards",
  template: "landscaping",
  phone: "(602) 555-0168",
  city: "Phoenix, AZ",
  hours: "Mon–Sat 7:00am–5:00pm",
  tagline: "Desert yards that stay green without wasting water.",
  about: "Desert plants, lawns, drip irrigation, and cleanup.",
  services: [
    "Desert landscaping",
    "Lawn care",
    "Drip irrigation",
    "Rock and gravel yards",
  ],
});

const holaTax = client({
  businessName: "Hola Tax Service LLC",
  slug: "hola-tax-service",
  template: "tax",
  phone: "(602) 545-3308",
  address: "1327 E Northern Ave, Phoenix, AZ 85020",
  city: "Phoenix, AZ",
  hours: "Mon 10am–7pm; Tue closed; Wed–Sat 10am–7pm; Sun closed",
  tagline: "Personal & small-business tax preparation in Phoenix",
  about:
    "Hola Tax Service prepares personal and small-business taxes in Phoenix, and helps with Arizona LLC paperwork.",
  services: [
    "Personal tax preparation",
    "Small-business tax preparation",
    "Arizona LLC formation",
    "ITIN applications",
    "Bookkeeping",
    "Year-round tax support",
  ],
});

test("marketing copy presents the AI receptionist as included, not a $49 extra", () => {
  for (const locale of ["en", "es"] as const) {
    const included = copy[locale].included.join(" ");
    assert.match(included, locale === "es" ? /recepcionista/i : /receptionist/i);
    assert.match(included, locale === "es" ? /incluida/i : /included/i);
    assert.equal(/\$49/.test(included), false);
    assert.equal(/add-on|complemento/i.test(included), false);
  }
  const studio = fallbackAnswer(buildStudioFacts("en"), "is the receptionist included?");
  assert.match(studio, /included/i);
  assert.match(studio, /\$200/);
  assert.match(studio, /\$69/);
  assert.equal(/\$49 extra/.test(studio), false);
  assert.equal(studio.toLowerCase().includes("unavailable"), false);
});

test("marketing ladder keeps receptionist included and lists the paid extras", () => {
  const en = copy.en;
  const extras = [
    en.bookTitle,
    en.missedTitle,
    en.reviewTextsTitle,
    en.voiceTitle,
    en.emailTitle,
  ].join(" ");
  assert.match(en.included.join(" "), /receptionist/i);
  assert.match(en.includedSplit, /Included/);
  assert.match(en.extrasSplit, /not in the \$200 \+ \$69/i);
  assert.match(extras, /Book a job/);
  assert.match(extras, /Missed-call/);
  assert.match(extras, /Review texts/);
  assert.match(extras, /Voice receptionist/);
  assert.match(extras, /Business Email/);
  assert.match(en.voiceBody, /Not included in the website/);
  assert.match(en.voiceBody, /150 minutes/);
  assert.match(en.notIncluded.join(" "), /Instagram/);
  assert.equal(/receptionist/i.test(en.notIncluded.join(" ")), false);
});

test("fallback answers carpentry cabinet questions from that site’s services", () => {
  const facts = buildClientFacts(
    client({
      businessName: "Premium Carpentry Designs",
      slug: "premium-carpentry-designs",
      template: "carpentry",
      phone: "(602) 555-0186",
      city: "Phoenix, AZ",
      hours: "Mon–Fri 8:00am–5:00pm",
      tagline: "Premium Carpentry Designs",
      about: "Walnut cabinets, built-ins, and furniture made in the shop.",
      services: [
        "Custom cabinets",
        "Built-ins",
        "Furniture",
        "Trim and millwork",
        "Residential",
        "Commercial",
      ],
    }),
    "en",
  );
  assert.deepEqual(matchListedServices(facts, "do you do cabinets?"), [
    "Custom cabinets",
  ]);
  const reply = fallbackAnswer(facts, "do you do cabinets?");
  assert.match(reply, /Custom cabinets/i);
  assert.match(reply, /Premium Carpentry Designs/);
  assert.match(reply, /\(602\) 555-0186/);
  assert.equal(reply.includes(COMPANY.phone), false);
  assert.equal(/roof/i.test(reply), false);
  assert.equal(/unavailable/i.test(reply), false);
});

test("fallback answers landscaping lawn questions from that site’s services", () => {
  const facts = buildClientFacts(landscaping, "en");
  assert.deepEqual(matchListedServices(facts, "do you do lawns?"), ["Lawn care"]);
  const reply = fallbackAnswer(facts, "do you do lawns?");
  assert.match(reply, /Lawn care/i);
  assert.match(reply, /Palo Verde Yards/);
  assert.match(reply, /\(602\) 555-0168/);
  assert.equal(reply.includes(COMPANY.phone), false);
  assert.equal(/unavailable/i.test(reply), false);
});

test("fallback answers Hola Tax LLC questions and follows Spanish", () => {
  const en = buildClientFacts(holaTax, "en");
  const llc = fallbackAnswer(en, "do you do LLCs?");
  assert.match(llc, /LLC/i);
  assert.match(llc, /\(602\) 545-3308/);
  assert.equal(llc.includes(COMPANY.phone), false);
  assert.equal(/\$\d/.test(llc), false);

  const es = buildClientFacts(holaTax, "es");
  const spanish = fallbackAnswer(es, "¿Hacen LLCs?");
  assert.match(spanish, /LLC/i);
  assert.match(spanish, /Hola Tax/);
  assert.match(spanish, /llame|formulario/i);
});

test("fallback does not invent a missing service or a missing price", () => {
  const facts = buildClientFacts(landscaping, "en");
  const roof = fallbackAnswer(facts, "do you do roofing?");
  assert.equal(/roof replacement|roof repair/i.test(roof), false);
  assert.match(roof, /not on this site|does not list/i);
  assert.match(roof, /Lawn care/);

  const price = fallbackAnswer(facts, "how much for a lawn?");
  assert.equal(extractListedPrices(landscaping.about, ...landscaping.services).length, 0);
  assert.match(price, /does not list a price/i);
  assert.equal(/\$\d/.test(price), false);
  assert.match(price, /\(602\) 555-0168/);
});

test("a website-buy question on a client demo points to phoenixwebhost.com", () => {
  const facts = buildClientFacts(landscaping, "en");
  const reply = fallbackAnswer(facts, "I want to buy a website");
  assert.match(reply, /phoenixwebhost\.com/);
  assert.match(reply, /\$200/);
  assert.match(reply, /receptionist/i);
  assert.equal(reply.includes(COMPANY.phone), true);
});

test("Gateway mock success uses minimax-m3-free over OIDC and returns that reply", async () => {
  let called = 0;
  const result = await answerReceptionist({
    facts: buildClientFacts(landscaping, "en"),
    message: "do you do lawns?",
    oidcToken: "test-oidc",
    fetchImpl: async (url, init) => {
      called += 1;
      assert.equal(url, GATEWAY_URL);
      assert.equal(init?.headers?.Authorization, "Bearer test-oidc");
      const body = JSON.parse(String(init?.body || "{}")) as {
        model?: string;
        messages?: { role: string; content: string }[];
      };
      assert.equal(body.model, GATEWAY_MODEL);
      assert.equal(GATEWAY_MODEL.includes("-free"), true);
      assert.equal(/minimax-m3(?!-free)/.test(GATEWAY_MODEL), false);
      assert.ok(body.messages?.some((row) => row.role === "system"));
      return {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: "Yes — Palo Verde Yards lists lawn care on this site.",
              },
            },
          ],
        }),
      };
    },
  });
  assert.equal(called, 1);
  assert.equal(result.source, "gateway");
  assert.equal(result.reply, "Yes — Palo Verde Yards lists lawn care on this site.");
});

test("missing OIDC or a failed Gateway call falls back to site facts, never unavailable", async () => {
  const facts = buildClientFacts(holaTax, "en");
  const missing = await answerReceptionist({
    facts,
    message: "do you do LLCs?",
    oidcToken: "",
    fetchImpl: async () => {
      throw new Error("should not call Gateway without OIDC");
    },
  });
  assert.equal(missing.source, "facts");
  assert.match(missing.reply, /LLC/i);
  assert.equal(/unavailable/i.test(missing.reply), false);

  const failed = await answerReceptionist({
    facts,
    message: "do you do LLCs?",
    oidcToken: "stale-token",
    fetchImpl: async () => ({
      ok: false,
      status: 401,
      json: async () => ({ error: "unauthorized" }),
    }),
  });
  assert.equal(failed.source, "facts");
  assert.match(failed.reply, /LLC/i);
  assert.match(failed.reply, /\(602\) 545-3308/);
  assert.equal(/unavailable/i.test(failed.reply), false);

  const empty = await answerReceptionist({
    facts,
    message: "do you do LLCs?",
    oidcToken: "stale-token",
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Sorry, I am unavailable." } }],
      }),
    }),
  });
  assert.equal(empty.source, "facts");
  assert.equal(/unavailable/i.test(empty.reply), false);
  assert.match(empty.reply, /LLC/i);
});

test("studio facts use the public Phoenixwebhost phone and listed website prices", () => {
  const facts = buildStudioFacts("en");
  assert.equal(facts.phone, COMPANY.phone);
  assert.equal(facts.phone, "(480) 953-2393");
  assert.ok(facts.listedPrices.some((row) => row.includes(PRICING.setupLabel)));
  assert.match(facts.about, /include/i);
  assert.equal(/alex/i.test(facts.about), false);
  const hours = fallbackAnswer(facts, "what are your hours?");
  assert.match(hours, /does not list hours/i);
});
