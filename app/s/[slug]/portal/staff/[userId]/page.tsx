import Link from "next/link";
import { notFound } from "next/navigation";
import { FileTable } from "@/components/tax-portal/FolderPanel";
import { LogoutForm, PortalChrome } from "@/components/tax-portal/PortalChrome";
import { requireTaxStaff } from "@/lib/tax-auth";
import { findTaxUserById, listTaxFiles, taxPortalDbReady } from "@/lib/tax-db";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath } from "@/lib/tax-office";

export const dynamic = "force-dynamic";

export default async function StaffFolderPage({
  params,
}: {
  params: Promise<{ slug: string; userId: string }>;
}) {
  const { slug, userId } = await params;
  const client = await requireLiveTaxOffice(slug);
  await requireTaxStaff(slug, client.id);
  if (!taxPortalDbReady()) notFound();
  const person = await findTaxUserById(client.id, userId);
  if (!person || person.role !== "customer") notFound();
  const files = await listTaxFiles(client.id, person.id);
  return (
    <PortalChrome client={client} nav={<LogoutForm slug={slug} />}>
      <p className="text-sm">
        <Link href={portalPath(slug, "/staff")} className="font-semibold text-[#00E840]">
          All clients
        </Link>
      </p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">{person.name}</h1>
      <p className="mt-1 text-sm text-black/70">
        {person.email}
        {person.phone ? ` · ${person.phone}` : ""}
      </p>
      <div className="mt-8">
        <FileTable slug={slug} files={files} />
      </div>
    </PortalChrome>
  );
}
