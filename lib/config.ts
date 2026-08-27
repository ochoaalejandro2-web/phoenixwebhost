export const COMPANY = {
  legalName: "Phoenixwebhost Inc.",
  shortName: "Phoenixwebhost",
  owner: "Alex Ochoa",
  city: "Phoenix, AZ",
  email: "hello@phoenixwebhost.com",
  phone: "(602) 555-0140",
  domain: "phoenixwebhost.com",
} as const;

export const PRICING = {
  setupCents: 20_000,
  monthlyCents: 6_900,
  setupLabel: "$200",
  monthlyLabel: "$69",
  boostSetupCents: 9_900,
  boostMonthlyCents: 7_900,
  boostSetupLabel: "$99",
  boostMonthlyLabel: "$79",
  emailSetupCents: 4_900,
  emailMonthlyCents: 1_900,
  emailSetupLabel: "$49",
  emailMonthlyLabel: "$19",
  extraPageMin: 75,
  extraPageMax: 150,
  logoMin: 100,
  logoMax: 300,
  includedEditMinutes: 30,
  includedEditRequests: 2,
  unpaidGraceDays: 2,
  filesKeptDays: 30,
} as const;

export const TEMPLATES: {
  id: import("./types").TemplateId;
  name: string;
  nameEs: string;
  blurb: string;
  blurbEs: string;
}[] = [
  {
    id: "contractor",
    name: "Contractor & trades",
    nameEs: "Contratista y oficios",
    blurb: "Roofing, HVAC, plumbing, and job-site businesses.",
    blurbEs: "Techados, A/C, plomería y oficios.",
  },
  {
    id: "salon",
    name: "Salon & beauty",
    nameEs: "Salón y belleza",
    blurb: "Hair, nails, spa, and appointment-based shops.",
    blurbEs: "Cabello, uñas, spa y citas.",
  },
  {
    id: "restaurant",
    name: "Restaurant & cafe",
    nameEs: "Restaurante y café",
    blurb: "Menus, hours, and a clear call to visit or order.",
    blurbEs: "Menú, horario y una llamada clara a visitar u ordenar.",
  },
  {
    id: "professional",
    name: "Professional services",
    nameEs: "Servicios profesionales",
    blurb: "Bookkeeping, insurance, consulting, and local offices.",
    blurbEs: "Contabilidad, seguros, consultoría y oficinas locales.",
  },
  {
    id: "landscaping",
    name: "Landscaping & yards",
    nameEs: "Jardinería y patios",
    blurb: "Desert plants, lawns, irrigation, and Phoenix-area landscape crews.",
    blurbEs: "Plantas del desierto, césped, riego y jardinería en el área de Phoenix.",
  },
  {
    id: "tax",
    name: "Tax office",
    nameEs: "Oficina de impuestos",
    blurb:
      "A tax-prep shop site plus a private client drop box for W-2s, 1099s, and IDs. Not tax software.",
    blurbEs:
      "Sitio para una oficina de impuestos y un buzón privado para W-2, 1099 e identificaciones. No es software de impuestos.",
  },
];

export function publicSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  );
}

export function clientSitePath(slug: string) {
  return `/s/${slug}`;
}

export function clientSubdomainHost(slug: string) {
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN || COMPANY.domain;
  return `${slug}.${root}`;
}

export function stripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_SETUP_PRICE_ID &&
      process.env.STRIPE_MONTHLY_PRICE_ID,
  );
}

export function stripeBoostConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_BOOST_SETUP_PRICE_ID &&
      process.env.STRIPE_BOOST_MONTHLY_PRICE_ID,
  );
}

export function stripeEmailConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_EMAIL_SETUP_PRICE_ID &&
      process.env.STRIPE_EMAIL_MONTHLY_PRICE_ID,
  );
}

export function boostPriceIds() {
  const setup = process.env.STRIPE_BOOST_SETUP_PRICE_ID;
  const monthly = process.env.STRIPE_BOOST_MONTHLY_PRICE_ID;
  return [setup, monthly].filter((id): id is string => Boolean(id));
}

export function emailPriceIds() {
  const setup = process.env.STRIPE_EMAIL_SETUP_PRICE_ID;
  const monthly = process.env.STRIPE_EMAIL_MONTHLY_PRICE_ID;
  return [setup, monthly].filter((id): id is string => Boolean(id));
}
