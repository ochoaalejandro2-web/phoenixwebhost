"use client";

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

let workerReady = false;

function ensureWorker() {
  if (workerReady) return;
  GlobalWorkerOptions.workerSrc = workerSrc;
  workerReady = true;
}

export async function loadPdfFromUrl(url: string): Promise<PDFDocumentProxy> {
  ensureWorker();
  const res = await fetch(url, { credentials: "same-origin", cache: "no-store" });
  if (!res.ok) throw new Error("Could not open that PDF.");
  const data = new Uint8Array(await res.arrayBuffer());
  return getDocument({ data }).promise;
}
