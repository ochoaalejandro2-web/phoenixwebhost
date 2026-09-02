import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/admin/CopyButton";
import { SignHereEditor } from "@/components/admin/SignHereEditor";
import { publicSiteUrl } from "@/lib/config";
import {
  formatSignCode,
  publicSignStatus,
  signPublicPath,
  signTextMessage,
} from "@/lib/sign";
import { getSignDocument } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminSignDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getSignDocument(id);
  if (!doc) notFound();
  const root = publicSiteUrl().replace(/\/$/, "");
  const code = formatSignCode(doc.code);
  const pending = publicSignStatus(doc) === "pending";
  const path = signPublicPath(doc.code);

  return (
    <div>
      <Link className="text-sm text-clay" href="/admin/sign">
        ← Sign a PDF
      </Link>
      <h1 className="mt-3 font-display text-3xl">Mark Sign here spots</h1>
      {pending ? (
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Click the preview to drop spots. Pull a corner to resize. The
          customer signs once. Copy the code after the spots save.
        </p>
      ) : null}
      {pending ? (
        <SignHereEditor
          id={doc.id}
          filename={doc.filename}
          code={code}
          text={signTextMessage(doc.code, root)}
          initialBoxes={doc.boxes || []}
        />
      ) : (
        <div className="mt-4">
          <p className="font-display text-2xl tracking-wide">{code}</p>
          <p className="mt-2 text-sm text-ink-soft">
            This document is already signed. Spots cannot be moved.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton value={code} label="Copy code" />
            {doc.status === "signed" ? (
              <a
                className="rounded-full bg-sage px-3 py-1.5 text-sm font-semibold text-white"
                href={`/api/admin/sign/${doc.id}/file?kind=signed`}
              >
                Download signed
              </a>
            ) : null}
          </div>
        </div>
      )}
      {pending ? (
        <p className="mt-6 text-sm">
          Customer:{" "}
          <a className="text-clay" href={`${root}${path}`} target="_blank" rel="noreferrer">
            {path}
          </a>
        </p>
      ) : null}
    </div>
  );
}
