import Link from "next/link";
import { AuthForm } from "@/components/tax-portal/AuthForm";
import { PortalChrome } from "@/components/tax-portal/PortalChrome";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath } from "@/lib/tax-office";
import { taxPortalBlobReady, taxPortalDbReady } from "@/lib/tax-db";

export const dynamic = "force-dynamic";

export default async function PortalSignupPage({
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
        Create a client account / Crear cuenta
      </h1>
      <p className="mt-3 max-w-xl text-black/80">
        This login is only for {client.businessName}. Your documents stay in
        your folder. We store your name, email, phone, and a hashed password.
        Files are private — not on the public website, not in git.
      </p>
      {!ready ? (
        <p role="alert" className="mt-6 max-w-xl border border-black px-4 py-3 text-sm">
          This document portal is not connected yet. Call the office.
        </p>
      ) : (
        <AuthForm slug={slug} mode="signup" />
      )}
      <p className="mt-6 text-sm">
        Already have an account?{" "}
        <Link className="font-semibold text-[#00E840]" href={portalPath(slug, "/login")}>
          Log in
        </Link>
      </p>
    </PortalChrome>
  );
}
