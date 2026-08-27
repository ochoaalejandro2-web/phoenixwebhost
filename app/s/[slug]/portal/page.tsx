import { redirect } from "next/navigation";
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await requireLiveTaxOffice(slug);
  const session = await getTaxSession();
  if (session?.clientId === client.id) {
    redirect(
      session.role === "staff"
        ? portalPath(slug, "/staff")
        : portalPath(slug, "/folder"),
    );
  }
  if (!taxPortalDbReady() || !taxPortalBlobReady()) {
    redirect(portalPath(slug, "/login"));
  }
  redirect(portalPath(slug, "/login"));
}
