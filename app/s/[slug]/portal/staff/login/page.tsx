import Link from "next/link";
import { AuthForm } from "@/components/tax-portal/AuthForm";
import { PortalChrome } from "@/components/tax-portal/PortalChrome";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath } from "@/lib/tax-office";
import { taxPortalDbReady } from "@/lib/tax-db";

export const dynamic = "force-dynamic";

export default async function StaffLoginPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await requireLiveTaxOffice(slug);
  return (
    <PortalChrome client={client}>
      <h1 className="font-display text-3xl tracking-tight">
        Tax preparer login / Acceso del preparador
      </h1>
      <p className="mt-3 max-w-xl text-black/80">
        This is the staff login for {client.businessName} only. You will see
        this office’s client folders — not other tax shops, and not the
        Phoenixwebhost owner panel.
      </p>
      {!taxPortalDbReady() ? (
        <p role="alert" className="mt-6 max-w-xl border border-black px-4 py-3 text-sm">
          Staff login is not available until the database is connected.
        </p>
      ) : (
        <AuthForm slug={slug} mode="staff" />
      )}
      <p className="mt-6 text-sm text-black/70">
        Client?{" "}
        <Link href={portalPath(slug, "/login")} className="hover:text-black">
          Client login
        </Link>
      </p>
    </PortalChrome>
  );
}
