import {
  LogoutForm,
  PortalChrome,
} from "@/components/tax-portal/PortalChrome";
import { ScanUpload } from "@/components/tax-portal/ScanUpload";
import { dateLocale, tTaxOffice, taxDocLabel } from "@/lib/tax-office-i18n";
import type { TaxFileRow } from "@/lib/tax-db";
import type { Locale } from "@/lib/types";

function fmt(iso: string, locale: Locale) {
  return new Date(iso).toLocaleString(dateLocale(locale), {
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
  locale,
}: {
  slug: string;
  files: TaxFileRow[];
  locale: Locale;
}) {
  const c = tTaxOffice(locale);
  if (files.length === 0) {
    return <p className="text-sm text-black/70">{c.emptyFolder}</p>;
  }
  return (
    <ul className="divide-y divide-[#00FF66] border border-[#00FF66]">
      {files.map((file) => (
        <li
          key={file.id}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
        >
          <div>
            <p className="font-semibold">
              {taxDocLabel(file.label, locale)} · {file.filename}
            </p>
            <p className="text-black/70">
              {formatBytes(file.sizeBytes)} · {fmt(file.createdAt, locale)}
            </p>
          </div>
          <a
            href={`/api/tax-portal/${slug}/files/${file.id}`}
            className="font-semibold text-[#00E840] hover:text-[#00FF66]"
          >
            {c.download}
          </a>
        </li>
      ))}
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
  locale,
}: {
  slug: string;
  clientName: string;
  clientId: string;
  userId: string;
  files: TaxFileRow[];
  storageReady: boolean;
  blobReady: boolean;
  locale: Locale;
}) {
  const c = tTaxOffice(locale);
  return (
    <>
      <h1 className="font-display text-3xl tracking-tight">{c.folderTitle}</h1>
      <p className="mt-2 max-w-2xl text-sm text-black/80">
        {c.folderLead(clientName)}
      </p>
      {!storageReady || !blobReady ? (
        <p role="alert" className="mt-4 border border-black px-4 py-3 text-sm">
          {c.storageDown}
        </p>
      ) : (
        <div className="mt-8">
          <ScanUpload
            slug={slug}
            clientId={clientId}
            userId={userId}
            locale={locale}
          />
        </div>
      )}
      <h2 className="mt-10 font-display text-xl">{c.filesTitle}</h2>
      <div className="mt-4">
        <FileTable slug={slug} files={files} locale={locale} />
      </div>
    </>
  );
}

export { LogoutForm, PortalChrome };
