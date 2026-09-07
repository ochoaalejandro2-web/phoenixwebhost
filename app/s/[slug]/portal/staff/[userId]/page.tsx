import Link from "next/link";
import { notFound } from "next/navigation";
import { FiledCopyUpload } from "@/components/tax-portal/FiledCopyUpload";
import { FileTable, YearFolders } from "@/components/tax-portal/FolderPanel";
import { LogoutForm, PortalChrome } from "@/components/tax-portal/PortalChrome";
import { StaffDeleteProfile } from "@/components/tax-portal/StaffDeletes";
import { readSiteLocale } from "@/lib/read-site-locale";
import { withSiteLangPath } from "@/lib/site-locale";
import { requireTaxStaff } from "@/lib/tax-auth";
import { findTaxUserById, listTaxFiles, taxPortalDbReady } from "@/lib/tax-db";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath, splitTaxFiles, taxReturnYears } from "@/lib/tax-office";
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
        <FiledCopyUpload
          slug={slug}
          clientId={client.id}
          ownerUserId={person.id}
          locale={locale}
        />
      </div>
      <h2 className="mt-10 font-display text-xl">{c.filedTitle}</h2>
      <p className="mt-2 text-sm text-black/80">{c.staffFiledLead}</p>
      <div className="mt-4">
        <YearFolders slug={slug} files={files} locale={locale} canDelete />
      </div>
      <h2 className="mt-10 font-display text-xl">{c.staffIntakeTitle}</h2>
      <div className="mt-4">
        <FileTable
          slug={slug}
          files={splitTaxFiles(files, taxReturnYears()).intake}
          locale={locale}
          canDelete
        />
      </div>
      <StaffDeleteProfile
        slug={slug}
        userId={person.id}
        name={person.name}
        locale={locale}
      />
    </PortalChrome>
  );
}
