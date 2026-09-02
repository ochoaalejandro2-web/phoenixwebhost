"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { SignHereEditor } from "@/components/admin/SignHereEditor";
import { MAX_SIGN_PDF_BYTES, signBlobPath } from "@/lib/sign";

export function SignUpload({ blobReady }: { blobReady: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{
    id: string;
    code: string;
    filename: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!created) return;
    document.getElementById("sign-here-preview")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [created]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setError("Choose a PDF first.");
      return;
    }
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("Upload a PDF.");
      return;
    }
    if (file.size > MAX_SIGN_PDF_BYTES) {
      setError("That PDF is too large (10 MB max).");
      return;
    }

    setPending(true);
    setError(null);
    setCreated(null);
    try {
      let res: Response;
      if (blobReady) {
        const blob = await upload(
          signBlobPath(crypto.randomUUID(), "original"),
          file,
          {
            access: "private",
            handleUploadUrl: "/api/admin/sign/upload",
            contentType: "application/pdf",
            multipart: file.size > 4_500_000,
            clientPayload: JSON.stringify({
              filename: file.name,
              sizeBytes: file.size,
            }),
          },
        );
        res = await fetch("/api/admin/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            pathname: blob.pathname,
            sizeBytes: file.size,
          }),
        });
      } else {
        const data = new FormData();
        data.set("file", file);
        res = await fetch("/api/admin/sign", { method: "POST", body: data });
      }
      const payload = (await res.json().catch(() => ({}))) as {
        id?: string;
        code?: string;
        filename?: string;
        path?: string;
        text?: string;
        error?: string;
      };
      if (!res.ok) {
        if (payload.error === "unavailable") {
          throw new Error(
            "File storage is not ready. Set BLOB_READ_WRITE_TOKEN on Vercel.",
          );
        }
        throw new Error("Could not save that PDF.");
      }
      if (!payload.code || !payload.text || !payload.id) {
        throw new Error("Could not save that PDF.");
      }
      setCreated({
        id: payload.id,
        code: payload.code,
        filename: payload.filename || file.name,
        text: payload.text,
      });
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={(event) => void onSubmit(event)}
        className="rounded-2xl border border-line bg-paper p-5"
      >
        <p className="font-display text-xl">Upload a PDF</p>
        <p className="mt-1 text-sm text-ink-soft">
          After upload you see the pages. Click to drop Sign here spots, then
          copy the code. The customer signs once at /sign — no login. That
          one signature is stamped on every spot.
        </p>
        <label className="mt-4 block text-sm">
          PDF
          <input
            name="file"
            type="file"
            accept="application/pdf,.pdf"
            required
            disabled={pending}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-4 rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Upload and mark spots"}
        </button>
        {error ? (
          <p role="alert" className="mt-3 text-sm text-mesa">
            {error}
          </p>
        ) : null}
      </form>
      {created ? (
        <div
          id="sign-here-preview"
          className="mt-4 rounded-2xl border border-line bg-paper p-5"
        >
          <p className="font-display text-xl">Mark Sign here spots</p>
          <div className="mt-4">
            <SignHereEditor
              id={created.id}
              filename={created.filename}
              code={created.code}
              text={created.text}
              initialBoxes={[]}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
