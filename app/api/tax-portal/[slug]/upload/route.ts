import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import {
  blobPathAllowed,
  canUploadAsCustomer,
  canUploadAsStaff,
} from "@/lib/tax-access";
import { sessionForClient } from "@/lib/tax-auth";
import {
  findTaxUserById,
  insertTaxFile,
  taxPortalBlobReady,
  taxPortalDbReady,
} from "@/lib/tax-db";
import { loadLiveTaxOffice } from "@/lib/tax-guard";
import {
  ALLOWED_CONTENT_TYPES,
  FILED_COPY_LABEL,
  MAX_UPLOAD_BYTES,
  isTaxIntakeLabel,
  isTaxReturnYear,
  taxBlobPrefix,
  type TaxFileKind,
} from "@/lib/tax-office";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UploadMeta = {
  ownerUserId?: string;
  label?: string;
  kind?: string;
  taxYear?: number;
};

function parsePayload(raw: string | null | undefined): UploadMeta {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as UploadMeta;
  } catch {
    return {};
  }
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

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = parsePayload(clientPayload);
        const ownerUserId = staff
          ? String(payload.ownerUserId || "")
          : session.userId;
        if (staff) {
          const owner = await findTaxUserById(client.id, ownerUserId);
          if (!owner || owner.role !== "customer") {
            throw new Error("Invalid folder");
          }
        }
        if (
          !pathname.startsWith(taxBlobPrefix(session.clientId, ownerUserId)) ||
          pathname.includes("..")
        ) {
          throw new Error("Invalid upload path");
        }
        const filed = staff && payload.kind === "filed";
        const kind: TaxFileKind = filed ? "filed" : "intake";
        if (kind === "filed" && !isTaxReturnYear(payload.taxYear)) {
          throw new Error("Invalid tax year");
        }
        const label =
          kind === "filed"
            ? FILED_COPY_LABEL
            : isTaxIntakeLabel(payload.label || "")
              ? payload.label
              : "Other";
        return {
          allowedContentTypes: [...ALLOWED_CONTENT_TYPES],
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({
            clientId: session.clientId,
            userId: ownerUserId,
            label,
            kind,
            taxYear: kind === "filed" ? Number(payload.taxYear) : null,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (!tokenPayload) return;
        try {
          const meta = JSON.parse(tokenPayload) as {
            clientId?: string;
            userId?: string;
            label?: string;
            kind?: TaxFileKind;
            taxYear?: number | null;
          };
          const kind: TaxFileKind = meta.kind === "filed" ? "filed" : "intake";
          const label =
            kind === "filed"
              ? FILED_COPY_LABEL
              : isTaxIntakeLabel(meta.label || "")
                ? meta.label
                : "";
          if (
            meta.clientId !== client.id ||
            !meta.userId ||
            !label ||
            (kind === "filed" && !isTaxReturnYear(meta.taxYear))
          ) {
            return;
          }
          if (!blobPathAllowed(session, blob.pathname, meta.userId)) return;
          await insertTaxFile({
            clientId: meta.clientId,
            userId: meta.userId,
            label,
            kind,
            taxYear: kind === "filed" ? Number(meta.taxYear) : null,
            filename: blob.pathname.split("/").pop() || "document.pdf",
            contentType: blob.contentType || "application/pdf",
            sizeBytes: 0,
            blobPathname: blob.pathname,
          });
        } catch (error) {
          console.error("[tax-portal] upload completed handler", error);
        }
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[tax-portal] upload token failed", error);
    return NextResponse.json(
      { error: (error as Error).message || "upload failed" },
      { status: 400 },
    );
  }
}
