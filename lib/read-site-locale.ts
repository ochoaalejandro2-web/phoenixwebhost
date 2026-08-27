import { cookies } from "next/headers";
import {
  resolveSiteLocale,
  SITE_LANG_QUERY,
  siteLangCookieName,
} from "@/lib/site-locale";
import type { Locale } from "@/lib/types";

type Search = Record<string, string | string[] | undefined>;

/** Server pages: `?lang=` wins, then the per-slug cookie, else English. */
export async function readSiteLocale(
  slug: string,
  searchParams?: Search | Promise<Search>,
): Promise<Locale> {
  const query = searchParams ? await Promise.resolve(searchParams) : undefined;
  const store = await cookies();
  return resolveSiteLocale({
    query: query?.[SITE_LANG_QUERY],
    cookie: store.get(siteLangCookieName(slug))?.value,
  });
}
