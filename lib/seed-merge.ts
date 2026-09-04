export const MESA_STREET_KITCHEN_SLUG = "mesa-street-kitchen";
export const DESERT_SPARKLE_SLUG = "desert-sparkle-cleaning";

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
