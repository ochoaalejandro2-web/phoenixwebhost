import assert from "node:assert/strict";
import test from "node:test";
import { PRICING } from "./config.ts";
import {
  applyDemoPatch,
  buildClientFromLead,
  DEMO_SAMPLE_PHONE,
  demoPath,
  demoServices,
  demoUrl,
  emptyDemoTweaks,
  interpretDemoChat,
  isPreviewClient,
  parseTemplateId,
  previewLeadId,
  siteHomeHref,
} from "./demo.ts";
import { SHOP_PHOTOS } from "./shop-content.ts";
import type { Lead, TemplateId } from "./types.ts";

function sampleLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_demo_test",
    name: "Alex Rivera",
    businessName: "Rivera Roofing",
    email: "alex@riveraroofing.example",
    phone: "(480) 555-0100",
    city: "Mesa, AZ",
    message: "Roofs that last through monsoon season.",
    locale: "en",
    template: "contractor",
    wantsLocalBoost: false,
    wantsTraffic: false,
    wantsLoud: false,
    wantsBusinessEmail: false,
    purchased: false,
    clientId: null,
    demo: emptyDemoTweaks(),
    createdAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

test("demo URL is a preview path, not a paid /s/ site", () => {
  assert.equal(demoPath("lead_abc"), "/demo/lead_abc");
  assert.equal(demoUrl("lead_abc").endsWith("/demo/lead_abc"), true);
  assert.equal(demoUrl("lead_abc").includes("/s/"), false);
});

test("trade picker only accepts the eight templates, including carpentry, handyman, and tax", () => {
  assert.equal(parseTemplateId("contractor"), "contractor");
  assert.equal(parseTemplateId("handyman"), "handyman");
  assert.equal(parseTemplateId("carpentry"), "carpentry");
  assert.equal(parseTemplateId("tax"), "tax");
  assert.equal(parseTemplateId("salon"), "salon");
  assert.equal(parseTemplateId("hola-tax-service"), null);
  assert.equal(parseTemplateId("custom"), null);
  assert.deepEqual(demoServices("handyman"), [
    "Home repairs",
    "Drywall",
    "Interior painting",
    "Fixture install",
    "Odd jobs",
    "Punch-list fixes",
  ]);
  assert.equal(demoServices("handyman").length, 6);
  assert.deepEqual(demoServices("carpentry"), [
    "Custom cabinets",
    "Built-ins",
    "Furniture",
    "Trim and millwork",
    "Residential",
    "Commercial",
  ]);
  assert.equal(demoServices("carpentry").length, 6);
  assert.deepEqual(demoServices("tax"), [
    "Personal tax preparation",
    "Small-business tax preparation",
    "ITIN applications",
    "Bookkeeping",
    "Year-round tax support",
    "Tax planning",
  ]);
  assert.equal(demoServices("tax").length, 6);
  assert.equal(demoServices("salon").length, 6);
  assert.equal(demoServices("landscaping").length, 6);
  assert.equal(
    demoServices("tax").some((row) => /llc/i.test(row)),
    false,
  );
});

test("preview client fills the chosen template and stays off the paid URL", () => {
  const client = buildClientFromLead(sampleLead(), [], { preview: true });
  assert.equal(client.id, "demo_lead_demo_test");
  assert.equal(isPreviewClient(client), true);
  assert.equal(previewLeadId(client), "lead_demo_test");
  assert.equal(siteHomeHref(client), "/demo/lead_demo_test");
  assert.equal(client.template, "contractor");
  assert.equal(client.businessName, "Rivera Roofing");
  assert.match(client.tagline, /monsoon/);
  assert.match(client.about, /monsoon/);
  assert.equal(client.siteStatus, "live");
  assert.equal(client.paymentStatus, "unpaid");
  assert.deepEqual(client.services, demoServices("contractor"));
  assert.match(client.hours, /Mon/);
  assert.match(client.address, /Broadway/);
  assert.match(client.phone, /480/);
});

test("paid client from a demo keeps the selected template, not a default professional", () => {
  const client = buildClientFromLead(
    sampleLead({ template: "salon" }),
    ["casa-luna-salon"],
  );
  assert.equal(client.template, "salon");
  assert.equal(isPreviewClient(client), false);
  assert.equal(client.siteStatus, "paused");
  assert.equal(client.slug, "rivera-roofing");
});

test("capped chat maps logo, color, sentence, and one extra page", () => {
  assert.deepEqual(interpretDemoChat('logo to "Desert Peak"'), {
    kind: "logo",
    logoText: "Desert Peak",
  });
  assert.deepEqual(interpretDemoChat("color navy"), {
    kind: "color",
    accent: "navy",
  });
  assert.equal(interpretDemoChat("add sentence Licensed in Arizona").kind, "sentence");
  const page = interpretDemoChat("add a page called Warranty");
  assert.equal(page.kind, "page");
  if (page.kind === "page") {
    assert.equal(page.title, "Warranty");
    assert.match(page.body, /\$75–\$150/);
  }
  assert.equal(interpretDemoChat("unlimited AI redesign please").kind, "quote");
});

test("demo tweaks stay capped to one extra page and optional logo text", () => {
  const next = applyDemoPatch(emptyDemoTweaks(), {
    logoText: "RR",
    accent: "clay",
    extraSentence: "Licensed in Arizona.",
    extraPageTitle: "Warranty",
    extraPageBody: "Written warranties on every roof.",
  });
  assert.equal(next.logoText, "RR");
  assert.equal(next.accent, "clay");
  assert.equal(next.extraPageTitle, "Warranty");
  const preview = buildClientFromLead(
    sampleLead({ demo: next }),
    [],
    { preview: true },
  );
  assert.equal(preview.logoText, "RR");
  assert.match(preview.about, /Licensed in Arizona/);
});

test("plan price is still $200 launch + $69/month, with no $100 public down payment", () => {
  assert.equal(PRICING.setupCents, 20_000);
  assert.equal(PRICING.monthlyCents, 6_900);
  assert.equal(PRICING.setupLabel, "$200");
  assert.equal(PRICING.monthlyLabel, "$69");
  assert.equal("downCents" in PRICING, false);
  assert.equal(PRICING.logoMin, 100);
  assert.equal(PRICING.logoMax, 300);
  assert.equal(PRICING.boostSetupCents, 9_900);
  assert.equal(PRICING.boostMonthlyCents, 7_900);
  assert.equal(PRICING.trafficMonthlyCents, 19_900);
  assert.equal(PRICING.loudMonthlyCents, 34_900);
  assert.equal(PRICING.emailSetupCents, 4_900);
});

test("empty phone and city still fill a Phoenix-area layout for the preview", () => {
  const client = buildClientFromLead(
    sampleLead({ phone: "", city: "" }),
    [],
    { preview: true },
  );
  assert.equal(client.phone, DEMO_SAMPLE_PHONE);
  assert.match(client.city, /Phoenix/);
  assert.match(client.address, /AZ/);
  assert.ok(client.hours.length > 0);
});

test("each trade has a local hero photo and a four-photo gallery", () => {
  const trades: TemplateId[] = [
    "contractor",
    "handyman",
    "carpentry",
    "salon",
    "restaurant",
    "professional",
    "landscaping",
    "tax",
  ];
  for (const id of trades) {
    assert.match(SHOP_PHOTOS[id].hero.src, new RegExp(`/templates/${id}/`));
    assert.equal(SHOP_PHOTOS[id].gallery.length, 4);
  }
});

