import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { publicSiteUrl } from "@/lib/config";
import {
  MAX_SIGN_PDF_BYTES,
  formatSignCode,
  safePdfFilename,
  signBlobPath,
  signPathAllowed,
  signPublicPath,
  signTextMessage,
} from "@/lib/sign";
import { putSignFile, signFilesReady } from "@/lib/sign-files";
import { createSignDocument } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isPdf(file: File) {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!signFilesReady()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        filename?: string;
        pathname?: string;
        sizeBytes?: number;
      };
      const pathname = String(body.pathname || "");
      if (!signPathAllowed(pathname)) {
        return NextResponse.json({ error: "invalid" }, { status: 400 });
      }
      const doc = await createSignDocument({
        filename: safePdfFilename(String(body.filename || "document.pdf")),
        originalPath: pathname,
        sizeBytes:
          typeof body.sizeBytes === "number" ? body.sizeBytes : 0,
      });
      return NextResponse.json({
        id: doc.id,
        code: formatSignCode(doc.code),
        filename: doc.filename,
        path: signPublicPath(doc.code),
        text: signTextMessage(doc.code, publicSiteUrl()),
      });
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size < 8) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }
    if (!isPdf(file) || file.size > MAX_SIGN_PDF_BYTES) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const header = bytes.subarray(0, 5).toString("utf8");
    if (header !== "%PDF-") {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const stored = await putSignFile(
      signBlobPath(id, "original"),
      bytes,
      "application/pdf",
    );
    const doc = await createSignDocument({
      filename: safePdfFilename(file.name),
      originalPath: stored.pathname,
      sizeBytes: file.size,
    });
    return NextResponse.json({
      id: doc.id,
      code: formatSignCode(doc.code),
      filename: doc.filename,
      path: signPublicPath(doc.code),
      text: signTextMessage(doc.code, publicSiteUrl()),
    });
  } catch (error) {
    console.error("[sign] admin create failed", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
