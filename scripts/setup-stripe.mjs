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

const bookProduct = await stripe.products.create({
  name: "Phoenixwebhost — Book a job",
  description:
    "Optional add-on: $49 setup + $19/month for a booking form on the client site. Not the included AI receptionist.",
});
const bookSetup = await stripe.prices.create({
  product: bookProduct.id,
  currency: "usd",
  unit_amount: 4900,
});
const bookMonth = await stripe.prices.create({
  product: bookProduct.id,
  currency: "usd",
  unit_amount: 1900,
  recurring: { interval: "month" },
});

const missedProduct = await stripe.products.create({
  name: "Phoenixwebhost — Missed-call text-back",
  description:
    "Optional add-on: $49 setup + $29/month. We set this up when you buy. Not live on demos.",
});
const missedSetup = await stripe.prices.create({
  product: missedProduct.id,
  currency: "usd",
  unit_amount: 4900,
});
const missedMonth = await stripe.prices.create({
  product: missedProduct.id,
  currency: "usd",
  unit_amount: 2900,
  recurring: { interval: "month" },
});

const reviewProduct = await stripe.products.create({
  name: "Phoenixwebhost — Review texts",
  description:
    "Optional add-on: $29/month for a review text after the job. Does not replace Local Boost.",
});
const reviewMonth = await stripe.prices.create({
  product: reviewProduct.id,
  currency: "usd",
  unit_amount: 2900,
  recurring: { interval: "month" },
});

const voiceProduct = await stripe.products.create({
  name: "Phoenixwebhost — Voice receptionist",
  description:
    "Optional add-on: $99 setup + $79/month, 150 minutes included, extra minutes $0.50. Not the included website chat.",
});
const voiceSetup = await stripe.prices.create({
  product: voiceProduct.id,
  currency: "usd",
  unit_amount: 9900,
});
const voiceMonth = await stripe.prices.create({
  product: voiceProduct.id,
  currency: "usd",
  unit_amount: 7900,
  recurring: { interval: "month" },
});

const domainProduct = await stripe.products.create({
  name: "Phoenixwebhost — Domain (.com first year)",
  description:
    "Optional add-on: about $20 for the first year of a .com. We register it in the customer’s name. They keep the login. Skip if they already have a domain.",
});
const domainYear = await stripe.prices.create({
  product: domainProduct.id,
  currency: "usd",
  unit_amount: 2000,
});

console.log("");
console.log("Add these to .env.local and to Vercel project env:");
console.log(`STRIPE_SETUP_PRICE_ID=${setupPrice.id}`);
console.log(`STRIPE_MONTHLY_PRICE_ID=${monthPrice.id}`);
console.log(`STRIPE_TRAFFIC_MONTHLY_PRICE_ID=${trafficPrice.id}`);
console.log(`STRIPE_LOUD_MONTHLY_PRICE_ID=${loudPrice.id}`);
console.log(`STRIPE_BOOK_SETUP_PRICE_ID=${bookSetup.id}`);
console.log(`STRIPE_BOOK_MONTHLY_PRICE_ID=${bookMonth.id}`);
console.log(`STRIPE_MISSED_SETUP_PRICE_ID=${missedSetup.id}`);
console.log(`STRIPE_MISSED_MONTHLY_PRICE_ID=${missedMonth.id}`);
console.log(`STRIPE_REVIEW_MONTHLY_PRICE_ID=${reviewMonth.id}`);
console.log(`STRIPE_VOICE_SETUP_PRICE_ID=${voiceSetup.id}`);
console.log(`STRIPE_VOICE_MONTHLY_PRICE_ID=${voiceMonth.id}`);
console.log(`STRIPE_DOMAIN_YEARLY_PRICE_ID=${domainYear.id}`);
console.log("");
console.log(
  "Local Boost still uses STRIPE_BOOST_SETUP_PRICE_ID and STRIPE_BOOST_MONTHLY_PRICE_ID.",
);
console.log(
  "Business Email still uses STRIPE_EMAIL_SETUP_PRICE_ID and STRIPE_EMAIL_MONTHLY_PRICE_ID.",
);
console.log(
  "Production still needs live Price IDs set on Vercel. Do not invent fake live keys.",
);
console.log("");
