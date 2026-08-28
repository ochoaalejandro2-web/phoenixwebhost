import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoChrome } from "@/components/marketing/DemoChrome";
import { renderClientSite } from "@/components/sites/Templates";
import { buildClientFromLead } from "@/lib/demo";
import { getLead } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) return { title: { absolute: "Demo" }, robots: { index: false } };
  return {
    title: { absolute: `Demo: ${lead.businessName}` },
    robots: { index: false, follow: false },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();
  const client = buildClientFromLead(lead, [], { preview: true });
  return (
    <DemoChrome lead={lead}>
      {renderClientSite(client, null, lead.locale)}
    </DemoChrome>
  );
}
