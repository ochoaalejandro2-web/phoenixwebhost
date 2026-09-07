import { NextResponse } from "next/server";
import { canDeleteTaxCustomer } from "@/lib/tax-access";
import { sessionForClient } from "@/lib/tax-auth";
import {
  TaxPortalUnavailableError,
  deleteTaxCustomer,
  findTaxUserById,
} from "@/lib/tax-db";
import { deletePrivateTaxBlobs } from "@/lib/tax-blob";
import { loadLiveTaxOffice } from "@/lib/tax-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string; userId: string }> },
) {
  const { slug, userId } = await params;
  const client = await loadLiveTaxOffice(slug);
  if (!client) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const session = await sessionForClient(client.id);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (session.role !== "staff") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const person = await findTaxUserById(client.id, userId);
    if (
      !person ||
      !canDeleteTaxCustomer(session, {
        role: person.role,
        clientId: person.clientId,
        userId: person.id,
      })
    ) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const removed = await deleteTaxCustomer(client.id, person.id);
    if (!removed) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    try {
      await deletePrivateTaxBlobs(removed.files.map((file) => file.blobPathname));
    } catch (error) {
      console.error("[tax-portal] profile blob delete failed", person.id, error);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof TaxPortalUnavailableError) {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    console.error("[tax-portal] profile delete failed", error);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
