import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { renderClientSite } from "@/components/sites/Templates";
import { clientSiteMetadata } from "@/lib/client-metadata";
import {
  resolveSiteLocale,
  SITE_LANG_QUERY,
  siteLangCookieName,
  siteSupportsI18n,
} from "@/lib/site-locale";
import { getClientBySlug } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = await getClientBySlug(slug);
  if (!client) return { title: { absolute: "Site" } };
  if (client.siteStatus === "offline" || client.siteStatus === "paused") {
    return { title: { absolute: "Temporarily offline" } };
  }
  if (client.siteStatus === "taken_down") {
    return { title: { absolute: "Site unavailable" } };
  }
  const query = await searchParams;
  const bilingual = siteSupportsI18n(slug, client.template);
  const locale = bilingual
    ? resolveSiteLocale({
        query: query[SITE_LANG_QUERY],
        cookie: (await cookies()).get(siteLangCookieName(slug))?.value,
      })
    : "en";
  return clientSiteMetadata(client, locale);
}

function contactNotice(
  search: Record<string, string | string[] | undefined>,
) {
  const sent = Array.isArray(search.sent) ? search.sent[0] : search.sent;
  const error = Array.isArray(search.error) ? search.error[0] : search.error;
  if (sent === "1") return "sent" as const;
  if (
    error === "no-email" ||
    error === "send-failed" ||
    error === "missing"
  ) {
    return error;
  }
  return null;
}

export default async function ClientSitePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const client = await getClientBySlug(slug);
  if (!client) notFound();
  const bilingual = siteSupportsI18n(slug, client.template);
  const cookieStore = bilingual ? await cookies() : null;
  const locale = cookieStore
    ? resolveSiteLocale({
        query: query[SITE_LANG_QUERY],
        cookie: cookieStore.get(siteLangCookieName(slug))?.value,
      })
    : "en";
  return renderClientSite(client, contactNotice(query), locale);
}
