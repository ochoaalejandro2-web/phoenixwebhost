import Link from "next/link";
import { AuthForm } from "@/components/tax-portal/AuthForm";
import { PortalChrome } from "@/components/tax-portal/PortalChrome";
import { readSiteLocale } from "@/lib/read-site-locale";
import { withSiteLangPath } from "@/lib/site-locale";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath } from "@/lib/tax-office";
import { tTaxOffice } from "@/lib/tax-office-i18n";
import { taxPortalBlobReady, taxPortalDbReady } from "@/lib/tax-db";

export const dynamic = "force-dynamic";

export default async function PortalSignupPage({
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
  const ready = taxPortalDbReady() && taxPortalBlobReady();
  return (
    <PortalChrome client={client} locale={locale}>
      <h1 className="font-display text-3xl tracking-tight">{c.signupTitle}</h1>
      <p className="mt-3 max-w-xl text-black/80">
        {c.signupLead(client.businessName)}
      </p>
      {!ready ? (
        <p role="alert" className="mt-6 max-w-xl border border-black px-4 py-3 text-sm">
          {c.signupDown}
        </p>
      ) : (
        <AuthForm slug={slug} mode="signup" locale={locale} />
      )}
      <p className="mt-6 text-sm">
        {c.haveAccount}{" "}
        <Link
          className="font-semibold text-[#00E840]"
          href={withSiteLangPath(portalPath(slug, "/login"), locale)}
        >
          {c.logIn}
        </Link>
      </p>
    </PortalChrome>
  );
}
