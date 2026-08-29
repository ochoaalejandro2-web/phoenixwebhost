export function mergeMissingBySlug<T extends { slug: string }>(
  existing: T[],
  seed: T[],
): { items: T[]; added: boolean } {
  const have = new Set(existing.map((row) => row.slug));
  const extras = seed.filter((row) => !have.has(row.slug));
  if (extras.length === 0) return { items: existing, added: false };
  return { items: [...existing, ...extras], added: true };
}
