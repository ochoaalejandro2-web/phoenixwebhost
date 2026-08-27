"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { upload } from "@vercel/blob/client";
import {
  taxButtonClass,
  taxFieldClass,
} from "@/components/tax-portal/PortalChrome";
import {
  MAX_SCAN_PAGES,
  MAX_UPLOAD_BYTES,
  TAX_DOC_LABELS,
  scanPdfFilename,
  taxBlobPrefix,
  type TaxDocLabel,
} from "@/lib/tax-office";
import { tTaxOffice, taxDocLabel } from "@/lib/tax-office-i18n";
import type { Locale } from "@/lib/types";

const MAX_IMAGE_EDGE = 1600;
const JPEG_QUALITY = 0.85;

type ScanPage = { id: string; file: File; preview: string };

const ghostButtonClass =
  "border border-[#00FF66] px-5 py-2 text-sm font-semibold text-black hover:bg-[#00FF66]/10 disabled:opacity-60";

async function fileToJpegBytes(
  file: File,
  errors: { read: string; convert: string },
): Promise<Uint8Array> {
  let source: CanvasImageSource;
  let width: number;
  let height: number;
  try {
    const bitmap = await createImageBitmap(file);
    source = bitmap;
    width = bitmap.width;
    height = bitmap.height;
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const node = new Image();
        node.onload = () => resolve(node);
        node.onerror = () => reject(new Error(errors.read));
        node.src = url;
      });
      source = image;
      width = image.naturalWidth;
      height = image.naturalHeight;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error(errors.read);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(source, 0, 0, w, h);
  if ("close" in source && typeof source.close === "function") source.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (next) =>
        next ? resolve(next) : reject(new Error(errors.convert)),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

async function imagesToPdf(
  files: File[],
  filename: string,
  errors: { read: string; convert: string },
): Promise<File> {
  const pdf = await PDFDocument.create();
  for (const file of files) {
    const jpeg = await fileToJpegBytes(file, errors);
    const image = await pdf.embedJpg(jpeg);
    const landscape = image.width > image.height;
    const pageWidth = landscape ? 792 : 612;
    const pageHeight = landscape ? 612 : 792;
    const margin = 24;
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;
    const scale = Math.min(maxW / image.width, maxH / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    const page = pdf.addPage([pageWidth, pageHeight]);
    page.drawImage(image, {
      x: (pageWidth - w) / 2,
      y: (pageHeight - h) / 2,
      width: w,
      height: h,
    });
  }
  const bytes = await pdf.save();
  return new File([new Uint8Array(bytes)], filename, { type: "application/pdf" });
}

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function isImage(file: File) {
  return (
    file.type.startsWith("image/") ||
    /\.(jpe?g|png|heic|heif|webp)$/i.test(file.name)
  );
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function ScanUpload({
  slug,
  clientId,
  userId,
  locale,
}: {
  slug: string;
  clientId: string;
  userId: string;
  locale: Locale;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pagesRef = useRef<ScanPage[]>([]);
  const [label, setLabel] = useState<TaxDocLabel>("W-2");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [pages, setPages] = useState<ScanPage[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  useEffect(() => {
    return () => {
      stopStream(streamRef.current);
      pagesRef.current.forEach((page) => URL.revokeObjectURL(page.preview));
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
    void video.play().catch(() => undefined);
  }, [stream]);

  function resetPages(next: ScanPage[] = []) {
    setPages((current) => {
      current.forEach((page) => URL.revokeObjectURL(page.preview));
      return next;
    });
  }

  function closeScan() {
    stopStream(stream);
    setStream(null);
    setScanning(false);
    resetPages();
  }

  async function startLiveCamera() {
    if (!navigator.mediaDevices?.getUserMedia) return false;
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1440 },
        },
      });
      setStream(media);
      return true;
    } catch {
      return false;
    }
  }

  function openNativeCamera() {
    const input = cameraRef.current;
    if (!input) return;
    input.value = "";
    input.click();
  }

  function beginScan() {
    setError(null);
    setOk(null);
    setScanning(true);
    resetPages();
    const phone = window.matchMedia?.("(pointer: coarse)").matches;
    if (phone) {
      openNativeCamera();
      return;
    }
    void startLiveCamera();
  }

  function addPage(file: File) {
    setPages((current) => {
      if (current.length >= MAX_SCAN_PAGES) return current;
      return [
        ...current,
        {
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
        },
      ];
    });
  }

  const pageCount = pages.length;
  const canAdd = pageCount < MAX_SCAN_PAGES;
  const s = tTaxOffice(locale).scan;
  const photoErrors = { read: s.readPhoto, convert: s.convertPhoto };

  async function captureLiveFrame() {
    const video = videoRef.current;
    if (!video || video.videoWidth < 2) {
      setError(s.cameraNotReady);
      return;
    }
    if (pages.length >= MAX_SCAN_PAGES) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (next) =>
          next ? resolve(next) : reject(new Error(s.captureFailed)),
        "image/jpeg",
        JPEG_QUALITY,
      );
    });
    addPage(new File([blob], "page.jpg", { type: "image/jpeg" }));
  }

  function removePage(id: string) {
    setPages((current) => {
      const found = current.find((page) => page.id === id);
      if (found) URL.revokeObjectURL(found.preview);
      return current.filter((page) => page.id !== id);
    });
  }

  async function send(file: File) {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error(s.fileTooBig);
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
        data.error === "unavailable" ? s.storageDown : s.saveFailed,
      );
    }
  }

  async function saveScan() {
    if (pages.length < 1) {
      setError(s.needPhoto);
      return;
    }
    setPending(true);
    setError(null);
    setOk(null);
    try {
      const filename = scanPdfFilename(label);
      const pdf = await imagesToPdf(
        pages.slice(0, MAX_SCAN_PAGES).map((page) => page.file),
        filename,
        photoErrors,
      );
      await send(pdf);
      setOk(s.saved(pages.length));
      closeScan();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : s.scanFailed);
    } finally {
      setPending(false);
    }
  }

  async function onDesktopFile(list: FileList | null) {
    if (!list || list.length === 0) return;
    setPending(true);
    setError(null);
    setOk(null);
    try {
      const file = list[0];
      let outgoing = file;
      if (isImage(file)) {
        outgoing = await imagesToPdf([file], scanPdfFilename(label), photoErrors);
      } else if (!isPdf(file)) {
        throw new Error(s.usePdf);
      }
      await send(outgoing);
      setOk(s.uploaded);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : s.uploadFailed);
    } finally {
      setPending(false);
    }
  }

  function onNativePhoto(list: FileList | null) {
    if (!list || list.length === 0) return;
    const file = list[0];
    if (!isImage(file) && !file.type.startsWith("image/")) {
      setError(s.cameraPhoto);
      return;
    }
    addPage(file);
    if (cameraRef.current) cameraRef.current.value = "";
  }

  return (
    <form
      className="grid gap-4 border border-[#00FF66] p-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <p className="font-display text-xl">{s.title}</p>
      <p className="text-sm text-black/70">{s.lead(MAX_SCAN_PAGES)}</p>
      <label className="text-sm">
        {s.label}
        <select
          className={taxFieldClass}
          value={label}
          onChange={(event) => setLabel(event.target.value as TaxDocLabel)}
        >
          {TAX_DOC_LABELS.map((item) => (
            <option key={item} value={item}>
              {taxDocLabel(item, locale)}
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
        onChange={(event) => onDesktopFile(event.target.files)}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={pending}
        onChange={(event) => onNativePhoto(event.target.files)}
      />

      {!scanning ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={taxButtonClass}
            disabled={pending}
            onClick={() => fileRef.current?.click()}
          >
            {pending ? s.uploading : s.chooseFile}
          </button>
          <button
            type="button"
            className={ghostButtonClass}
            disabled={pending}
            onClick={beginScan}
          >
            {s.scanDocument}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 border border-[#00FF66] p-4">
          <p className="text-sm font-semibold">
            {s.scanProgress(pageCount, MAX_SCAN_PAGES)}
          </p>
          {stream ? (
            <div className="grid gap-3">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-[3/4] w-full bg-black object-cover"
              />
              <button
                type="button"
                className={taxButtonClass}
                disabled={pending || !canAdd}
                onClick={() => void captureLiveFrame()}
              >
                {canAdd ? s.takePhoto : s.pageLimit}
              </button>
            </div>
          ) : (
            <p className="text-sm text-black/70">{s.phoneHint}</p>
          )}
          {pageCount > 0 ? (
            <ul className="grid grid-cols-5 gap-2">
              {pages.map((page, index) => (
                <li key={page.id} className="relative border border-[#00FF66]">
                  {/* preview is a local object URL from this session, not a stored blob */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.preview}
                    alt={s.pageAlt(index + 1)}
                    className="aspect-[3/4] w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 bg-black px-1.5 text-xs text-white"
                    onClick={() => removePage(page.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {!stream ? (
              <button
                type="button"
                className={ghostButtonClass}
                disabled={pending || !canAdd}
                onClick={openNativeCamera}
              >
                {pageCount === 0
                  ? s.openCamera
                  : canAdd
                    ? s.addPage
                    : s.pageLimit}
              </button>
            ) : null}
            <button
              type="button"
              className={taxButtonClass}
              disabled={pending || pageCount < 1}
              onClick={() => void saveScan()}
            >
              {pending ? s.saving : s.savePdf}
            </button>
            <button
              type="button"
              className="text-sm font-semibold hover:text-[#00E840]"
              disabled={pending}
              onClick={closeScan}
            >
              {s.cancel}
            </button>
          </div>
        </div>
      )}
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

