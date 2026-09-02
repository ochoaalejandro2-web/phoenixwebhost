"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CopyButton } from "@/components/admin/CopyButton";
import { MAX_SIGN_BOXES, type SignHereBox } from "@/lib/sign";

const PdfPages = dynamic(
  () => import("@/components/sign/PdfPages").then((mod) => mod.PdfPages),
  { ssr: false },
);

export function SignHereEditor({
  id,
  filename,
  code,
  text,
  initialBoxes,
}: {
  id: string;
  filename: string;
  code: string;
  text: string;
  initialBoxes: SignHereBox[];
}) {
  const [boxes, setBoxes] = useState<SignHereBox[]>(initialBoxes);
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      void (async () => {
        setStatus("saving");
        try {
          const res = await fetch(`/api/admin/sign/${encodeURIComponent(id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ boxes }),
          });
          if (!res.ok) throw new Error("save failed");
          setStatus("saved");
        } catch {
          setStatus("error");
        }
      })();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [boxes, id]);

  const saveLabel =
    status === "saving"
      ? "Saving spots…"
      : status === "error"
        ? "Could not save. Click a spot again."
        : boxes.length === 0
          ? "No spots yet · saved. Skip if they can sign under the PDF."
          : `${boxes.length} spot${boxes.length === 1 ? "" : "s"} saved`;

  return (
    <div>
      <p className="text-sm text-ink-soft">{filename}</p>
      <p className="mt-4 text-sm text-ink">
        Click the PDF to drop a Sign here spot. Click again for the next one,
        on any page. × removes a miss. Spots save as you click. The customer
        signs once — that signature is stamped on every spot.
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        {boxes.length}/{MAX_SIGN_BOXES} spots · {saveLabel}
      </p>
      <div className="mt-4 max-w-3xl">
        <PdfPages
          url={`/api/admin/sign/${encodeURIComponent(id)}/file?kind=original`}
          boxes={boxes}
          mode="place"
          onBoxesChange={setBoxes}
        />
      </div>
      <div className="mt-6 rounded-2xl border border-line bg-paper p-4">
        <p className="font-display text-2xl tracking-wide">{code}</p>
        <p className="mt-2 text-sm text-ink-soft">
          Copy the code after the spots are saved (or skip spots). Then text
          it. One code is this one document.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton value={code} label="Copy code" />
          <CopyButton value={text} label="Copy text" />
        </div>
      </div>
    </div>
  );
}
