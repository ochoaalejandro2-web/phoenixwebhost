import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderClientSite } from "@/components/sites/Templates";
import {
  clientPageMetadata,
  contactNotice,
  loadClientSite,
} from "@/app/s/[slug]/load-site";
import { isPaFinancialSlug } from "@/lib/pa-financial-i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isPaFinancialSlug(slug)) return { title: { absolute: "Contact" } };
  const query = await searchParams;
  const { client, locale } = await loadClientSite(slug, query);
  return clientPageMetadata(client, locale, "contact");
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  if (!isPaFinancialSlug(slug)) notFound();
  const query = await searchParams;
  const { client, locale } = await loadClientSite(slug, query);
  return renderClientSite(client, contactNotice(query), locale, "contact");
}
