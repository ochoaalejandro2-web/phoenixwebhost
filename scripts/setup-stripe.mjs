import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Set STRIPE_SECRET_KEY in .env.local, then run:");
  console.error("  node --env-file=.env.local scripts/setup-stripe.mjs");
  process.exit(1);
}

const stripe = new Stripe(key);

const setupProduct = await stripe.products.create({
  name: "Phoenixwebhost — website launch",
  description: "One-time $200 to launch a simple small-business website.",
});
const setupPrice = await stripe.prices.create({
  product: setupProduct.id,
  currency: "usd",
  unit_amount: 20000,
});

const monthProduct = await stripe.products.create({
  name: "Phoenixwebhost — hosting and care",
  description:
    "$69 per month to keep the site live, with up to 30 minutes of small edits (or 2 small requests).",
});
const monthPrice = await stripe.prices.create({
  product: monthProduct.id,
  currency: "usd",
  unit_amount: 6900,
  recurring: { interval: "month" },
});

const trafficProduct = await stripe.products.create({
  name: "Phoenixwebhost — Traffic",
  description:
    "Managed ads add-on: $199 per month for a bigger Google ad than Local Boost. More people can see the business. Not a ranking promise.",
});
const trafficPrice = await stripe.prices.create({
  product: trafficProduct.id,
  currency: "usd",
  unit_amount: 19900,
  recurring: { interval: "month" },
});

const loudProduct = await stripe.products.create({
  name: "Phoenixwebhost — Loud",
  description:
    "Managed ads add-on: $349 per month for the aggressive ads package. Louder ads, more people seeing the business. Not a ranking promise.",
});
const loudPrice = await stripe.prices.create({
  product: loudProduct.id,
  currency: "usd",
  unit_amount: 34900,
  recurring: { interval: "month" },
});

console.log("");
console.log("Add these to .env.local and to Vercel project env:");
console.log(`STRIPE_SETUP_PRICE_ID=${setupPrice.id}`);
console.log(`STRIPE_MONTHLY_PRICE_ID=${monthPrice.id}`);
console.log(`STRIPE_TRAFFIC_MONTHLY_PRICE_ID=${trafficPrice.id}`);
console.log(`STRIPE_LOUD_MONTHLY_PRICE_ID=${loudPrice.id}`);
console.log("");
console.log(
  "Local Boost still uses STRIPE_BOOST_SETUP_PRICE_ID and STRIPE_BOOST_MONTHLY_PRICE_ID.",
);
console.log(
  "Production still needs live Traffic and Loud Price IDs set on Vercel. Do not invent fake live keys.",
);
console.log("");
