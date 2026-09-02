import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { normalizeSignBoxes } from "@/lib/sign";
import { deleteSignFiles } from "@/lib/sign-files";
import { deleteSignDocument, updateSignDocumentBoxes } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!id || !id.startsWith("sign_")) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  let body: { boxes?: unknown };
  try {
    body = (await request.json()) as { boxes?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const result = await updateSignDocumentBoxes(id, normalizeSignBoxes(body.boxes));
  if (!result.ok) {
    const status = result.error === "signed" ? 409 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({
    ok: true,
    boxes: result.doc.boxes,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!id || !id.startsWith("sign_")) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const doc = await deleteSignDocument(id);
  if (!doc) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  try {
    await deleteSignFiles(doc);
  } catch (error) {
    console.error("[sign] admin delete files failed", id, error);
    return NextResponse.json({ error: "files" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
