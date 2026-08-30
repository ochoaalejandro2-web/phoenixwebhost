import {
  compactHostSlug,
  customDomainMatchesHost,
  normalizeHost,
  resolveDemoSubdomainSlug,
} from "./custom-domain.ts";

/**
 * Walk-in demo hosts typed from the homepage chrome
 * (ironwood.phoenixwebhost.com) must always land on the stored seed slug,
 * even when postgres still has a stale short-slug row.
 */
export const WALK_IN_HOST_ALIASES: Record<string, string> = {
  ironwood: "ironwood-handyman",
  "ironwood-handyman": "ironwood-handyman",
  paloverde: "palo-verde-yards",
  "palo-verde": "palo-verde-yards",
  paloverdeyards: "palo-verde-yards",
  "palo-verde-yards": "palo-verde-yards",
  desertpeak: "desert-peak-roofing",
  "desert-peak": "desert-peak-roofing",
  desertpeakroofing: "desert-peak-roofing",
  "desert-peak-roofing": "desert-peak-roofing",
  casaluna: "casa-luna-salon",
  "casa-luna": "casa-luna-salon",
  casalunasalon: "casa-luna-salon",
  "casa-luna-salon": "casa-luna-salon",
  mesastreet: "mesa-street-kitchen",
  "mesa-street": "mesa-street-kitchen",
  mesastreetkitchen: "mesa-street-kitchen",
  "mesa-street-kitchen": "mesa-street-kitchen",
  holatax: "hola-tax-service",
  "hola-tax": "hola-tax-service",
  holataxservice: "hola-tax-service",
  "hola-tax-service": "hola-tax-service",
};

export const WALK_IN_DISPLAY_HOST: Record<string, string> = {
  "ironwood-handyman": "ironwood.phoenixwebhost.com",
  "palo-verde-yards": "paloverde.phoenixwebhost.com",
  "desert-peak-roofing": "desertpeak.phoenixwebhost.com",
};

const HOLA_TAX_CUSTOM = {
  slug: "hola-tax-service",
  customDomain: "www.hola-tax-service.com",
} as const;

export function resolveWalkInHostSlug(hostSlug: string): string | null {
  const needle = hostSlug.trim().toLowerCase();
  if (!needle) return null;
  if (WALK_IN_HOST_ALIASES[needle]) return WALK_IN_HOST_ALIASES[needle];
  const compact = compactHostSlug(needle);
  if (WALK_IN_HOST_ALIASES[compact]) return WALK_IN_HOST_ALIASES[compact];
  return null;
}

export function walkInDisplayHost(slug: string, fallbackHost: string) {
  return WALK_IN_DISPLAY_HOST[slug] || fallbackHost;
}

/**
 * Prefer the canonical walk-in demo over a leftover short-slug row
 * (slug "ironwood" missing bookAJob / services / phone).
 */
export function pickClientBySlug<T extends { slug: string }>(
  clients: T[],
  slug: string,
): T | null {
  const walkIn = resolveWalkInHostSlug(slug);
  if (walkIn) {
    const canonical = clients.find((client) => client.slug === walkIn);
    if (canonical) return canonical;
  }
  const exact = clients.find((client) => client.slug === slug);
  if (exact) return exact;
  const resolved = resolveDemoSubdomainSlug(
    slug,
    clients.map((client) => client.slug),
  );
  return resolved
    ? (clients.find((client) => client.slug === resolved) ?? null)
    : null;
}

export function resolveKnownCustomDomain(host: string): {
  slug: string;
  customDomain: string;
} | null {
  const needle = normalizeHost(host);
  if (!needle) return null;
  if (customDomainMatchesHost(HOLA_TAX_CUSTOM.customDomain, needle)) {
    return { ...HOLA_TAX_CUSTOM };
  }
  return null;
}
