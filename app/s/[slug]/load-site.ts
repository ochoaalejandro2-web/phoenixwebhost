import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { clientSiteMetadata } from "@/lib/client-metadata";
import {
  isPaFinancialSlug,
  paFinancialPageTitle,
  type PaFinancialPage,
} from "@/lib/pa-financial-i18n";
import {
  resolveSiteLocale,
  SITE_LANG_QUERY,
  siteLangCookieName,
  siteSupportsI18n,
} from "@/lib/site-locale";
import { getClientBySlug } from "@/lib/store";
import type { Client, ContactNotice, Locale } from "@/lib/types";

export function contactNotice(
  search: Record<string, string | string[] | undefined>,
): ContactNotice | null {
  const sent = Array.isArray(search.sent) ? search.sent[0] : search.sent;
  const error = Array.isArray(search.error) ? search.error[0] : search.error;
  if (sent === "1") return "sent";
  if (error === "no-email" || error === "send-failed" || error === "missing") {
    return error;
  }
  return null;
}

export async function loadClientSite(slug: string, query: Record<string, string | string[] | undefined>) {
  const client = await getClientBySlug(slug);
  if (!client) notFound();
  const bilingual = siteSupportsI18n(slug, client.template);
  const cookieStore = bilingual ? await cookies() : null;
  const locale: Locale = cookieStore
    ? resolveSiteLocale({
        query: query[SITE_LANG_QUERY],
        cookie: cookieStore.get(siteLangCookieName(slug))?.value,
      })
    : "en";
  return { client, locale, bilingual };
}

export async function clientPageMetadata(
  client: Client,
  locale: Locale,
  page: PaFinancialPage = "home",
) {
  const base = clientSiteMetadata(client, locale);
  if (!isPaFinancialSlug(client.slug) || page === "home") return base;
  const title = paFinancialPageTitle(page, locale);
  return {
    ...base,
    title: { absolute: title },
    openGraph: base.openGraph
      ? { ...base.openGraph, title }
      : undefined,
  };
}
