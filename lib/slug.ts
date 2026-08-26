export function slugify(input: string) {
  const slug = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "site";
}

export function uniqueSlug(base: string, taken: string[]) {
  const root = slugify(base);
  if (!taken.includes(root)) return root;
  let i = 2;
  while (taken.includes(`${root}-${i}`)) i += 1;
  return `${root}-${i}`;
}

export function monthKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}
