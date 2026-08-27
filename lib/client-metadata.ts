import type { Metadata } from "next";
import { HOLA_TAX_SLUG } from "@/lib/client-themes";
import { publicSiteUrl } from "@/lib/config";
import { normalizeCustomDomain, wwwHost } from "@/lib/custom-domain";
import { holaTaxSeo } from "@/lib/hola-tax-i18n";
import type { Client, Locale } from "@/lib/types";

export function clientPublicUrl(
  client: Pick<Client, "slug" | "customDomain">,
): string {
  const domain = normalizeCustomDomain(client.customDomain);
  if (domain) return `https://${wwwHost(domain)}`;
  return `${publicSiteUrl().replace(/\/$/, "")}/s/${client.slug}`;
}

export function clientSiteSeo(
  client: Client,
  locale: Locale = "en",
): {
  title: string;
  description: string;
  brand: string;
  canonicalUrl: string;
  icon: string | null;
} {
  const canonicalUrl = clientPublicUrl(client);
  if (client.slug === HOLA_TAX_SLUG) {
    return { ...holaTaxSeo(locale), canonicalUrl };
  }
  return {
    brand: client.businessName,
    title: client.businessName,
    description:
      client.about ||
      client.tagline ||
      `${client.businessName} in ${client.city}`,
    canonicalUrl,
    icon: null,
  };
}

export function clientSiteMetadata(
  client: Client,
  locale: Locale = "en",
): Metadata {
  const seo = clientSiteSeo(client, locale);
  const metadata: Metadata = {
    title: { absolute: seo.title },
    description: seo.description,
    metadataBase: new URL(seo.canonicalUrl),
    alternates: { canonical: seo.canonicalUrl },
    openGraph: {
      title: seo.brand,
      description: seo.description,
      url: seo.canonicalUrl,
      siteName: seo.brand,
      locale: locale === "es" ? "es_US" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: seo.brand,
      description: seo.description,
    },
  };
  if (seo.icon) {
    metadata.icons = {
      icon: [{ url: seo.icon, type: "image/png" }],
      apple: seo.icon,
    };
  }
  return metadata;
}
