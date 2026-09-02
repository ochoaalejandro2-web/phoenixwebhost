import { NextResponse } from "next/server";
import {
  publicSignErrorMessage,
  publicSignStatus,
  signCodeLookupKey,
} from "@/lib/sign";
import { getSignFileBytes } from "@/lib/sign-files";
import { getSignDocumentByCode } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
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
  const bytes = await getSignFileBytes(doc.originalPath);
  if (!bytes) {
    return NextResponse.json(
      { error: "invalid", message: publicSignErrorMessage("invalid") },
      { status: 404 },
    );
  }
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=\"document.pdf\"",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
