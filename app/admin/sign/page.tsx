import Link from "next/link";
import { CopyButton } from "@/components/admin/CopyButton";
import { SignDeleteButton } from "@/components/admin/SignDeleteButton";
import { SignUpload } from "@/components/admin/SignUpload";
import { publicSiteUrl } from "@/lib/config";
import {
  formatPhoenixStamp,
  formatSignCode,
  publicSignStatus,
  signPublicPath,
  signTextMessage,
} from "@/lib/sign";
import { signBlobReady, signFilesMode } from "@/lib/sign-files";
import { listSignDocuments } from "@/lib/store";
import type { SignDocument } from "@/lib/types";

export const dynamic = "force-dynamic";

function fmt(iso: string | null) {
  if (!iso) return "—";
  return formatPhoenixStamp(new Date(iso));
}

function SignCard({
  doc,
  root,
}: {
  doc: SignDocument;
  root: string;
}) {
  const code = formatSignCode(doc.code);
  const path = signPublicPath(doc.code);
  const status = publicSignStatus(doc);
  const pending = status === "pending";
  const expired = status === "expired";
  return (
    <li className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl">{doc.filename}</p>
          <p className="mt-1 font-display text-2xl tracking-wide">{code}</p>
          <p className="mt-2 text-sm text-ink-soft">
            {status === "signed"
              ? `Signed by ${doc.signerName || "Signature"} · ${fmt(doc.signedAt)}`
              : expired
                ? `Expired · was due ${fmt(doc.expiresAt)}`
                : `Pending · expires ${fmt(doc.expiresAt)}`}
          </p>
          {pending ? (
            <p className="mt-2 text-sm">
              Customer:{" "}
              <a className="text-clay" href={`${root}${path}`} target="_blank" rel="noreferrer">
                {path}
              </a>
            </p>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">
              That code no longer accepts a signature.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {pending ? (
            <>
              <CopyButton value={code} label="Copy code" />
              <CopyButton value={signTextMessage(doc.code, root)} label="Copy text" />
              <a
                className="rounded-full border border-line px-3 py-1.5 text-sm"
                href={`/admin/sign/${doc.id}`}
              >
                {doc.boxes?.length
                  ? `Sign here boxes (${doc.boxes.length})`
                  : "Sign here boxes"}
              </a>
            </>
          ) : null}
          {doc.status === "signed" ? (
            <a
              className="rounded-full bg-sage px-3 py-1.5 text-sm font-semibold text-white"
              href={`/api/admin/sign/${doc.id}/file?kind=signed`}
            >
              Download signed
            </a>
          ) : null}
          <a
            className="rounded-full border border-line px-3 py-1.5 text-sm"
            href={`/api/admin/sign/${doc.id}/file?kind=original`}
          >
            Original
          </a>
          <SignDeleteButton id={doc.id} filename={doc.filename} />
        </div>
      </div>
    </li>
  );
}

export default async function AdminSignPage() {
  const docs = await listSignDocuments();
  const pending = docs.filter((doc) => publicSignStatus(doc) === "pending");
  const signed = docs.filter((doc) => doc.status === "signed");
  const expired = docs.filter((doc) => publicSignStatus(doc) === "expired");
  const mode = signFilesMode();
  const root = publicSiteUrl().replace(/\/$/, "");

  return (
    <div>
      <h1 className="font-display text-3xl">Sign a PDF</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Upload one PDF, text the short code, and download the signed file.
        Customers open{" "}
        <Link className="text-clay" href="/sign">
          /sign
        </Link>{" "}
        with no account. One code is one document. After it is signed, that
        code cannot be used again. Optional: drop Sign here boxes on the PDF
        so they know where to sign. Delete removes the PDFs and the code.
      </p>
      {mode === "none" ? (
        <p className="mt-4 rounded-xl bg-[#f6e2c8] px-4 py-3 text-sm">
          Set <code>BLOB_READ_WRITE_TOKEN</code> on Vercel so PDFs can be
          stored privately. They are not put in a public folder.
        </p>
      ) : (
        <p className="mt-4 text-sm text-ink-soft">
          Files are private
          {signBlobReady() ? " (Vercel Blob)" : " (this machine)"}. Not a
          public folder.
        </p>
      )}

      <div className="mt-6">
        <SignUpload blobReady={signBlobReady()} />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Pending</h2>
        <ul className="mt-4 space-y-3">
          {pending.length === 0 ? (
            <li className="rounded-2xl border border-line bg-paper p-5 text-sm text-ink-soft">
              No PDFs waiting for a signature.
            </li>
          ) : (
            pending.map((doc) => (
              <SignCard key={doc.id} doc={doc} root={root} />
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Signed</h2>
        <ul className="mt-4 space-y-3">
          {signed.length === 0 ? (
            <li className="rounded-2xl border border-line bg-paper p-5 text-sm text-ink-soft">
              No signed PDFs yet.
            </li>
          ) : (
            signed.map((doc) => (
              <SignCard key={doc.id} doc={doc} root={root} />
            ))
          )}
        </ul>
      </section>

      {expired.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Expired</h2>
          <ul className="mt-4 space-y-3">
            {expired.map((doc) => (
              <SignCard key={doc.id} doc={doc} root={root} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
