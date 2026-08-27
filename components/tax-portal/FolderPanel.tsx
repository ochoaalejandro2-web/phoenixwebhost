import {
  LogoutForm,
  PortalChrome,
} from "@/components/tax-portal/PortalChrome";
import { ScanUpload } from "@/components/tax-portal/ScanUpload";
import { TAX_LABEL_COPY, type TaxDocLabel } from "@/lib/tax-office";
import type { TaxFileRow } from "@/lib/tax-db";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileTable({
  slug,
  files,
}: {
  slug: string;
  files: TaxFileRow[];
}) {
  if (files.length === 0) {
    return (
      <p className="text-sm text-black/70">
        No documents in this folder yet. / Aún no hay documentos.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-[#00FF66] border border-[#00FF66]">
      {files.map((file) => {
        const label = file.label as TaxDocLabel;
        const copy = TAX_LABEL_COPY[label] || { en: file.label, es: file.label };
        return (
          <li
            key={file.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold">
                {copy.en}
                {copy.es !== copy.en ? ` / ${copy.es}` : ""} · {file.filename}
              </p>
              <p className="text-black/70">
                {formatBytes(file.sizeBytes)} · {fmt(file.createdAt)}
              </p>
            </div>
            <a
              href={`/api/tax-portal/${slug}/files/${file.id}`}
              className="font-semibold text-[#00E840] hover:text-[#00FF66]"
            >
              Download / Descargar
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function FolderPanel({
  slug,
  clientName,
  clientId,
  userId,
  files,
  storageReady,
  blobReady,
}: {
  slug: string;
  clientName: string;
  clientId: string;
  userId: string;
  files: TaxFileRow[];
  storageReady: boolean;
  blobReady: boolean;
}) {
  return (
    <>
      <h1 className="font-display text-3xl tracking-tight">Your folder / Su carpeta</h1>
      <p className="mt-2 max-w-2xl text-sm text-black/80">
        Documents you upload here stay in a private folder at {clientName}. Only
        you and this tax office can open them. This is not tax-prep software —
        just a secure drop box.
      </p>
      {!storageReady || !blobReady ? (
        <p role="alert" className="mt-4 border border-black px-4 py-3 text-sm">
          Document storage is not connected. This office cannot take uploads
          yet. Call the office.
        </p>
      ) : (
        <div className="mt-8">
          <ScanUpload slug={slug} clientId={clientId} userId={userId} />
        </div>
      )}
      <h2 className="mt-10 font-display text-xl">Files / Archivos</h2>
      <div className="mt-4">
        <FileTable slug={slug} files={files} />
      </div>
    </>
  );
}

export { LogoutForm, PortalChrome };
