import { isAlwaysLiveWalkInDemo } from "./public-demos.ts";

export function mergeMissingBySlug<T extends { slug: string }>(
  existing: T[],
  seed: T[],
): { items: T[]; added: boolean } {
  const have = new Set(existing.map((row) => row.slug));
  const extras = seed.filter((row) => !have.has(row.slug));
  if (extras.length === 0) return { items: existing, added: false };
  return { items: [...existing, ...extras], added: true };
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

type WalkInLiveFields = {
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
  sample?: boolean;
  notes?: { id: string; body: string; createdAt: string }[];
};

const UNPAID_FIXTURE_NOTE =
  /Card failed\. Reminder emailed\. Site set to temporarily offline|Unpaid after reminder\. Site set to temporarily offline/i;

function walkInDemoNeedsLiveRestore(
  client: WalkInLiveFields,
  seed: WalkInLiveFields,
) {
  if (!isAlwaysLiveWalkInDemo(client.slug)) return false;
  if (seed.siteStatus !== "live") return false;
  return (
    client.siteStatus !== "live" ||
    client.paymentStatus === "overdue" ||
    client.paymentStatus === "unpaid" ||
    client.offlineAt != null ||
    client.overdueSince != null ||
    Boolean(seed.sample && !client.sample)
  );
}

function restoreWalkInNotes<T extends WalkInLiveFields>(client: T, seed: T) {
  const notes = client.notes ?? [];
  if (notes.length > 0 && notes.every((note) => UNPAID_FIXTURE_NOTE.test(note.body))) {
    return seed.notes ?? [];
  }
  return notes;
}

/**
 * Postgres keeps the first seed copy. Mesa Street Kitchen used to be the
 * unpaid-offline fixture, so existing stores stay offline until we restore
 * walk-in template demos that seed now keeps live.
 */
export function restoreSeedWalkInDemos<T extends WalkInLiveFields>(
  existing: T[],
  seed: T[],
): { items: T[]; added: boolean } {
  const seedBySlug = new Map(seed.map((row) => [row.slug, row]));
  let added = false;
  const items = existing.map((client) => {
    const row = seedBySlug.get(client.slug);
    if (!row || !walkInDemoNeedsLiveRestore(client, row)) return client;
    added = true;
    return {
      ...client,
      siteStatus: "live" as const,
      paymentStatus: "paid" as const,
      lastPaymentAt: row.lastPaymentAt ?? client.lastPaymentAt,
      nextInvoiceAt: row.nextInvoiceAt ?? client.nextInvoiceAt,
      reminderSentAt: null,
      overdueSince: null,
      offlineAt: null,
      filesKeptUntil: null,
      takenDownAt: null,
      sample: row.sample ?? client.sample,
      notes: restoreWalkInNotes(client, row),
    };
  });
  return { items, added };
}
