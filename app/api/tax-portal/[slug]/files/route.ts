import { NextResponse } from "next/server";
import {
  blobPathAllowed,
  canUploadAsCustomer,
  canUploadAsStaff,
} from "@/lib/tax-access";
import { sessionForClient } from "@/lib/tax-auth";
import {
  TaxPortalUnavailableError,
  findTaxUserById,
  insertTaxFile,
  listTaxFiles,
  taxPortalBlobReady,
  taxPortalDbReady,
} from "@/lib/tax-db";
import { getPrivateTaxBlob } from "@/lib/tax-blob";
import { loadLiveTaxOffice } from "@/lib/tax-guard";
import {
  FILED_COPY_LABEL,
  MAX_UPLOAD_BYTES,
  isAllowedContentType,
  isTaxReturnYear,
  resolveTaxFileKind,
  resolveTaxIntakeLabel,
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
  if (!session || (session.role !== "customer" && session.role !== "staff")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!taxPortalDbReady()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  const ownerUserId =
    session.role === "staff"
      ? String(
          new URL(_request.url).searchParams.get("userId") || "",
        )
      : session.userId;
  if (session.role === "staff") {
    const owner = ownerUserId
      ? await findTaxUserById(client.id, ownerUserId)
      : null;
    if (!owner || owner.role !== "customer") {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  const files = await listTaxFiles(client.id, ownerUserId);
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
  const staff = Boolean(session && canUploadAsStaff(session, client.id));
  const customer = Boolean(session && canUploadAsCustomer(session, client.id));
  if (!session || (!staff && !customer)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: {
    label?: string;
    filename?: string;
    contentType?: string;
    sizeBytes?: number;
    pathname?: string;
    kind?: string;
    taxYear?: number;
    ownerUserId?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const ownerUserId = staff
    ? String(body.ownerUserId || "")
    : session.userId;
  if (staff) {
    const owner = await findTaxUserById(client.id, ownerUserId);
    if (!owner || owner.role !== "customer") {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
  }

  const kind = resolveTaxFileKind(staff, body.kind);
  const intake = resolveTaxIntakeLabel(String(body.label || ""));
  const label = kind === "filed" ? FILED_COPY_LABEL : intake;
  const pathname = String(body.pathname || "");
  const filename = safeUploadFilename(String(body.filename || "document.pdf"));
  const contentType = String(body.contentType || "application/pdf");
  const sizeBytes = Number(body.sizeBytes || 0);
  const taxYear = kind === "filed" ? Number(body.taxYear) : null;

  if (!label) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (kind === "filed" && !isTaxReturnYear(taxYear)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (!pathname || !blobPathAllowed(session, pathname, ownerUserId)) {
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
      userId: ownerUserId,
      label,
      kind,
      taxYear,
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
