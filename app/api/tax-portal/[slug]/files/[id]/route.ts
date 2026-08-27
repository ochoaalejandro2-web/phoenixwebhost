import { NextResponse } from "next/server";
import { canReadTaxFile } from "@/lib/tax-access";
import { sessionForClient } from "@/lib/tax-auth";
import { TaxPortalUnavailableError, getTaxFile } from "@/lib/tax-db";
import { getPrivateTaxBlob } from "@/lib/tax-blob";
import { loadLiveTaxOffice } from "@/lib/tax-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { slug, id } = await params;
  const client = await loadLiveTaxOffice(slug);
  if (!client) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const session = await sessionForClient(client.id);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const file = await getTaxFile(client.id, id);
    if (!file || !canReadTaxFile(session, file)) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const blob = await getPrivateTaxBlob(file.blobPathname);
    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const filename = file.filename.replace(/[\r\n"]/g, "");
    return new NextResponse(blob.stream, {
      headers: {
        "Content-Type": file.contentType || blob.blob.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof TaxPortalUnavailableError) {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    console.error("[tax-portal] download failed", error);
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
