import Link from "next/link";
import { AuthForm } from "@/components/tax-portal/AuthForm";
import { PortalChrome } from "@/components/tax-portal/PortalChrome";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath } from "@/lib/tax-office";
import { taxPortalBlobReady, taxPortalDbReady } from "@/lib/tax-db";

export const dynamic = "force-dynamic";

export default async function PortalLoginPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await requireLiveTaxOffice(slug);
  const ready = taxPortalDbReady() && taxPortalBlobReady();
  return (
    <PortalChrome client={client}>
      <h1 className="font-display text-3xl tracking-tight">
        Client login / Iniciar sesión
      </h1>
      <p className="mt-3 max-w-xl text-black/80">
        Upload W-2s, 1099s, and ID into your private folder at{" "}
        {client.businessName}. Only you and this tax office can open it. If you
        forget your password, call {client.phone}.
      </p>
      {!ready ? (
        <p role="alert" className="mt-6 max-w-xl border border-black px-4 py-3 text-sm">
          This document portal is not connected yet (database or private file
          storage is missing). Call the office. We will not take uploads until
          storage is private.
        </p>
      ) : (
        <AuthForm slug={slug} mode="login" />
      )}
      <p className="mt-6 text-sm">
        New client?{" "}
        <Link className="font-semibold text-[#00E840]" href={portalPath(slug, "/signup")}>
          Create an account / Crear cuenta
        </Link>
      </p>
      <p className="mt-3 text-sm text-black/70">
        Tax preparer?{" "}
        <Link href={portalPath(slug, "/staff/login")} className="hover:text-black">
          Staff login
        </Link>
      </p>
    </PortalChrome>
  );
}
