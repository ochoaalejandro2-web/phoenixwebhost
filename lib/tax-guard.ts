import { notFound } from "next/navigation";
import { getClientBySlug } from "@/lib/store";
import { isTaxOfficeTemplate } from "@/lib/client-themes";
import type { Client } from "@/lib/types";

export async function loadLiveTaxOffice(slug: string): Promise<Client | null> {
  const client = await getClientBySlug(slug);
  if (!client || !isTaxOfficeTemplate(client.template) || client.siteStatus !== "live") {
    return null;
  }
  return client;
}

export async function requireLiveTaxOffice(slug: string) {
  const client = await loadLiveTaxOffice(slug);
  if (!client) notFound();
  return client;
}
