import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_SAMPLE_PHONE } from "./demo.ts";
import {
  buildWalkInPreviewClient,
  otherTypeNote,
  parseQuotedPicks,
  parseWalkInType,
  previewHref,
  quotedMessageNote,
  sanitizeWalkInKind,
  sanitizeWalkInName,
  walkInRequestHref,
  walkInServices,
  walkInTemplate,
} from "./walk-in-preview.ts";

test("walk-in types reuse existing templates, including cleaning and shop", () => {
  assert.equal(parseWalkInType("salon"), "salon");
  assert.equal(parseWalkInType("CLEANING"), "cleaning");
  assert.equal(parseWalkInType("barber"), null);
  assert.equal(walkInTemplate("salon"), "salon");
  assert.equal(walkInTemplate("restaurant"), "restaurant");
  assert.equal(walkInTemplate("handyman"), "handyman");
  assert.equal(walkInTemplate("contractor"), "contractor");
  assert.equal(walkInTemplate("cleaning"), "cleaning");
  assert.equal(walkInTemplate("shop"), "professional");
  assert.equal(parseWalkInType("other"), "other");
  assert.equal(walkInTemplate("other"), "professional");
});

test("walk-in preview puts the prospect name and a sample phone on the template", () => {
  const client = buildWalkInPreviewClient({
    businessName: "  Reggie’s Barber Shop  ",
    type: "salon",
    locale: "en",
  });
  assert.equal(client.businessName, "Reggie’s Barber Shop");
  assert.equal(client.logoText, "Reggie’s Barber Shop");
  assert.equal(client.phone, DEMO_SAMPLE_PHONE);
  assert.equal(client.template, "salon");
  assert.equal(client.id.startsWith("demo_"), true);
  assert.match(client.about, /Reggie’s Barber Shop/);
  assert.deepEqual(client.services.slice(0, 2), ["Haircuts", "Color"]);
});

test("cleaning and general shop reuse layouts but swap the service list", () => {
  assert.ok(walkInServices("cleaning").includes("Recurring house cleaning"));
  assert.equal(walkInServices("cleaning").includes("Drywall"), false);
  assert.ok(walkInServices("shop").includes("In-store pickup"));
  const cleaning = buildWalkInPreviewClient({
    businessName: "Sparkle Crew",
    type: "cleaning",
    locale: "es",
  });
  assert.equal(cleaning.template, "cleaning");
  assert.match(cleaning.about, /Sparkle Crew/);
  assert.match(cleaning.about, /limpieza/);
});

test("preview and request links carry the business name and add-ons", () => {
  assert.equal(
    previewHref("en", { name: "Reggie’s Barber Shop", type: "salon" }),
    "/preview?name=Reggie%E2%80%99s+Barber+Shop&type=salon",
  );
  assert.equal(
    walkInRequestHref("es", {
      businessName: "Tacos Luna",
      type: "restaurant",
      ads: "traffic",
      extras: ["book", "missed"],
      quoted: ["ordering"],
    }),
    "/es/request?business=Tacos+Luna&template=restaurant&ads=traffic&extra=book%2Cmissed&quoted=ordering",
  );
  assert.deepEqual(parseQuotedPicks("ordering,photos"), ["ordering", "photos"]);
  assert.match(quotedMessageNote(["ordering"], "en"), /pickup ordering/);
  assert.equal(sanitizeWalkInName("  a   b  "), "a b");
});

test("other type uses the general shop template and passes the typed label to the lead", () => {
  assert.equal(sanitizeWalkInKind("  yoga studio  "), "yoga studio");
  const client = buildWalkInPreviewClient({
    businessName: "Desert Flow",
    type: "other",
    locale: "en",
    kind: "yoga studio",
  });
  assert.equal(client.template, "professional");
  assert.match(client.about, /yoga studio/);
  assert.ok(client.services.includes("In-store pickup"));
  assert.equal(
    previewHref("en", {
      name: "Desert Flow",
      type: "other",
      kind: "yoga studio",
    }),
    "/preview?name=Desert+Flow&type=other&kind=yoga+studio",
  );
  assert.equal(
    walkInRequestHref("en", {
      businessName: "Desert Flow",
      type: "other",
      kind: "yoga studio",
    }),
    "/request?business=Desert+Flow&template=professional&other=yoga+studio",
  );
  assert.match(otherTypeNote("yoga studio", "en"), /yoga studio/);
  assert.match(otherTypeNote("estudio de yoga", "es"), /estudio de yoga/);
  assert.equal(otherTypeNote("  ", "en"), "");
});
