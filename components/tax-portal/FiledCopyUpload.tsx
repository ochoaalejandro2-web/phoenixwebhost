"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import {
  taxButtonClass,
  taxFieldClass,
} from "@/components/tax-portal/PortalChrome";
import {
  FILED_COPY_LABEL,
  MAX_UPLOAD_BYTES,
  taxBlobPrefix,
  taxReturnYears,
} from "@/lib/tax-office";
import { tTaxOffice } from "@/lib/tax-office-i18n";
import type { Locale } from "@/lib/types";

export function FiledCopyUpload({
  slug,
  clientId,
  ownerUserId,
  locale,
}: {
  slug: string;
  clientId: string;
  ownerUserId: string;
  locale: Locale;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const years = taxReturnYears();
  const [taxYear, setTaxYear] = useState(years[1] ?? years[0]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const c = tTaxOffice(locale);
  const s = c.scan;

  async function onFile(list: FileList | null) {
    if (!list || list.length === 0) return;
    const file = list[0];
    setPending(true);
    setError(null);
    setOk(null);
    try {
      if (file.size > MAX_UPLOAD_BYTES) throw new Error(s.fileTooBig);
      const pdf =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const image = file.type.startsWith("image/");
      if (!pdf && !image) throw new Error(s.usePdf);
      const pathname = `${taxBlobPrefix(clientId, ownerUserId)}filed/${taxYear}/${crypto.randomUUID()}/${file.name.replace(/[/\\]/g, "") || "return.pdf"}`;
      const blob = await upload(pathname, file, {
        access: "private",
        handleUploadUrl: `/api/tax-portal/${slug}/upload`,
        contentType: file.type || "application/pdf",
        clientPayload: JSON.stringify({
          label: FILED_COPY_LABEL,
          kind: "filed",
          taxYear,
          ownerUserId,
          filename: file.name,
        }),
        multipart: file.size > 4_500_000,
      });
      const res = await fetch(`/api/tax-portal/${slug}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: FILED_COPY_LABEL,
          kind: "filed",
          taxYear,
          ownerUserId,
          filename: file.name,
          contentType: file.type || "application/pdf",
          sizeBytes: file.size,
          pathname: blob.pathname,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(
          data.error === "unavailable" ? s.storageDown : s.saveFailed,
        );
      }
      setOk(s.uploaded);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : s.uploadFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="grid gap-4 border border-[#00FF66] p-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <p className="font-display text-xl">{c.staffFiledTitle}</p>
      <p className="text-sm text-black/70">{c.staffFiledLead}</p>
      <label className="text-sm">
        {c.yearLabel}
        <select
          className={taxFieldClass}
          value={taxYear}
          onChange={(event) => setTaxYear(Number(event.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {c.filedYear(year)}
            </option>
          ))}
        </select>
      </label>
      <input
        ref={fileRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
        className="hidden"
        disabled={pending}
        onChange={(event) => void onFile(event.target.files)}
      />
      <button
        type="button"
        className={taxButtonClass}
        disabled={pending}
        onClick={() => fileRef.current?.click()}
      >
        {pending ? s.uploading : c.uploadFiled}
      </button>
      {ok ? (
        <p role="status" className="text-sm text-[#00E840]">
          {ok}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm">
          {error}
        </p>
      ) : null}
    </form>
  );
}
