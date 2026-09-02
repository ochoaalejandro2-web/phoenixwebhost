import { NextResponse } from "next/server";
import {
  publicSignErrorMessage,
  publicSignStatus,
  sanitizeSignerName,
  signBlobPath,
  signCodeLookupKey,
} from "@/lib/sign";
import { getSignFileBytes, putSignFile } from "@/lib/sign-files";
import { pngFromDataUrl, stampSignedPdf } from "@/lib/sign-pdf";
import { getSignDocumentByCode, markSignDocumentSigned } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const key = signCodeLookupKey(code);
  if (!key) {
    return NextResponse.json(
      { error: "invalid", message: publicSignErrorMessage("invalid") },
      { status: 404 },
    );
  }

  let body: {
    name?: string;
    acknowledged?: boolean;
    image?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const name = sanitizeSignerName(String(body.name || ""));
  const png = body.image ? pngFromDataUrl(String(body.image)) : null;
  const acknowledged = body.acknowledged === true;
  if (!acknowledged) {
    return NextResponse.json(
      { error: "ack", message: "Check the box to sign." },
      { status: 400 },
    );
  }
  if (!name && !png) {
    return NextResponse.json(
      { error: "signature", message: "Type your name or draw a signature." },
      { status: 400 },
    );
  }

  const doc = await getSignDocumentByCode(key);
  if (!doc) {
    return NextResponse.json(
      { error: "invalid", message: publicSignErrorMessage("invalid") },
      { status: 404 },
    );
  }
  const status = publicSignStatus(doc);
  if (status !== "pending") {
    const http = status === "expired" ? 410 : 409;
    return NextResponse.json(
      { error: status, message: publicSignErrorMessage(status) },
      { status: http },
    );
  }

  const original = await getSignFileBytes(doc.originalPath);
  if (!original) {
    return NextResponse.json(
      { error: "invalid", message: publicSignErrorMessage("invalid") },
      { status: 404 },
    );
  }

  try {
    const signedAt = new Date();
    const stamped = await stampSignedPdf({
      original,
      signerName: name || "Signature",
      acknowledged,
      signaturePng: png,
      signedAt,
      boxes: doc.boxes,
    });
    const stored = await putSignFile(
      signBlobPath(doc.id, "signed"),
      Buffer.from(stamped),
      "application/pdf",
    );
    const marked = await markSignDocumentSigned({
      code: key,
      signerName: name || "Signature",
      acknowledged,
      signedPath: stored.pathname,
      now: signedAt,
    });
    if (!marked.ok) {
      const http = marked.error === "expired" ? 410 : 409;
      return NextResponse.json(
        {
          error: marked.error,
          message: publicSignErrorMessage(marked.error),
        },
        { status: http },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[sign] submit failed", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
