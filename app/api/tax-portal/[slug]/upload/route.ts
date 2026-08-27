import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { blobPathAllowed, canUploadAsCustomer } from "@/lib/tax-access";
import { sessionForClient } from "@/lib/tax-auth";
import { insertTaxFile, taxPortalBlobReady, taxPortalDbReady } from "@/lib/tax-db";
import { loadLiveTaxOffice } from "@/lib/tax-guard";
import {
  ALLOWED_CONTENT_TYPES,
  MAX_UPLOAD_BYTES,
  isTaxDocLabel,
  taxBlobPrefix,
} from "@/lib/tax-office";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
        if (
          !pathname.startsWith(taxBlobPrefix(session.clientId, session.userId)) ||
          pathname.includes("..")
        ) {
          throw new Error("Invalid upload path");
        }
        let label = "Other";
        if (clientPayload) {
          try {
            const parsed = JSON.parse(clientPayload) as { label?: string };
            if (parsed.label && isTaxDocLabel(parsed.label)) label = parsed.label;
          } catch {
            label = "Other";
          }
        }
        return {
          allowedContentTypes: [...ALLOWED_CONTENT_TYPES],
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({
            clientId: session.clientId,
            userId: session.userId,
            label,
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
          };
          if (
            meta.clientId !== client.id ||
            meta.userId !== session.userId ||
            !meta.label ||
            !isTaxDocLabel(meta.label)
          ) {
            return;
          }
          if (!blobPathAllowed(session, blob.pathname)) return;
          await insertTaxFile({
            clientId: meta.clientId,
            userId: meta.userId,
            label: meta.label,
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
