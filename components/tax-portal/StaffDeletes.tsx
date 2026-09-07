"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { taxButtonClass } from "@/components/tax-portal/PortalChrome";
import { withSiteLangPath } from "@/lib/site-locale";
import { portalPath } from "@/lib/tax-office";
import { tTaxOffice } from "@/lib/tax-office-i18n";
import type { Locale } from "@/lib/types";

export function StaffDeleteFileButton({
  slug,
  fileId,
  filename,
  locale,
}: {
  slug: string;
  fileId: string;
  filename: string;
  locale: Locale;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const c = tTaxOffice(locale);

  async function onClick() {
    if (!window.confirm(c.deleteFileConfirm(filename))) return;
    setPending(true);
    try {
      const res = await fetch(
        `/api/tax-portal/${slug}/files/${encodeURIComponent(fileId)}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(c.deleteFileFailed);
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : c.deleteFileFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={pending}
      className="font-semibold text-black underline decoration-[#00FF66] underline-offset-4 hover:text-[#00E840] disabled:opacity-60"
    >
      {pending ? c.deleting : c.deleteFile}
    </button>
  );
}

export function StaffDeleteProfile({
  slug,
  userId,
  name,
  locale,
}: {
  slug: string;
  userId: string;
  name: string;
  locale: Locale;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const c = tTaxOffice(locale);

  async function onClick() {
    if (!window.confirm(c.deleteProfileConfirm(name))) return;
    setPending(true);
    try {
      const res = await fetch(
        `/api/tax-portal/${slug}/customers/${encodeURIComponent(userId)}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(c.deleteProfileFailed);
      router.push(withSiteLangPath(portalPath(slug, "/staff"), locale));
      router.refresh();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : c.deleteProfileFailed);
      setPending(false);
    }
  }

  return (
    <div className="mt-12 border border-black p-5">
      <p className="font-display text-xl">{c.deleteProfile}</p>
      <p className="mt-2 max-w-xl text-sm text-black/75">{c.deleteProfileLead}</p>
      <button
        type="button"
        onClick={() => void onClick()}
        disabled={pending}
        className={`${taxButtonClass} mt-4 bg-black text-white hover:bg-black/85`}
      >
        {pending ? c.deleting : c.deleteProfile}
      </button>
    </div>
  );
}
