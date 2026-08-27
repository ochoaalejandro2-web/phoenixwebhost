import { NextResponse } from "next/server";
import { setTaxSessionCookie } from "@/lib/tax-auth";
import {
  TaxPortalUnavailableError,
  createTaxCustomer,
  findTaxUserByEmail,
  taxPortalDbReady,
} from "@/lib/tax-db";
import { loadLiveTaxOffice } from "@/lib/tax-guard";
import { usableEmail } from "@/lib/notify";
import { portalPath } from "@/lib/tax-office";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clip(value: unknown, max: number) {
  return String(value || "").trim().slice(0, max);
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
  if (!taxPortalDbReady()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const email = clip(body.email, 200).toLowerCase();
  const password = String(body.password || "");
  const name = clip(body.name, 120);
  const phone = clip(body.phone, 40);

  if (!usableEmail(email) || !name || phone.length < 7 || password.length < 8) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    const existing = await findTaxUserByEmail(client.id, email);
    if (existing) {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }
    const user = await createTaxCustomer({
      clientId: client.id,
      email,
      password,
      name,
      phone,
    });
    if (!user) {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    await setTaxSessionCookie({
      role: "customer",
      userId: user.id,
      clientId: client.id,
      email: user.email,
      name: user.name,
    });
    return NextResponse.json({ ok: true, redirect: portalPath(slug, "/folder") });
  } catch (error) {
    if (error instanceof TaxPortalUnavailableError) {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("unique") || message.includes("23505")) {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }
    console.error("[tax-portal] signup failed", error);
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
