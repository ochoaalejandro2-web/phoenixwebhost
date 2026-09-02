"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  MAX_SIGN_BOXES,
  newSignBox,
  resizeSignBox,
  type SignBoxCorner,
  type SignHereBox,
} from "@/lib/sign";
import { loadPdfFromUrl } from "@/components/sign/loadPdf";

const CORNERS: Array<{
  corner: SignBoxCorner;
  className: string;
  label: string;
}> = [
  {
    corner: "nw",
    className: "left-0 top-0 cursor-nwse-resize",
    label: "Resize top left",
  },
  {
    corner: "ne",
    className: "right-0 top-0 cursor-nesw-resize",
    label: "Resize top right",
  },
  {
    corner: "sw",
    className: "bottom-0 left-0 cursor-nesw-resize",
    label: "Resize bottom left",
  },
  {
    corner: "se",
    className: "bottom-0 right-0 cursor-nwse-resize",
    label: "Resize bottom right",
  },
];

export function PdfPages({
  url,
  boxes,
  mode,
  onBoxesChange,
}: {
  url: string;
  boxes: SignHereBox[];
  mode: "view" | "place";
  onBoxesChange?: (boxes: SignHereBox[]) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ratios, setRatios] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const drag = useRef<
    | { kind: "move"; id: string; dx: number; dy: number }
    | {
        kind: "resize";
        id: string;
        corner: SignBoxCorner;
        start: SignHereBox;
      }
    | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    pdfRef.current = null;
    setPageCount(0);
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const pdf = await loadPdfFromUrl(url);
        if (cancelled) return;
        pdfRef.current = pdf;
        const nextRatios: number[] = [];
        for (let i = 1; i <= pdf.numPages; i += 1) {
          const page = await pdf.getPage(i);
          const base = page.getViewport({ scale: 1 });
          nextRatios.push(base.height / base.width);
        }
        if (cancelled) return;
        canvasRefs.current = Array.from({ length: pdf.numPages }, () => null);
        setRatios(nextRatios);
        setPageCount(pdf.numPages);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not open that PDF.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    const pdf = pdfRef.current;
    if (!pdf || pageCount === 0) return;
    let cancelled = false;
    let timer: number | null = null;

    async function draw() {
      const doc = pdfRef.current;
      const width = hostRef.current?.clientWidth || 600;
      if (!doc || width < 32 || cancelled) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (let i = 1; i <= doc.numPages; i += 1) {
        const canvas = canvasRefs.current[i - 1];
        if (!canvas) continue;
        const page = await doc.getPage(i);
        if (cancelled) return;
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: (width / base.width) * dpr });
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${(width * base.height) / base.width}px`;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        await page.render({ canvasContext: ctx, viewport }).promise;
      }
    }

    void draw();
    const host = hostRef.current;
    const observer =
      host &&
      new ResizeObserver(() => {
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          void draw();
        }, 160);
      });
    if (host && observer) observer.observe(host);
    return () => {
      cancelled = true;
      observer?.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [pageCount, url]);

  function fractionAt(pageEl: HTMLElement, clientX: number, clientY: number) {
    const rect = pageEl.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  }

  function onPagePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    page: number,
  ) {
    if (mode !== "place" || !onBoxesChange) return;
    if ((event.target as HTMLElement).closest("[data-sign-box]")) return;
    if (boxes.length >= MAX_SIGN_BOXES) return;
    const at = fractionAt(event.currentTarget, event.clientX, event.clientY);
    onBoxesChange([...boxes, newSignBox(page, at.x, at.y)]);
  }

  function onBoxPointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    box: SignHereBox,
    pageEl: HTMLDivElement,
  ) {
    if (mode !== "place" || !onBoxesChange) return;
    if ((event.target as HTMLElement).closest("button")) return;
    if ((event.target as HTMLElement).closest("[data-resize]")) return;
    event.preventDefault();
    event.stopPropagation();
    const at = fractionAt(pageEl, event.clientX, event.clientY);
    drag.current = {
      kind: "move",
      id: box.id,
      dx: at.x - box.x,
      dy: at.y - box.y,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* synthetic pointer events */
    }
  }

  function onBoxPointerMove(
    event: React.PointerEvent<HTMLDivElement>,
    box: SignHereBox,
    pageEl: HTMLDivElement,
  ) {
    if (mode !== "place" || !onBoxesChange || !drag.current) return;
    if (drag.current.kind !== "move" || drag.current.id !== box.id) return;
    const at = fractionAt(pageEl, event.clientX, event.clientY);
    const x = Math.min(1 - box.w, Math.max(0, at.x - drag.current.dx));
    const y = Math.min(1 - box.h, Math.max(0, at.y - drag.current.dy));
    onBoxesChange(
      boxes.map((row) => (row.id === box.id ? { ...row, x, y } : row)),
    );
  }

  function onBoxPointerUp() {
    drag.current = null;
  }

  function onResizePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    box: SignHereBox,
    corner: SignBoxCorner,
  ) {
    if (mode !== "place" || !onBoxesChange) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current = {
      kind: "resize",
      id: box.id,
      corner,
      start: box,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* synthetic pointer events */
    }
  }

  function onResizePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (mode !== "place" || !onBoxesChange || !drag.current) return;
    if (drag.current.kind !== "resize") return;
    const pageEl = event.currentTarget.closest(
      "[data-sign-page]",
    ) as HTMLDivElement | null;
    if (!pageEl) return;
    const { id, corner, start } = drag.current;
    const at = fractionAt(pageEl, event.clientX, event.clientY);
    const next = resizeSignBox(start, corner, at.x, at.y);
    onBoxesChange(boxes.map((row) => (row.id === id ? next : row)));
  }

  function removeBox(id: string) {
    if (!onBoxesChange) return;
    onBoxesChange(boxes.filter((box) => box.id !== id));
  }

  return (
    <div ref={hostRef} className="w-full">
      {loading ? (
        <p className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-body">
          Loading PDF…
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="rounded-2xl border border-zinc-200 px-4 py-6 text-sm text-lime-deep"
        >
          {error} Use Open PDF if you still need to read it.
        </p>
      ) : null}
      {Array.from({ length: pageCount }, (_, index) => {
        const ratio = ratios[index] || 1.294;
        const pageBoxes = boxes.filter((box) => box.page === index);
        return (
          <div
            key={`page-${index}`}
            className={`relative mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white first:mt-0 ${
              mode === "place" ? "cursor-crosshair" : ""
            }`}
            data-sign-page={index}
            style={{ aspectRatio: `1 / ${ratio}` }}
            onPointerDown={(event) => onPagePointerDown(event, index)}
          >
            <canvas
              ref={(node) => {
                canvasRefs.current[index] = node;
              }}
              className="block h-full w-full"
              aria-label={`PDF page ${index + 1}`}
            />
            {pageBoxes.map((box) => (
              <div
                key={box.id}
                data-sign-box={box.id}
                className={`absolute rounded-md border-2 border-[#00c851] bg-[#00c851]/20 ${
                  mode === "place"
                    ? "cursor-grab active:cursor-grabbing"
                    : "pointer-events-none"
                }`}
                style={{
                  left: `${box.x * 100}%`,
                  top: `${box.y * 100}%`,
                  width: `${box.w * 100}%`,
                  height: `${box.h * 100}%`,
                  touchAction: mode === "place" ? "none" : undefined,
                }}
                onPointerDown={(event) =>
                  onBoxPointerDown(
                    event,
                    box,
                    event.currentTarget.parentElement as HTMLDivElement,
                  )
                }
                onPointerMove={(event) =>
                  onBoxPointerMove(
                    event,
                    box,
                    event.currentTarget.parentElement as HTMLDivElement,
                  )
                }
                onPointerUp={onBoxPointerUp}
                onPointerCancel={onBoxPointerUp}
              >
                <span className="pointer-events-none absolute left-1 top-0.5 max-w-[70%] truncate text-[10px] font-semibold uppercase tracking-wide text-[#00b34a] sm:text-xs">
                  Sign here
                </span>
                {mode === "place" ? (
                  <>
                    <button
                      type="button"
                      aria-label="Delete sign here box"
                      className="absolute left-1/2 top-0 z-20 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-white text-sm text-[#0a0a0a] shadow"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeBox(box.id);
                      }}
                      onPointerDown={(event) => event.stopPropagation()}
                    >
                      ×
                    </button>
                    {CORNERS.map((handle) => (
                      <div
                        key={handle.corner}
                        data-resize={handle.corner}
                        aria-label={handle.label}
                        className={`absolute z-10 flex h-7 w-7 items-center justify-center ${handle.className}`}
                        style={{ touchAction: "none" }}
                        onPointerDown={(event) =>
                          onResizePointerDown(event, box, handle.corner)
                        }
                        onPointerMove={onResizePointerMove}
                        onPointerUp={onBoxPointerUp}
                        onPointerCancel={onBoxPointerUp}
                      >
                        <span className="pointer-events-none block h-3 w-3 rounded-[2px] border border-white bg-[#00c851] shadow" />
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
