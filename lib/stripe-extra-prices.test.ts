import assert from "node:assert/strict";
import test from "node:test";
import {
  applyExtraPriceIdsToEnv,
  extraPricesComplete,
  mergeExtraPriceIds,
  readExtraPriceIdsFromEnv,
  resolveExtraPricesFromStripe,
  shouldCreateLiveExtraPrices,
  type ExtraPriceEnvKey,
} from "./stripe-extra-prices.ts";

const KEYS: ExtraPriceEnvKey[] = [
  "STRIPE_BOOK_SETUP_PRICE_ID",
  "STRIPE_BOOK_MONTHLY_PRICE_ID",
  "STRIPE_MISSED_SETUP_PRICE_ID",
  "STRIPE_MISSED_MONTHLY_PRICE_ID",
  "STRIPE_REVIEW_MONTHLY_PRICE_ID",
  "STRIPE_VOICE_SETUP_PRICE_ID",
  "STRIPE_VOICE_MONTHLY_PRICE_ID",
];

function clearExtraEnv() {
  for (const key of KEYS) delete process.env[key];
}

test("extra price helpers merge, apply, and refuse incomplete sets", () => {
  clearExtraEnv();
  const stored = {
    STRIPE_BOOK_SETUP_PRICE_ID: "price_book_setup",
    STRIPE_BOOK_MONTHLY_PRICE_ID: "price_book_month",
  };
  const merged = mergeExtraPriceIds(stored, {
    STRIPE_REVIEW_MONTHLY_PRICE_ID: "price_review",
  });
  assert.equal(extraPricesComplete(merged), false);
  applyExtraPriceIdsToEnv(merged);
  assert.equal(process.env.STRIPE_BOOK_SETUP_PRICE_ID, "price_book_setup");
  process.env.STRIPE_BOOK_SETUP_PRICE_ID = "price_from_env";
  applyExtraPriceIdsToEnv({ STRIPE_BOOK_SETUP_PRICE_ID: "price_should_not_win" });
  assert.equal(process.env.STRIPE_BOOK_SETUP_PRICE_ID, "price_from_env");
  assert.equal(readExtraPriceIdsFromEnv().STRIPE_BOOK_MONTHLY_PRICE_ID, "price_book_month");
  clearExtraEnv();
});

test("live extra-price create is production + live-key only", () => {
  const prevEnv = process.env.VERCEL_ENV;
  const prevKey = process.env.STRIPE_SECRET_KEY;
  process.env.VERCEL_ENV = "production";
  process.env.STRIPE_SECRET_KEY = "sk_test_not_the_live_account";
  assert.equal(shouldCreateLiveExtraPrices(), false);
  process.env.STRIPE_SECRET_KEY = "sk_live_phoenixwebhost_only";
  assert.equal(shouldCreateLiveExtraPrices(), true);
  process.env.VERCEL_ENV = "preview";
  assert.equal(shouldCreateLiveExtraPrices(), false);
  process.env.VERCEL_ENV = prevEnv;
  if (prevKey === undefined) delete process.env.STRIPE_SECRET_KEY;
  else process.env.STRIPE_SECRET_KEY = prevKey;
});

test("resolveExtraPricesFromStripe reuses matching products and creates only missing extras", async () => {
  const createdProducts: string[] = [];
  const createdPrices: string[] = [];
  const stripe = {
    products: {
      async list() {
        return {
          data: [
            {
              id: "prod_book",
              name: "Phoenixwebhost — Book a job",
              metadata: { phoenixwebhost_sku: "book_a_job" },
            },
          ],
        };
      },
      async create(params: { name: string }) {
        createdProducts.push(params.name);
        return {
          id: `prod_${createdProducts.length}`,
          name: params.name,
          metadata: {},
        };
      },
    },
    prices: {
      async list(params: { product: string }) {
        if (params.product === "prod_book") {
          return {
            data: [
              { id: "price_book_setup_live", unit_amount: 4900, recurring: null },
              {
                id: "price_book_month_live",
                unit_amount: 1900,
                recurring: { interval: "month" },
              },
            ],
          };
        }
        return { data: [] };
      },
      async create(params: { product: string; unit_amount: number }) {
        const id = `price_new_${params.product}_${params.unit_amount}`;
        createdPrices.push(id);
        return { id, unit_amount: params.unit_amount, recurring: null };
      },
    },
  };

  const ids = await resolveExtraPricesFromStripe(stripe);
  assert.equal(ids.STRIPE_BOOK_SETUP_PRICE_ID, "price_book_setup_live");
  assert.equal(ids.STRIPE_BOOK_MONTHLY_PRICE_ID, "price_book_month_live");
  assert.equal(createdProducts.includes("Phoenixwebhost — website launch"), false);
  assert.ok(createdProducts.includes("Phoenixwebhost — Missed-call text-back"));
  assert.ok(createdProducts.includes("Phoenixwebhost — Review texts"));
  assert.ok(createdProducts.includes("Phoenixwebhost — Voice receptionist"));
  assert.ok(ids.STRIPE_REVIEW_MONTHLY_PRICE_ID.startsWith("price_new_"));
  assert.equal(extraPricesComplete(ids), true);
});
