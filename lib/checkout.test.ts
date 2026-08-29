import assert from "node:assert/strict";
import test from "node:test";
import { ADS_TIER_CONFLICT } from "./ads.ts";
import {
  BOOST_NOT_CONFIGURED,
  CHECKOUT_KINDS,
  checkoutLineItems,
  kindHasBoost,
  kindHasLoud,
  kindHasPlan,
  kindHasTraffic,
  resolveCheckoutKind,
  TRAFFIC_NOT_CONFIGURED,
  LOUD_NOT_CONFIGURED,
} from "./checkout-kind.ts";

test("checkout kinds include Traffic and Loud without dropping Local Boost", () => {
  assert.ok(CHECKOUT_KINDS.includes("plan_and_boost"));
  assert.ok(CHECKOUT_KINDS.includes("plan_and_traffic"));
  assert.ok(CHECKOUT_KINDS.includes("plan_and_loud"));
  assert.ok(CHECKOUT_KINDS.includes("traffic"));
  assert.ok(CHECKOUT_KINDS.includes("loud"));
  assert.equal(kindHasBoost("plan_and_boost_and_email"), true);
  assert.equal(kindHasTraffic("plan_and_traffic"), true);
  assert.equal(kindHasLoud("loud_and_email"), true);
  assert.equal(kindHasPlan("traffic"), false);
});

test("resolveCheckoutKind treats ads tiers as mutually exclusive", () => {
  assert.equal(resolveCheckoutKind({ includeBoost: true }), "plan_and_boost");
  assert.equal(resolveCheckoutKind({ includeTraffic: true }), "plan_and_traffic");
  assert.equal(resolveCheckoutKind({ includeLoud: true }), "plan_and_loud");
  assert.equal(
    resolveCheckoutKind({ includeTraffic: true, includeEmail: true }),
    "plan_and_traffic_and_email",
  );
  assert.equal(
    resolveCheckoutKind({ includeLoud: true, alreadyPaid: true }),
    "loud",
  );
  assert.equal(
    resolveCheckoutKind({ trafficOnly: true, includeEmail: true }),
    "traffic_and_email",
  );
  assert.throws(
    () => resolveCheckoutKind({ includeBoost: true, includeTraffic: true }),
    (error: unknown) =>
      error instanceof Error && error.message === ADS_TIER_CONFLICT,
  );
  assert.throws(
    () => resolveCheckoutKind({ includeTraffic: true, includeLoud: true }),
    (error: unknown) =>
      error instanceof Error && error.message === ADS_TIER_CONFLICT,
  );
});

test("Traffic and Loud line items are monthly only", () => {
  process.env.STRIPE_TRAFFIC_MONTHLY_PRICE_ID = "price_traffic_test";
  process.env.STRIPE_LOUD_MONTHLY_PRICE_ID = "price_loud_test";
  assert.deepEqual(checkoutLineItems("traffic"), [
    { price: "price_traffic_test", quantity: 1 },
  ]);
  assert.deepEqual(checkoutLineItems("loud"), [
    { price: "price_loud_test", quantity: 1 },
  ]);
  delete process.env.STRIPE_TRAFFIC_MONTHLY_PRICE_ID;
  assert.throws(
    () => checkoutLineItems("traffic"),
    (error: unknown) =>
      error instanceof Error && error.message === TRAFFIC_NOT_CONFIGURED,
  );
  delete process.env.STRIPE_LOUD_MONTHLY_PRICE_ID;
  assert.throws(
    () => checkoutLineItems("loud"),
    (error: unknown) =>
      error instanceof Error && error.message === LOUD_NOT_CONFIGURED,
  );
  assert.match(BOOST_NOT_CONFIGURED, /Local Boost/);
});
