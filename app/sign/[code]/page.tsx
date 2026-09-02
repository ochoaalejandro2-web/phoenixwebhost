import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { SignDocument } from "@/components/sign/SignDocument";
import {
  formatSignCode,
  publicSignErrorMessage,
  publicSignStatus,
  signCodeLookupKey,
} from "@/lib/sign";
import { getSignDocumentByCode } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign a document",
  robots: { index: false, follow: false },
};

export default async function SignByCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const key = signCodeLookupKey(code);
  const doc = key ? await getSignDocumentByCode(key) : null;
  const status = doc ? publicSignStatus(doc) : "invalid";
  const errorKind = status === "pending" ? null : status;

  return (
    <div className="studio flex min-h-full flex-col items-center bg-snow px-5 py-12">
      <Link href="/" aria-label="Phoenixwebhost home">
        <Logo />
      </Link>
      {status === "pending" && doc ? (
        <div className="mt-8 w-full max-w-lg">
          <h1 className="font-display text-3xl text-ink-black">Sign this PDF</h1>
          <p className="mt-2 text-sm text-body">
            {doc.boxes?.length
              ? "Green boxes mark where your signature will go. Sign once below — type your name or draw. That one signature is placed on every marked spot."
              : "Read the document, then type your name or draw on your phone."}
          </p>
          <SignDocument
            code={formatSignCode(doc.code)}
            filename={doc.filename}
            boxes={doc.boxes || []}
          />
        </div>
      ) : (
        <div className="mt-10 w-full max-w-sm text-center">
          <h1 className="font-display text-3xl text-ink-black">Cannot open that</h1>
          <p className="mt-3 text-body">
            {publicSignErrorMessage(errorKind || "invalid")}
          </p>
          <Link href="/sign" className="mt-6 inline-block text-lime hover:text-lime-deep">
            Try another code
          </Link>
        </div>
      )}
    </div>
  );
}
