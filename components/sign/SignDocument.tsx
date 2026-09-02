"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { SignHereBox } from "@/lib/sign";

const PdfPages = dynamic(
  () => import("@/components/sign/PdfPages").then((mod) => mod.PdfPages),
  { ssr: false },
);

export function SignDocument({
  code,
  filename,
  boxes = [],
}: {
  code: string;
  filename: string;
  boxes?: SignHereBox[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(false);
  const [name, setName] = useState("");
  const [ack, setAck] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const hasBoxes = boxes.length > 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    function size() {
      const node = canvasRef.current;
      const box = parent;
      if (!node || !box) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, box.clientWidth);
      const height = 180;
      node.width = Math.round(width * dpr);
      node.height = Math.round(height * dpr);
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      const ctx = node.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "#0a0a0a";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      setHasInk(false);
    }

    size();
    window.addEventListener("resize", size);
    const block = (event: TouchEvent) => {
      event.preventDefault();
    };
    canvas.addEventListener("touchmove", block, { passive: false });
    return () => {
      window.removeEventListener("resize", size);
      canvas.removeEventListener("touchmove", block);
    };
  }, []);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext("2d");
    const at = point(event);
    if (!ctx || !at) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    ctx.beginPath();
    ctx.moveTo(at.x, at.y);
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    const at = point(event);
    if (!ctx || !at) return;
    ctx.lineTo(at.x, at.y);
    ctx.stroke();
    setHasInk(true);
  }

  function onPointerUp() {
    drawing.current = false;
  }

  function clearPad() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasInk(false);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ack) {
      setError("Check the box to sign.");
      return;
    }
    const typed = name.trim();
    if (!typed && !hasInk) {
      setError("Type your name or draw a signature.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const image =
        hasInk && canvasRef.current
          ? canvasRef.current.toDataURL("image/png")
          : "";
      const res = await fetch(`/api/sign/${encodeURIComponent(code)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: typed,
          acknowledged: true,
          image,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.message || "Could not save that signature.");
      }
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save that signature.",
      );
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="mt-8 w-full max-w-md rounded-[1.5rem] border border-zinc-200 bg-snow p-6 text-center">
        <h2 className="font-display text-2xl text-ink-black">You are done</h2>
        <p className="mt-2 text-sm text-body">
          Alex has the signed PDF. You can close this page.
        </p>
      </div>
    );
  }

  const pdfUrl = `/api/sign/${encodeURIComponent(code)}/pdf`;

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mt-6 w-full max-w-lg pb-10">
      <p className="text-sm text-body">{filename}</p>
      <a
        href={pdfUrl}
        target="_blank"
        rel="noreferrer"
        className="btn-ghost mt-4 w-full rounded-full py-3 text-base"
      >
        Open PDF
      </a>
      {hasBoxes ? (
        <div className="mt-4">
          <p className="mb-2 text-sm text-body">
            Green boxes are marks only. Do not sign on the page — sign once
            below.
          </p>
          <PdfPages url={pdfUrl} boxes={boxes} mode="view" />
        </div>
      ) : (
        <iframe
          title="Document to sign"
          src={pdfUrl}
          className="mt-4 h-[48vh] w-full rounded-2xl border border-zinc-200 bg-zinc-50"
        />
      )}
      <label className="mt-6 block text-sm text-body">
        Type your name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          className="field-studio text-base"
          placeholder="Your name"
        />
      </label>
      <p className="mt-5 text-sm text-body">
        {hasBoxes
          ? "Sign once here (type a name or draw). That one signature goes on every green box."
          : "Or draw your signature"}
      </p>
      <div className="mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <canvas
          ref={canvasRef}
          aria-label="Draw your signature"
          className="block w-full touch-none"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>
      <button
        type="button"
        onClick={clearPad}
        className="mt-2 text-sm text-body hover:text-lime"
      >
        Clear drawing
      </button>
      <label className="mt-5 flex items-start gap-3 text-sm text-body">
        <input
          type="checkbox"
          checked={ack}
          onChange={(event) => setAck(event.target.checked)}
          className="mt-1 h-4 w-4 accent-[#00c851]"
        />
        <span>I am signing this document as the name above (or the drawing).</span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="btn-lime mt-6 w-full rounded-full py-3 text-base disabled:opacity-60"
      >
        {pending ? "Saving…" : "Submit signature"}
      </button>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-lime-deep">
          {error}
        </p>
      ) : null}
    </form>
  );
}
