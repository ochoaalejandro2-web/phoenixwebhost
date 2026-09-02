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

  return (
    <div>
      <p className="text-sm text-ink-soft">{filename}</p>
      <p className="mt-1 font-display text-2xl tracking-wide">{code}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton value={code} label="Copy code" />
        <CopyButton value={text} label="Copy text" />
      </div>
      <p className="mt-5 text-sm text-ink">
        Click the page to drop a Sign here box. Drag to move. × deletes.
        Skip this if they can just sign under the PDF.
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        {boxes.length}/{MAX_SIGN_BOXES} boxes
        {status === "saving"
          ? " · Saving…"
          : status === "error"
            ? " · Could not save. Try again."
            : " · Saved"}
      </p>
      <div className="mt-4 max-w-3xl">
        <PdfPages
          url={`/api/admin/sign/${encodeURIComponent(id)}/file?kind=original`}
          boxes={boxes}
          mode="place"
          onBoxesChange={setBoxes}
        />
      </div>
    </div>
  );
}
