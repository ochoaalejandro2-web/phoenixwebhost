"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignDeleteButton({
  id,
  filename,
}: {
  id: string;
  filename: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (
      !window.confirm(
        `Delete ${filename} and its code? The PDFs will be removed and that code will stop working.`,
      )
    ) {
      return;
    }
    setPending(true);
    try {
      const res = await fetch(`/api/admin/sign/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Could not delete that document.");
      }
      router.refresh();
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Could not delete that document.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={pending}
      className="rounded-full border border-mesa/40 px-3 py-1.5 text-sm text-mesa hover:bg-mesa hover:text-white disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
