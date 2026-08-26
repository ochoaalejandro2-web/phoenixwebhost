import { notFound } from "next/navigation";
import { renderClientSite } from "@/components/sites/Templates";
import { getClientBySlug } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getClientBySlug(slug);
  if (!client) return { title: "Site" };
  if (client.siteStatus === "offline" || client.siteStatus === "paused") {
    return { title: "Temporarily offline" };
  }
  if (client.siteStatus === "taken_down") {
    return { title: "Site unavailable" };
  }
  return { title: client.businessName };
}

export default async function ClientSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getClientBySlug(slug);
  if (!client) notFound();
  return renderClientSite(client);
}
