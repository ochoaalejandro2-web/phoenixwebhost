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
