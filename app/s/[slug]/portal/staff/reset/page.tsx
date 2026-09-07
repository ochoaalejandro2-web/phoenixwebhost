import Link from "next/link";
import { StaffResetForm } from "@/components/tax-portal/StaffResetForms";
import { PortalChrome } from "@/components/tax-portal/PortalChrome";
import { readSiteLocale } from "@/lib/read-site-locale";
import { firstSearchValue, withSiteLangPath } from "@/lib/site-locale";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath } from "@/lib/tax-office";
import { tTaxOffice } from "@/lib/tax-office-i18n";
import { readStaffResetToken } from "@/lib/tax-staff-reset";
import { taxPortalDbReady } from "@/lib/tax-db";

export const dynamic = "force-dynamic";

export default async function StaffResetPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const client = await requireLiveTaxOffice(slug);
  const locale = await readSiteLocale(slug, sp);
  const c = tTaxOffice(locale);
  const token = String(firstSearchValue(sp.token) || "");
  const claims = token ? readStaffResetToken(token) : null;
  const tokenOk =
    Boolean(claims) &&
    claims?.clientId === client.id &&
    claims?.slug === client.slug;
  const dbReady = taxPortalDbReady();
  return (
    <PortalChrome client={client} locale={locale}>
      <h1 className="font-display text-3xl tracking-tight">{c.resetTitle}</h1>
      <p className="mt-3 max-w-xl text-black/80">{c.resetLead}</p>
      {!dbReady ? (
        <p role="alert" className="mt-6 max-w-xl border border-black px-4 py-3 text-sm">
          {c.staffDown}
        </p>
      ) : !tokenOk ? (
        <p role="alert" className="mt-6 max-w-xl border border-black px-4 py-3 text-sm">
          {c.resetInvalid}
        </p>
      ) : (
        <StaffResetForm slug={slug} locale={locale} token={token} />
      )}
      <p className="mt-6 text-sm text-black/70">
        <Link
          href={withSiteLangPath(portalPath(slug, "/staff/login"), locale)}
          className="hover:text-black"
        >
          {c.backToStaffLogin}
        </Link>
      </p>
    </PortalChrome>
  );
}
