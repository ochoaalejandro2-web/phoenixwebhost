export const MESA_STREET_KITCHEN_SLUG = "mesa-street-kitchen";
export const DESERT_SPARKLE_SLUG = "desert-sparkle-cleaning";
export const PA_FINANCIAL_SEED_SLUG = "pa-financial";
export const HOLA_TAX_SEED_SLUG = "hola-tax-service";
const HOLA_TAX_STALE_PHONE = "(602) 545-3308";

export function mergeMissingBySlug<T extends { slug: string }>(
  existing: T[],
  seed: T[],
): { items: T[]; added: boolean } {
  const have = new Set(existing.map((row) => row.slug));
  const extras = seed.filter((row) => !have.has(row.slug));
  if (extras.length === 0) return { items: existing, added: false };
  return { items: [...existing, ...extras], added: true };
}

type MesaStreetRestoreFields = {
  slug: string;
  siteStatus?: string;
  paymentStatus?: string;
  lastPaymentAt?: string | null;
  nextInvoiceAt?: string | null;
  reminderSentAt?: string | null;
  overdueSince?: string | null;
  offlineAt?: string | null;
  filesKeptUntil?: string | null;
  takenDownAt?: string | null;
};

/**
 * Mesa Street Kitchen was seeded as the unpaid/offline example. It is a public
 * restaurant demo like Desert Peak and Ironwood, so existing stores must flip
 * only that slug back to live/paid. Other overdue clients are left alone.
 */
export function restoreMesaStreetKitchenDemo<T extends MesaStreetRestoreFields>(
  existing: T[],
): { items: T[]; added: boolean } {
  let added = false;
  const paidAt = new Date().toISOString();
  const items = existing.map((client) => {
    if (client.slug !== MESA_STREET_KITCHEN_SLUG) return client;
    if (client.siteStatus === "live" && client.paymentStatus === "paid") {
      return client;
    }
    added = true;
    return {
      ...client,
      siteStatus: "live",
      paymentStatus: "paid",
      lastPaymentAt: paidAt,
      nextInvoiceAt: new Date(Date.now() + 30 * 86_400_000).toISOString(),
      reminderSentAt: null,
      overdueSince: null,
      offlineAt: null,
      filesKeptUntil: null,
      takenDownAt: null,
    };
  });
  return { items, added };
}

/**
 * Desert Sparkle’s first live about was too long on a phone. Existing stores
 * keep the old copy unless we refresh just that sample slug from seed.
 */
export function refreshDesertSparkleDemoCopy<T extends { slug: string; about?: string }>(
  existing: T[],
  seed: T[],
): { items: T[]; added: boolean } {
  const fresh = seed.find((row) => row.slug === DESERT_SPARKLE_SLUG);
  if (!fresh?.about) return { items: existing, added: false };
  let added = false;
  const items = existing.map((client) => {
    if (client.slug !== DESERT_SPARKLE_SLUG || client.about === fresh.about) {
      return client;
    }
    added = true;
    return { ...client, about: fresh.about };
  });
  return { items, added };
}

const PA_STALE_LOGOS = [
  "/clients/pa-financial/logo-circle.jpg",
  "/clients/pa-financial/logo-brand.svg",
  "/clients/pa-financial/logo.png",
];

const PA_LISTED_SERVICES = [
  "Personal and Business Tax Preparation",
  "W-2 / 1099 / Uber",
  "ITIN Number Processing",
  "Business Registration",
  "Bookkeeping / Payroll",
];

function paListedServicesNeedRefresh(services?: string[]) {
  const listed = services || [];
  if (listed.length !== PA_LISTED_SERVICES.length) return true;
  return PA_LISTED_SERVICES.some((name, index) => listed[index] !== name);
}

/** Existing P&A rows keep stale logos and the old service list until seed refresh. */
export function refreshPaFinancialListedOfferings<
  T extends {
    slug: string;
    services?: string[];
    about?: string;
    logoSrc?: string;
  },
>(existing: T[], seed: T[]): { items: T[]; added: boolean } {
  const fresh = seed.find((row) => row.slug === PA_FINANCIAL_SEED_SLUG);
  if (!fresh) return { items: existing, added: false };
  let added = false;
  const items = existing.map((client) => {
    if (client.slug !== PA_FINANCIAL_SEED_SLUG) return client;
    const servicesNeed = paListedServicesNeedRefresh(client.services);
    const logoNeed =
      !client.logoSrc || PA_STALE_LOGOS.includes(String(client.logoSrc));
    const aboutNeed =
      typeof client.about === "string" &&
      (/llc formation/i.test(client.about) ||
        /income taxes/i.test(client.about) ||
        !/tax preparation/i.test(client.about) ||
        !/W-2/i.test(client.about) ||
        !/ITIN/i.test(client.about) ||
        !/business registration/i.test(client.about) ||
        !/payroll/i.test(client.about));
    if (!servicesNeed && !logoNeed && !aboutNeed) return client;
    added = true;
    return {
      ...client,
      ...(servicesNeed && fresh.services ? { services: fresh.services } : {}),
      ...(logoNeed && fresh.logoSrc ? { logoSrc: fresh.logoSrc } : {}),
      ...(aboutNeed && fresh.about ? { about: fresh.about } : {}),
    };
  });
  return { items, added };
}

/** Existing P&A rows keep Colorado if they were seeded before the Arizona swap. */
export function refreshPaFinancialArizonaCopy<
  T extends { slug: string; city?: string; about?: string },
>(existing: T[], seed: T[]): { items: T[]; added: boolean } {
  const fresh = seed.find((row) => row.slug === PA_FINANCIAL_SEED_SLUG);
  if (!fresh) return { items: existing, added: false };
  let added = false;
  const items = existing.map((client) => {
    if (client.slug !== PA_FINANCIAL_SEED_SLUG) return client;
    const cityNeedsSwap =
      typeof client.city === "string" && /colorado/i.test(client.city);
    const aboutNeedsSwap =
      typeof client.about === "string" && /colorado/i.test(client.about);
    if (!cityNeedsSwap && !aboutNeedsSwap) return client;
    added = true;
    return {
      ...client,
      ...(cityNeedsSwap ? { city: fresh.city } : {}),
      ...(aboutNeedsSwap ? { about: fresh.about } : {}),
    };
  });
  return { items, added };
}

/** Existing Hola Tax rows keep the retired office phone until seed refresh. */
export function refreshHolaTaxContactPhone<
  T extends { slug: string; phone?: string; about?: string },
>(existing: T[], seed: T[]): { items: T[]; added: boolean } {
  const fresh = seed.find((row) => row.slug === HOLA_TAX_SEED_SLUG);
  if (!fresh) return { items: existing, added: false };
  let added = false;
  const items = existing.map((client) => {
    if (client.slug !== HOLA_TAX_SEED_SLUG) return client;
    const phoneNeedsSwap =
      typeof client.phone === "string" &&
      (client.phone.includes(HOLA_TAX_STALE_PHONE) ||
        client.phone.replace(/\D/g, "") === "6025453308");
    const aboutNeedsSwap =
      typeof client.about === "string" &&
      (client.about.includes(HOLA_TAX_STALE_PHONE) ||
        client.about.includes("6025453308"));
    if (!phoneNeedsSwap && !aboutNeedsSwap) return client;
    added = true;
    return {
      ...client,
      ...(phoneNeedsSwap && fresh.phone ? { phone: fresh.phone } : {}),
      ...(aboutNeedsSwap && fresh.about ? { about: fresh.about } : {}),
    };
  });
  return { items, added };
}

export function applySeedDemoBookJob<T extends { slug: string; bookAJob?: boolean }>(
  existing: T[],
  seed: T[],
): { items: T[]; added: boolean } {
  const seedBook = new Map(seed.map((row) => [row.slug, Boolean(row.bookAJob)]));
  let added = false;
  const items = existing.map((client) => {
    if (!seedBook.get(client.slug) || client.bookAJob) return client;
    added = true;
    return { ...client, bookAJob: true };
  });
  return { items, added };
}
