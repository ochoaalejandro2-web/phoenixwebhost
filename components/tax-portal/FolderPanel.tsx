import {
  LogoutForm,
  PortalChrome,
} from "@/components/tax-portal/PortalChrome";
import { ScanUpload } from "@/components/tax-portal/ScanUpload";
import { StaffDeleteFileButton } from "@/components/tax-portal/StaffDeletes";
import { dateLocale, tTaxOffice, taxDocLabel } from "@/lib/tax-office-i18n";
import { splitTaxFiles, taxReturnYears } from "@/lib/tax-office";
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
  empty,
  canDelete,
}: {
  slug: string;
  files: TaxFileRow[];
  locale: Locale;
  empty?: string;
  canDelete?: boolean;
}) {
  const c = tTaxOffice(locale);
  if (files.length === 0) {
    return <p className="text-sm text-black/70">{empty || c.emptyFolder}</p>;
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
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`/api/tax-portal/${slug}/files/${file.id}`}
              className="font-semibold text-[#00E840] hover:text-[#00FF66]"
            >
              {c.download}
            </a>
            {canDelete ? (
              <StaffDeleteFileButton
                slug={slug}
                fileId={file.id}
                filename={file.filename}
                locale={locale}
              />
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function YearFolders({
  slug,
  files,
  locale,
  canDelete,
}: {
  slug: string;
  files: TaxFileRow[];
  locale: Locale;
  canDelete?: boolean;
}) {
  const c = tTaxOffice(locale);
  const years = taxReturnYears();
  const grouped = splitTaxFiles(files, years);
  return (
    <div className="grid gap-6">
      {grouped.byYear.map((bucket) => (
        <section key={bucket.year}>
          <h3 className="font-display text-lg">{c.filedYear(bucket.year)}</h3>
          <div className="mt-3">
            <FileTable
              slug={slug}
              files={bucket.files}
              locale={locale}
              empty={c.emptyYear}
              canDelete={canDelete}
            />
          </div>
        </section>
      ))}
      {grouped.otherYears.length ? (
        <section>
          <h3 className="font-display text-lg">{c.filedTitle}</h3>
          <div className="mt-3">
            <FileTable
              slug={slug}
              files={grouped.otherYears}
              locale={locale}
              canDelete={canDelete}
            />
          </div>
        </section>
      ) : null}
    </div>
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
  const grouped = splitTaxFiles(files, taxReturnYears());
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
        <FileTable slug={slug} files={grouped.intake} locale={locale} />
      </div>
      <h2 className="mt-10 font-display text-xl">{c.filedTitle}</h2>
      <p className="mt-2 max-w-2xl text-sm text-black/80">{c.filedLead}</p>
      <div className="mt-4">
        <YearFolders slug={slug} files={files} locale={locale} />
      </div>
    </>
  );
}

export { LogoutForm, PortalChrome };
