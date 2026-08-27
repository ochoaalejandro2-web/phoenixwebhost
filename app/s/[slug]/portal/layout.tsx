import type { Metadata } from "next";
import { loadLiveTaxOffice } from "@/lib/tax-guard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = await loadLiveTaxOffice(slug);
  if (!client) return { title: "Client documents" };
  return {
    title: `Client documents · ${client.businessName}`,
    robots: { index: false, follow: false },
  };
}

export default function TaxPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
