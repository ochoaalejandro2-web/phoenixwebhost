"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { upload } from "@vercel/blob/client";
import {
  taxButtonClass,
  taxFieldClass,
} from "@/components/tax-portal/PortalChrome";
import {
  MAX_UPLOAD_BYTES,
  TAX_DOC_LABELS,
  TAX_LABEL_COPY,
  taxBlobPrefix,
  type TaxDocLabel,
} from "@/lib/tax-office";

const MAX_IMAGE_EDGE = 1600;

async function fileToJpegBytes(file: File): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read that photo.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (next) => (next ? resolve(next) : reject(new Error("Could not convert that photo."))),
      "image/jpeg",
      0.85,
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

async function imagesToPdf(files: File[]): Promise<File> {
  const pdf = await PDFDocument.create();
  for (const file of files) {
    const jpeg = await fileToJpegBytes(file);
    const image = await pdf.embedJpg(jpeg);
    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  const bytes = await pdf.save();
  const copy = new Uint8Array(bytes);
  return new File([copy], "scan.pdf", { type: "application/pdf" });
}

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function isImage(file: File) {
  return (
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    /\.(jpe?g|png)$/i.test(file.name)
  );
}

export function ScanUpload({
  slug,
  clientId,
  userId,
}: {
  slug: string;
  clientId: string;
  userId: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState<TaxDocLabel>("W-2");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function prepareFile(list: FileList | null, fromCamera: boolean) {
    if (!list || list.length === 0) return null;
    const files = [...list];
    if (fromCamera || files.every(isImage)) {
      return imagesToPdf(files);
    }
    if (files.length === 1 && isPdf(files[0])) return files[0];
    if (files.length === 1 && isImage(files[0])) return imagesToPdf(files);
    throw new Error("Use a PDF, JPG, or PNG. On iPhone, choose JPEG if asked.");
  }

  async function send(file: File) {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error("That file is over 10 MB.");
    }
    const pathname = `${taxBlobPrefix(clientId, userId)}${crypto.randomUUID()}/${file.name.replace(/[/\\]/g, "") || "document.pdf"}`;
    const blob = await upload(pathname, file, {
      access: "private",
      handleUploadUrl: `/api/tax-portal/${slug}/upload`,
      contentType: file.type || "application/pdf",
      clientPayload: JSON.stringify({ label, filename: file.name }),
      multipart: file.size > 4_500_000,
    });
    const res = await fetch(`/api/tax-portal/${slug}/files`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label,
        filename: file.name,
        contentType: file.type || "application/pdf",
        sizeBytes: file.size,
        pathname: blob.pathname,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      throw new Error(
        data.error === "unavailable"
          ? "Document storage is not connected. This office cannot take uploads yet."
          : "Could not save that file. Try again or call the office.",
      );
    }
  }

  async function onPick(
    list: FileList | null,
    fromCamera: boolean,
    input: HTMLInputElement | null,
  ) {
    setPending(true);
    setError(null);
    setOk(null);
    try {
      const file = await prepareFile(list, fromCamera);
      if (!file) {
        setPending(false);
        return;
      }
      await send(file);
      setOk("Uploaded. Only you and this tax office can open it.");
      if (input) input.value = "";
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="grid gap-4 border border-[#00FF66] p-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <p className="font-display text-xl">Upload a document / Subir un documento</p>
      <p className="text-sm text-black/70">
        PDF, JPG, or PNG. 10 MB max. Camera photos are saved as a PDF. This is a
        private drop box, not tax software.
      </p>
      <label className="text-sm">
        Label / Etiqueta
        <select
          className={taxFieldClass}
          value={label}
          onChange={(event) => setLabel(event.target.value as TaxDocLabel)}
        >
          {TAX_DOC_LABELS.map((item) => (
            <option key={item} value={item}>
              {TAX_LABEL_COPY[item].en}
              {TAX_LABEL_COPY[item].es !== TAX_LABEL_COPY[item].en
                ? ` / ${TAX_LABEL_COPY[item].es}`
                : ""}
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
        onChange={(event) => onPick(event.target.files, false, fileRef.current)}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/jpeg,image/png"
        capture="environment"
        className="hidden"
        disabled={pending}
        onChange={(event) => onPick(event.target.files, true, cameraRef.current)}
      />
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={taxButtonClass}
          disabled={pending}
          onClick={() => fileRef.current?.click()}
        >
          {pending ? "Uploading…" : "Choose file / Elegir archivo"}
        </button>
        <button
          type="button"
          className="border border-[#00FF66] px-5 py-2 text-sm font-semibold text-black hover:bg-[#00FF66]/10 disabled:opacity-60"
          disabled={pending}
          onClick={() => cameraRef.current?.click()}
        >
          Scan with camera / Escanear
        </button>
      </div>
      {ok ? <p role="status" className="text-sm text-[#00E840]">{ok}</p> : null}
      {error ? <p role="alert" className="text-sm">{error}</p> : null}
    </form>
  );
}
