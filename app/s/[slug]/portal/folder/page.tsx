import { LeaveReviewCta } from "@/components/sites/LeaveReviewCta";
import { FolderPanel, LogoutForm } from "@/components/tax-portal/FolderPanel";
import { PortalChrome, taxButtonClass } from "@/components/tax-portal/PortalChrome";
import { readSiteLocale } from "@/lib/read-site-locale";
import { requireTaxCustomer } from "@/lib/tax-auth";
import { listTaxFiles, taxPortalBlobReady, taxPortalDbReady } from "@/lib/tax-db";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { tTaxOffice } from "@/lib/tax-office-i18n";
import { taxOfficeGoogleReviewUrl } from "@/lib/tax-office-layout";

export const dynamic = "force-dynamic";

export default async function PortalFolderPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const client = await requireLiveTaxOffice(slug);
  const locale = await readSiteLocale(slug, searchParams);
  const session = await requireTaxCustomer(slug, client.id);
  const files = taxPortalDbReady()
    ? await listTaxFiles(client.id, session.userId)
    : [];
  const c = tTaxOffice(locale);
  const reviewUrl = taxOfficeGoogleReviewUrl(client);
  return (
    <PortalChrome
      client={client}
      locale={locale}
      showReviewCta
      nav={<LogoutForm slug={slug} label={c.signOut} />}
    >
      {reviewUrl ? (
        <p className="mb-8">
          <LeaveReviewCta
            href={reviewUrl}
            locale={locale}
            className={taxButtonClass}
          />
        </p>
      ) : null}
      <FolderPanel
        slug={slug}
        clientName={client.businessName}
        clientId={client.id}
        userId={session.userId}
        files={files}
        storageReady={taxPortalDbReady()}
        blobReady={taxPortalBlobReady()}
        locale={locale}
      />
    </PortalChrome>
  );
}
