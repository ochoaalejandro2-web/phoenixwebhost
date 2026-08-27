import {
  FolderPanel,
  LogoutForm,
  PortalChrome,
} from "@/components/tax-portal/FolderPanel";
import { requireTaxCustomer } from "@/lib/tax-auth";
import { listTaxFiles, taxPortalBlobReady, taxPortalDbReady } from "@/lib/tax-db";
import { requireLiveTaxOffice } from "@/lib/tax-guard";

export const dynamic = "force-dynamic";

export default async function PortalFolderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await requireLiveTaxOffice(slug);
  const session = await requireTaxCustomer(slug, client.id);
  const files = taxPortalDbReady()
    ? await listTaxFiles(client.id, session.userId)
    : [];
  return (
    <PortalChrome client={client} nav={<LogoutForm slug={slug} />}>
      <FolderPanel
        slug={slug}
        clientName={client.businessName}
        clientId={client.id}
        userId={session.userId}
        files={files}
        storageReady={taxPortalDbReady()}
        blobReady={taxPortalBlobReady()}
      />
    </PortalChrome>
  );
}
