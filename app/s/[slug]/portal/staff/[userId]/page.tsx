import Link from "next/link";
import { notFound } from "next/navigation";
import { FileTable } from "@/components/tax-portal/FolderPanel";
import { LogoutForm, PortalChrome } from "@/components/tax-portal/PortalChrome";
import { readSiteLocale } from "@/lib/read-site-locale";
import { withSiteLangPath } from "@/lib/site-locale";
import { requireTaxStaff } from "@/lib/tax-auth";
import { findTaxUserById, listTaxFiles, taxPortalDbReady } from "@/lib/tax-db";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath } from "@/lib/tax-office";
import { tTaxOffice } from "@/lib/tax-office-i18n";

export const dynamic = "force-dynamic";

export default async function StaffFolderPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; userId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug, userId } = await params;
  const client = await requireLiveTaxOffice(slug);
  const locale = await readSiteLocale(slug, searchParams);
  await requireTaxStaff(slug, client.id);
  if (!taxPortalDbReady()) notFound();
  const person = await findTaxUserById(client.id, userId);
  if (!person || person.role !== "customer") notFound();
  const files = await listTaxFiles(client.id, person.id);
  const c = tTaxOffice(locale);
  return (
    <PortalChrome
      client={client}
      locale={locale}
      nav={<LogoutForm slug={slug} label={c.signOut} />}
    >
      <p className="text-sm">
        <Link
          href={withSiteLangPath(portalPath(slug, "/staff"), locale)}
          className="font-semibold text-[#00E840]"
        >
          {c.allClients}
        </Link>
      </p>
      <h1 className="mt-2 font-display text-3xl tracking-tight">{person.name}</h1>
      <p className="mt-1 text-sm text-black/70">
        {person.email}
        {person.phone ? ` · ${person.phone}` : ""}
      </p>
      <div className="mt-8">
        <FileTable slug={slug} files={files} locale={locale} />
      </div>
    </PortalChrome>
  );
}
