import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { setTaxSessionCookie } from "@/lib/tax-auth";
import {
  TaxPortalUnavailableError,
  clearTaxLoginFails,
  findTaxUserByEmail,
  recordTaxLoginFail,
  taxLoginLocked,
  taxPortalDbReady,
} from "@/lib/tax-db";
import { loadLiveTaxOffice } from "@/lib/tax-guard";
import { usableEmail } from "@/lib/notify";
import { portalPath } from "@/lib/tax-office";

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
  if (!taxPortalDbReady()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!usableEmail(email) || !password) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  try {
    if (await taxLoginLocked(client.id, email)) {
      return NextResponse.json({ error: "locked" }, { status: 429 });
    }
    const user = await findTaxUserByEmail(client.id, email);
    if (!user || user.role !== "customer" || !user.passwordHash) {
      await recordTaxLoginFail(client.id, email);
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }
    const ok = await compare(password, user.passwordHash);
    if (!ok) {
      await recordTaxLoginFail(client.id, email);
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }
    await clearTaxLoginFails(client.id, email);
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
    console.error("[tax-portal] login failed", error);
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
}
