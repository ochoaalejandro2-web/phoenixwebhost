import Link from "next/link";
import { StaffForgotForm } from "@/components/tax-portal/StaffResetForms";
import { PortalChrome } from "@/components/tax-portal/PortalChrome";
import { notifyEmailReady } from "@/lib/notify";
import { readSiteLocale } from "@/lib/read-site-locale";
import { withSiteLangPath } from "@/lib/site-locale";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath, taxOfficeStaffBootstrap } from "@/lib/tax-office";
import { tTaxOffice } from "@/lib/tax-office-i18n";
import { taxPortalDbReady } from "@/lib/tax-db";

export const dynamic = "force-dynamic";

export default async function StaffForgotPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const client = await requireLiveTaxOffice(slug);
  const locale = await readSiteLocale(slug, searchParams);
  const c = tTaxOffice(locale);
  const staffEmail = taxOfficeStaffBootstrap(client.slug).email;
  const dbReady = taxPortalDbReady();
  const mailReady = notifyEmailReady();
  return (
    <PortalChrome client={client} locale={locale}>
      <h1 className="font-display text-3xl tracking-tight">{c.forgotTitle}</h1>
      <p className="mt-3 max-w-xl text-black/80">
        {c.forgotLead(client.businessName)}
      </p>
      {!dbReady ? (
        <p role="alert" className="mt-6 max-w-xl border border-black px-4 py-3 text-sm">
          {c.staffDown}
        </p>
      ) : !mailReady ? (
        <p role="alert" className="mt-6 max-w-xl border border-black px-4 py-3 text-sm">
          {c.forgotMailDown}
        </p>
      ) : (
        <StaffForgotForm
          slug={slug}
          locale={locale}
          defaultEmail={staffEmail}
        />
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
