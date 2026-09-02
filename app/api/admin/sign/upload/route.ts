import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  MAX_SIGN_PDF_BYTES,
  safePdfFilename,
  signPathAllowed,
} from "@/lib/sign";
import { signBlobReady } from "@/lib/sign-files";
import { createSignDocument } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!signBlobReady()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
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
        if (!signPathAllowed(pathname)) {
          throw new Error("Invalid upload path");
        }
        let filename = "document.pdf";
        let sizeBytes = 0;
        if (clientPayload) {
          try {
            const parsed = JSON.parse(clientPayload) as {
              filename?: string;
              sizeBytes?: number;
            };
            if (parsed.filename) filename = safePdfFilename(parsed.filename);
            if (typeof parsed.sizeBytes === "number") sizeBytes = parsed.sizeBytes;
          } catch {
            filename = "document.pdf";
          }
        }
        return {
          allowedContentTypes: ["application/pdf"],
          maximumSizeInBytes: MAX_SIGN_PDF_BYTES,
          addRandomSuffix: true,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({ filename, sizeBytes }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (!signPathAllowed(blob.pathname) || !tokenPayload) return;
        try {
          const meta = JSON.parse(tokenPayload) as {
            filename?: string;
            sizeBytes?: number;
          };
          await createSignDocument({
            filename: safePdfFilename(meta.filename || "document.pdf"),
            originalPath: blob.pathname,
            sizeBytes: typeof meta.sizeBytes === "number" ? meta.sizeBytes : 0,
          });
        } catch (error) {
          console.error("[sign] upload completed handler", error);
        }
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[sign] admin upload token failed", error);
    return NextResponse.json(
      { error: (error as Error).message || "upload failed" },
      { status: 400 },
    );
  }
}
