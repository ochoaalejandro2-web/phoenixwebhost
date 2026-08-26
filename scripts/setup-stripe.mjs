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

console.log("");
console.log("Add these to .env.local and to Vercel project env:");
console.log(`STRIPE_SETUP_PRICE_ID=${setupPrice.id}`);
console.log(`STRIPE_MONTHLY_PRICE_ID=${monthPrice.id}`);
console.log("");
