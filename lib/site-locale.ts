import type { Locale } from "@/lib/types";

/** Query key on generated client sites. Marketing still uses `/es`. */
export const SITE_LANG_QUERY = "lang";

/**
 * Per-slug language cookie. Path `/` so it works on custom domains (`/`)
 * and on `/s/{slug}`. Marketing routes ignore this name.
 */
export function siteLangCookieName(slug: string) {
  return `pwh_lang_${slug}`;
}

const I18N_SLUGS = new Set(["hola-tax-service"]);

/**
 * Hola Tax by slug (same as the dedicated i18n PR) plus every Tax office
 * template site. Other templates stay English-only.
 */
export function siteSupportsI18n(slug: string, template?: string) {
  return I18N_SLUGS.has(slug) || template === "tax";
}

export function parseSiteLocale(value?: string | null): Locale | null {
  if (value === "en" || value === "es") return value;
  return null;
}

export function firstSearchValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Query wins (shareable). Cookie next (return visits). Default English. */
export function resolveSiteLocale(input: {
  query?: string | string[] | undefined;
  cookie?: string | null;
}): Locale {
  return (
    parseSiteLocale(firstSearchValue(input.query)) ||
    parseSiteLocale(input.cookie) ||
    "en"
  );
}

export function withSiteLangQuery(query: string, locale?: Locale | null) {
  if (!locale) return query;
  return query
    ? `${query}&${SITE_LANG_QUERY}=${locale}`
    : `${SITE_LANG_QUERY}=${locale}`;
}

/** Keep `?lang=` on internal tax-office / portal links. */
export function withSiteLangPath(path: string, locale?: Locale | null) {
  if (!locale) return path;
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? new URL(path)
      : new URL(path, "https://phoenixwebhost.invalid");
  url.searchParams.set(SITE_LANG_QUERY, locale);
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return url.toString();
  }
  return `${url.pathname}${url.search}${url.hash}`;
}
