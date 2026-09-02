import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteSignFiles } from "@/lib/sign-files";
import { deleteSignDocument } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
