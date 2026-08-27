import { redirect } from "next/navigation";
import { readSiteLocale } from "@/lib/read-site-locale";
import { withSiteLangPath } from "@/lib/site-locale";
import { getTaxSession } from "@/lib/tax-auth";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath } from "@/lib/tax-office";
import {
  taxPortalBlobReady,
  taxPortalDbReady,
} from "@/lib/tax-db";

export const dynamic = "force-dynamic";

export default async function PortalIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const client = await requireLiveTaxOffice(slug);
  const locale = await readSiteLocale(slug, searchParams);
  const session = await getTaxSession();
  if (session?.clientId === client.id) {
    redirect(
      withSiteLangPath(
        session.role === "staff"
          ? portalPath(slug, "/staff")
          : portalPath(slug, "/folder"),
        locale,
      ),
    );
  }
  if (!taxPortalDbReady() || !taxPortalBlobReady()) {
    redirect(withSiteLangPath(portalPath(slug, "/login"), locale));
  }
  redirect(withSiteLangPath(portalPath(slug, "/login"), locale));
}
