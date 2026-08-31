import { getStripe } from "./stripe.ts";

export const EXTRA_PRICE_ENV_KEYS = [
  "STRIPE_BOOK_SETUP_PRICE_ID",
  "STRIPE_BOOK_MONTHLY_PRICE_ID",
  "STRIPE_MISSED_SETUP_PRICE_ID",
  "STRIPE_MISSED_MONTHLY_PRICE_ID",
  "STRIPE_REVIEW_MONTHLY_PRICE_ID",
  "STRIPE_VOICE_SETUP_PRICE_ID",
  "STRIPE_VOICE_MONTHLY_PRICE_ID",
  "STRIPE_DOMAIN_YEARLY_PRICE_ID",
] as const;

export type ExtraPriceEnvKey = (typeof EXTRA_PRICE_ENV_KEYS)[number];
export type StripeExtraPriceIds = Record<ExtraPriceEnvKey, string>;

const SKU_META = "phoenixwebhost_sku";

const EXTRA_PRODUCTS: {
  sku: string;
  name: string;
  description: string;
  prices: {
    env: ExtraPriceEnvKey;
    unitAmount: number;
    recurring: boolean;
  }[];
}[] = [
  {
    sku: "book_a_job",
    name: "Phoenixwebhost — Book a job",
    description:
      "Optional add-on: $49 setup + $19/month for a booking form on the client site. Not the included AI receptionist.",
    prices: [
      { env: "STRIPE_BOOK_SETUP_PRICE_ID", unitAmount: 4900, recurring: false },
      { env: "STRIPE_BOOK_MONTHLY_PRICE_ID", unitAmount: 1900, recurring: true },
    ],
  },
  {
    sku: "missed_call_textback",
    name: "Phoenixwebhost — Missed-call text-back",
    description:
      "Optional add-on: $49 setup + $29/month. We set this up when you buy. Not live on demos.",
    prices: [
      { env: "STRIPE_MISSED_SETUP_PRICE_ID", unitAmount: 4900, recurring: false },
      {
        env: "STRIPE_MISSED_MONTHLY_PRICE_ID",
        unitAmount: 2900,
        recurring: true,
      },
    ],
  },
  {
    sku: "review_texts",
    name: "Phoenixwebhost — Review texts",
    description:
      "Optional add-on: $29/month for a review text after the job. Does not replace Local Boost.",
    prices: [
      {
        env: "STRIPE_REVIEW_MONTHLY_PRICE_ID",
        unitAmount: 2900,
        recurring: true,
      },
    ],
  },
  {
    sku: "voice_receptionist",
    name: "Phoenixwebhost — Voice receptionist",
    description:
      "Optional add-on: $99 setup + $79/month, 150 minutes included, extra minutes $0.50. Not the included website chat.",
    prices: [
      { env: "STRIPE_VOICE_SETUP_PRICE_ID", unitAmount: 9900, recurring: false },
      { env: "STRIPE_VOICE_MONTHLY_PRICE_ID", unitAmount: 7900, recurring: true },
    ],
  },
  {
    sku: "domain_com",
    name: "Phoenixwebhost — Domain (.com first year)",
    description:
      "Optional add-on: about $20 for the first year of a .com. We register it in the customer’s name. They keep the login. Skip if they already have a domain.",
    prices: [
      {
        env: "STRIPE_DOMAIN_YEARLY_PRICE_ID",
        unitAmount: 2000,
        recurring: false,
      },
    ],
  },
];

export function readExtraPriceIdsFromEnv(): Partial<StripeExtraPriceIds> {
  const ids: Partial<StripeExtraPriceIds> = {};
  for (const key of EXTRA_PRICE_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value) ids[key] = value;
  }
  return ids;
}

export function extraPricesComplete(
  ids: Partial<StripeExtraPriceIds> | null | undefined,
): ids is StripeExtraPriceIds {
  return Boolean(ids && EXTRA_PRICE_ENV_KEYS.every((key) => ids[key]));
}

export function applyExtraPriceIdsToEnv(
  ids: Partial<StripeExtraPriceIds> | null | undefined,
) {
  if (!ids) return;
  for (const key of EXTRA_PRICE_ENV_KEYS) {
    const value = ids[key]?.trim();
    if (value && !process.env[key]) process.env[key] = value;
  }
}

export function mergeExtraPriceIds(
  ...parts: Array<Partial<StripeExtraPriceIds> | null | undefined>
): Partial<StripeExtraPriceIds> {
  const merged: Partial<StripeExtraPriceIds> = {};
  for (const part of parts) {
    if (!part) continue;
    for (const key of EXTRA_PRICE_ENV_KEYS) {
      const value = part[key]?.trim();
      if (value) merged[key] = value;
    }
  }
  return merged;
}

export function shouldCreateLiveExtraPrices() {
  return (
    process.env.VERCEL_ENV === "production" &&
    (process.env.STRIPE_SECRET_KEY || "").startsWith("sk_live_")
  );
}

type StripePriceLike = {
  id: string;
  unit_amount: number | null;
  recurring: { interval: string } | null;
  active?: boolean;
};

type StripeProductLike = {
  id: string;
  name: string;
  metadata?: Record<string, string>;
};

export async function resolveExtraPricesFromStripe(stripe: {
  products: {
    list: (params: {
      limit: number;
    }) => Promise<{ data: StripeProductLike[] }>;
    create: (params: {
      name: string;
      description: string;
      metadata: Record<string, string>;
    }) => Promise<StripeProductLike>;
  };
  prices: {
    list: (params: {
      product: string;
      limit: number;
    }) => Promise<{ data: StripePriceLike[] }>;
    create: (params: {
      product: string;
      currency: string;
      unit_amount: number;
      recurring?: { interval: "month" };
      metadata: Record<string, string>;
    }) => Promise<StripePriceLike>;
  };
}): Promise<StripeExtraPriceIds> {
  const products = (await stripe.products.list({ limit: 100 })).data;

  const ids: Partial<StripeExtraPriceIds> = {};
  for (const spec of EXTRA_PRODUCTS) {
    let product =
      products.find((item) => item.metadata?.[SKU_META] === spec.sku) ||
      products.find((item) => item.name === spec.name);
    if (!product) {
      product = await stripe.products.create({
        name: spec.name,
        description: spec.description,
        metadata: { [SKU_META]: spec.sku },
      });
      products.push(product);
    }
    const existing = await stripe.prices.list({
      product: product.id,
      limit: 100,
    });
    for (const priceSpec of spec.prices) {
      const match = existing.data.find(
        (price) =>
          price.active !== false &&
          price.unit_amount === priceSpec.unitAmount &&
          (priceSpec.recurring
            ? price.recurring?.interval === "month"
            : !price.recurring),
      );
      if (match) {
        ids[priceSpec.env] = match.id;
        continue;
      }
      const created = await stripe.prices.create({
        product: product.id,
        currency: "usd",
        unit_amount: priceSpec.unitAmount,
        recurring: priceSpec.recurring ? { interval: "month" } : undefined,
        metadata: { [SKU_META]: spec.sku, env: priceSpec.env },
      });
      ids[priceSpec.env] = created.id;
    }
  }
  if (!extraPricesComplete(ids)) {
    throw new Error("Stripe extra prices were not fully created.");
  }
  return ids;
}

let ensureChain: Promise<Partial<StripeExtraPriceIds>> | null = null;

export async function ensureLiveExtraPrices(): Promise<
  Partial<StripeExtraPriceIds>
> {
  if (ensureChain) return ensureChain;
  ensureChain = (async () => {
    const fromEnv = readExtraPriceIdsFromEnv();
    if (extraPricesComplete(fromEnv)) return fromEnv;

    const { getState, updateState } = await import("./store.ts");
    const state = await getState();
    const merged = mergeExtraPriceIds(state.stripeExtraPrices, fromEnv);
    applyExtraPriceIdsToEnv(merged);
    if (extraPricesComplete(merged)) return merged;

    if (!shouldCreateLiveExtraPrices()) return merged;

    const stripe = getStripe();
    if (!stripe) return merged;

    const created = await resolveExtraPricesFromStripe(
      stripe as unknown as Parameters<typeof resolveExtraPricesFromStripe>[0],
    );
    const next = mergeExtraPriceIds(merged, created);
    applyExtraPriceIdsToEnv(next);
    await updateState((current) => {
      current.stripeExtraPrices = mergeExtraPriceIds(
        current.stripeExtraPrices,
        next,
      );
    });
    console.info(
      "[stripe-extras] live Price IDs ready",
      EXTRA_PRICE_ENV_KEYS.filter((key) => next[key]).join(","),
    );
    await publishExtraPriceIdsToVercel(next);
    return next;
  })().finally(() => {
    ensureChain = null;
  });
  return ensureChain;
}

export async function publishExtraPriceIdsToVercel(
  ids: Partial<StripeExtraPriceIds>,
) {
  const token = (
    process.env.VERCEL_TOKEN ||
    process.env.VERCEL_ACCESS_TOKEN ||
    process.env.VERCEL_API_TOKEN ||
    ""
  ).trim();
  if (!token) {
    console.info(
      "[stripe-extras] no Vercel API token in project env; Price IDs stored in app state",
    );
    return { ok: false, reason: "no_token" as const };
  }
  const projectId =
    process.env.VERCEL_PROJECT_ID || "prj_TzgaVzu7EcZREyG99BBD3gBMfQ1a";
  const teamId =
    process.env.VERCEL_ORG_ID || "team_Hm1UrGtAbwgDJippC3URsIoy";
  const payload = EXTRA_PRICE_ENV_KEYS.filter((key) => ids[key]).map((key) => ({
    key,
    value: ids[key],
    type: "plain",
    target: ["production"],
    comment: "Phoenixwebhost extras Price ID created on the live Stripe account",
  }));
  if (!payload.length) return { ok: false, reason: "empty" as const };
  const url = `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}&upsert=true`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error("[stripe-extras] Vercel env write failed", res.status);
    return { ok: false, reason: "http" as const, status: res.status };
  }
  console.info("[stripe-extras] wrote Price ID env vars to Vercel production");
  return { ok: true as const };
}
