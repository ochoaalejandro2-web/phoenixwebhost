import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { safePdfFilename, signedDownloadName } from "@/lib/sign";
import { getSignFileBytes } from "@/lib/sign-files";
import { getSignDocument } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const doc = await getSignDocument(id);
  if (!doc) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const kind = new URL(request.url).searchParams.get("kind");
  const signed = kind === "signed";
  const pathname = signed ? doc.signedPath : doc.originalPath;
  if (!pathname) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const bytes = await getSignFileBytes(pathname);
  if (!bytes) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const filename = signed
    ? signedDownloadName(doc.filename)
    : safePdfFilename(doc.filename);
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename.replace(/[\r\n"]/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
