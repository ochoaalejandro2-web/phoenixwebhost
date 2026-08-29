export const CHECKOUT_KINDS = [
  "plan",
  "plan_and_boost",
  "plan_and_email",
  "plan_and_boost_and_email",
  "plan_and_traffic",
  "plan_and_traffic_and_email",
  "plan_and_loud",
  "plan_and_loud_and_email",
  "boost",
  "email",
  "boost_and_email",
  "traffic",
  "traffic_and_email",
  "loud",
  "loud_and_email",
] as const;

export type CheckoutKind = (typeof CHECKOUT_KINDS)[number];

export const BOOST_NOT_CONFIGURED =
  "Local Boost is not connected yet. Uncheck the add-on to pay for the $200 launch and $69/month plan, or try again after the Boost prices are set.";

export const TRAFFIC_NOT_CONFIGURED =
  "Traffic is not connected yet. Pick Local Boost or the website only, or try again after the Traffic price is set.";

export const LOUD_NOT_CONFIGURED =
  "Loud is not connected yet. Pick Local Boost or Traffic, or try again after the Loud price is set.";

export const EMAIL_NOT_CONFIGURED =
  "Business Email is not connected yet. Uncheck the add-on to pay for the $200 launch and $69/month plan, or try again after the Business Email prices are set.";

export const STRIPE_NOT_CONFIGURED =
  "Stripe is not configured. Add STRIPE_SECRET_KEY, STRIPE_SETUP_PRICE_ID, and STRIPE_MONTHLY_PRICE_ID.";

export function isCheckoutKind(
  value: string | undefined | null,
): value is CheckoutKind {
  return CHECKOUT_KINDS.includes(value as CheckoutKind);
}

export function kindHasPlan(kind: CheckoutKind) {
  return kind === "plan" || kind.startsWith("plan_and_");
}

export function kindHasBoost(kind: CheckoutKind) {
  return kind === "boost" || kind.includes("boost");
}

export function kindHasTraffic(kind: CheckoutKind) {
  return kind === "traffic" || kind.includes("traffic");
}

export function kindHasLoud(kind: CheckoutKind) {
  return kind === "loud" || kind.includes("loud");
}

export function kindHasEmail(kind: CheckoutKind) {
  return kind === "email" || kind.includes("email");
}

export type CheckoutOptions = {
  includeBoost?: boolean;
  includeTraffic?: boolean;
  includeLoud?: boolean;
  includeEmail?: boolean;
  boostOnly?: boolean;
  trafficOnly?: boolean;
  loudOnly?: boolean;
  emailOnly?: boolean;
  alreadyPaid?: boolean;
};

export function resolveCheckoutKind(input: CheckoutOptions): CheckoutKind {
  const adsCount =
    Number(Boolean(input.boostOnly || input.includeBoost)) +
    Number(Boolean(input.trafficOnly || input.includeTraffic)) +
    Number(Boolean(input.loudOnly || input.includeLoud));
  if (adsCount > 1) {
    throw new Error(
      "Pick one ads level: Local Boost, Traffic, or Loud. They cannot be combined.",
    );
  }

  const boost = Boolean(input.boostOnly || input.includeBoost);
  const traffic = Boolean(input.trafficOnly || input.includeTraffic);
  const loud = Boolean(input.loudOnly || input.includeLoud);
  const email = Boolean(input.emailOnly || input.includeEmail);
  const addonOnly =
    Boolean(
      input.boostOnly ||
        input.trafficOnly ||
        input.loudOnly ||
        input.emailOnly,
    ) || (Boolean(input.alreadyPaid) && (boost || traffic || loud || email));

  if (addonOnly) {
    if (traffic && email) return "traffic_and_email";
    if (loud && email) return "loud_and_email";
    if (boost && email) return "boost_and_email";
    if (traffic) return "traffic";
    if (loud) return "loud";
    if (boost) return "boost";
    if (email) return "email";
  }
  if (traffic && email) return "plan_and_traffic_and_email";
  if (loud && email) return "plan_and_loud_and_email";
  if (boost && email) return "plan_and_boost_and_email";
  if (traffic) return "plan_and_traffic";
  if (loud) return "plan_and_loud";
  if (boost) return "plan_and_boost";
  if (email) return "plan_and_email";
  return "plan";
}

function requirePrice(id: string | undefined, message: string) {
  if (!id) throw new Error(message);
  return { price: id, quantity: 1 };
}

export function checkoutLineItems(kind: CheckoutKind) {
  const items: { price: string; quantity: number }[] = [];
  if (kindHasPlan(kind)) {
    items.push(
      requirePrice(process.env.STRIPE_SETUP_PRICE_ID, STRIPE_NOT_CONFIGURED),
      requirePrice(process.env.STRIPE_MONTHLY_PRICE_ID, STRIPE_NOT_CONFIGURED),
    );
  }
  if (kindHasBoost(kind)) {
    items.push(
      requirePrice(process.env.STRIPE_BOOST_SETUP_PRICE_ID, BOOST_NOT_CONFIGURED),
      requirePrice(
        process.env.STRIPE_BOOST_MONTHLY_PRICE_ID,
        BOOST_NOT_CONFIGURED,
      ),
    );
  }
  if (kindHasTraffic(kind)) {
    items.push(
      requirePrice(
        process.env.STRIPE_TRAFFIC_MONTHLY_PRICE_ID,
        TRAFFIC_NOT_CONFIGURED,
      ),
    );
  }
  if (kindHasLoud(kind)) {
    items.push(
      requirePrice(
        process.env.STRIPE_LOUD_MONTHLY_PRICE_ID,
        LOUD_NOT_CONFIGURED,
      ),
    );
  }
  if (kindHasEmail(kind)) {
    items.push(
      requirePrice(process.env.STRIPE_EMAIL_SETUP_PRICE_ID, EMAIL_NOT_CONFIGURED),
      requirePrice(
        process.env.STRIPE_EMAIL_MONTHLY_PRICE_ID,
        EMAIL_NOT_CONFIGURED,
      ),
    );
  }
  return items;
}
