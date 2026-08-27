import { NextResponse } from "next/server";
import { blobPathAllowed, canUploadAsCustomer } from "@/lib/tax-access";
import { sessionForClient } from "@/lib/tax-auth";
import {
  TaxPortalUnavailableError,
  insertTaxFile,
  listTaxFiles,
  taxPortalBlobReady,
  taxPortalDbReady,
} from "@/lib/tax-db";
import { getPrivateTaxBlob } from "@/lib/tax-blob";
import { loadLiveTaxOffice } from "@/lib/tax-guard";
import {
  MAX_UPLOAD_BYTES,
  isAllowedContentType,
  isTaxDocLabel,
  safeUploadFilename,
} from "@/lib/tax-office";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const client = await loadLiveTaxOffice(slug);
  if (!client) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const session = await sessionForClient(client.id);
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!taxPortalDbReady()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  const files = await listTaxFiles(client.id, session.userId);
  return NextResponse.json({
    files: files.map((file) => ({
      id: file.id,
      label: file.label,
      filename: file.filename,
      contentType: file.contentType,
      sizeBytes: file.sizeBytes,
      createdAt: file.createdAt,
      download: `/api/tax-portal/${slug}/files/${file.id}`,
    })),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const client = await loadLiveTaxOffice(slug);
  if (!client) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!taxPortalDbReady() || !taxPortalBlobReady()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  const session = await sessionForClient(client.id);
  if (!session || !canUploadAsCustomer(session, client.id)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: {
    label?: string;
    filename?: string;
    contentType?: string;
    sizeBytes?: number;
    pathname?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const label = String(body.label || "");
  const pathname = String(body.pathname || "");
  const filename = safeUploadFilename(String(body.filename || "document.pdf"));
  const contentType = String(body.contentType || "application/pdf");
  const sizeBytes = Number(body.sizeBytes || 0);

  if (!isTaxDocLabel(label) || !pathname || !blobPathAllowed(session, pathname)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (!isAllowedContentType(contentType) && contentType !== "application/pdf") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "too-large" }, { status: 413 });
  }

  try {
    const blob = await getPrivateTaxBlob(pathname);
    if (!blob || blob.statusCode !== 200) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }
    const stored = await insertTaxFile({
      clientId: session.clientId,
      userId: session.userId,
      label,
      filename,
      contentType: blob.blob.contentType || contentType,
      sizeBytes: blob.blob.size || sizeBytes,
      blobPathname: pathname,
    });
    return NextResponse.json({
      ok: true,
      file: stored
        ? {
            id: stored.id,
            label: stored.label,
            filename: stored.filename,
            sizeBytes: stored.sizeBytes,
            createdAt: stored.createdAt,
          }
        : null,
    });
  } catch (error) {
    if (error instanceof TaxPortalUnavailableError) {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    console.error("[tax-portal] register file failed", error);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
