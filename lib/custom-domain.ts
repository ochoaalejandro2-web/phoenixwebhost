/** Host matching for client custom domains (www and apex are the same site). */

export type HostRouteDecision =
  | { type: "next" }
  | { type: "redirect"; url: string; status: 301 }
  | { type: "rewrite"; pathname: string; search: string };

export function normalizeHost(host: string): string {
  let value = host.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "");
  const slash = value.indexOf("/");
  if (slash >= 0) value = value.slice(0, slash);
  const colon = value.indexOf(":");
  if (colon >= 0) value = value.slice(0, colon);
  if (value.endsWith(".")) value = value.slice(0, -1);
  return value;
}

export function normalizeCustomDomain(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const host = normalizeHost(value);
  return host || null;
}

export function hostWithoutWww(host: string): string {
  const h = normalizeHost(host);
  return h.startsWith("www.") ? h.slice(4) : h;
}

export function wwwHost(host: string): string {
  const h = normalizeHost(host);
  if (!h) return h;
  return h.startsWith("www.") ? h : `www.${h}`;
}

export function customDomainAliases(customDomain: string): string[] {
  const stored = normalizeCustomDomain(customDomain);
  if (!stored) return [];
  const aliases = new Set([stored, hostWithoutWww(stored), wwwHost(stored)]);
  return [...aliases];
}

export function customDomainMatchesHost(
  customDomain: string | null | undefined,
  host: string,
): boolean {
  const needle = normalizeHost(host);
  if (!needle || !customDomain) return false;
  return customDomainAliases(customDomain).includes(needle);
}

/**
 * Prefer https://www.* as the public URL. Redirect the apex twin to www
 * when the stored domain is www.example.com, or when it is a two-label
 * apex (example.com). Do not invent www.shop.example.com for a stored
 * subdomain custom domain.
 */
export function apexWwwRedirectHost(
  requestHost: string,
  customDomain: string | null | undefined,
): string | null {
  const host = normalizeHost(requestHost);
  const stored = normalizeCustomDomain(customDomain);
  if (!host || !stored || !customDomainMatchesHost(stored, host)) return null;
  if (host.startsWith("www.")) return null;
  const apex = hostWithoutWww(stored);
  if (host !== apex) return null;
  const labels = apex.split(".").filter(Boolean).length;
  if (stored.startsWith("www.") || labels === 2) return wwwHost(stored);
  return null;
}

export function isPlatformHost(host: string, platformDomain: string): boolean {
  const h = normalizeHost(host);
  const root = normalizeHost(platformDomain);
  return (
    h === root ||
    h === `www.${root}` ||
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.endsWith(".vercel.app")
  );
}

export function compactHostSlug(value: string) {
  return value.toLowerCase().replace(/-/g, "");
}

/**
 * Map a walk-in host label (ironwood, paloverde, desertpeak) onto the
 * stored client slug (ironwood-handyman, palo-verde-yards, …).
 */
export function resolveDemoSubdomainSlug(
  hostSlug: string,
  slugs: string[],
): string | null {
  const needle = hostSlug.trim().toLowerCase();
  if (!needle) return null;
  if (slugs.includes(needle)) return needle;
  const compact = compactHostSlug(needle);
  const matches = slugs.filter((slug) => {
    const s = compactHostSlug(slug);
    return s === compact || s.startsWith(compact);
  });
  if (matches.length === 1) return matches[0];
  return (
    matches.find((slug) => slug.startsWith(`${needle}-`)) ||
    matches[0] ||
    null
  );
}

export function subdomainSlug(host: string, rootDomain: string): string | null {
  const h = normalizeHost(host);
  const root = normalizeHost(rootDomain);
  if (h.endsWith(`.${root}`)) {
    const slug = h.slice(0, -(root.length + 1));
    if (!slug || slug === "www") return null;
    return slug;
  }
  if (h.endsWith(".localhost")) {
    const slug = h.replace(/\.localhost$/, "");
    return slug || null;
  }
  return null;
}

function withLang(search: string, locale: string): string {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  params.set("lang", locale);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function clientHostDecision(input: {
  host: string;
  pathname: string;
  search: string;
  protocol: string;
  slug: string;
  customDomain: string | null;
  viaCustomDomain: boolean;
}): HostRouteDecision {
  const path = input.pathname || "/";
  if (input.viaCustomDomain) {
    const dest = apexWwwRedirectHost(input.host, input.customDomain);
    if (dest) {
      const proto = (input.protocol.replace(/:$/, "") || "https").replace(
        /[^a-z0-9+.-]/gi,
        "",
      );
      return {
        type: "redirect",
        url: `${proto}://${dest}${path}${input.search}`,
        status: 301,
      };
    }
  }

  if (
    path.startsWith("/s/") ||
    path.startsWith("/admin") ||
    path.startsWith("/login") ||
    path === "/robots.txt" ||
    path === "/sitemap.xml"
  ) {
    return { type: "next" };
  }

  if (path === "/es" || path === "/es/") {
    return {
      type: "rewrite",
      pathname: `/s/${input.slug}`,
      search: withLang(input.search, "es"),
    };
  }

  return {
    type: "rewrite",
    pathname: path === "/" ? `/s/${input.slug}` : `/s/${input.slug}${path}`,
    search: input.search,
  };
}

export function findClientByCustomDomain<
  T extends { customDomain: string | null },
>(clients: T[], host: string): T | null {
  return clients.find((c) => customDomainMatchesHost(c.customDomain, host)) ?? null;
}
