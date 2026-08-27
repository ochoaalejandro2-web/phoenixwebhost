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
  upsertTaxStaffUser,
} from "@/lib/tax-db";
import { loadLiveTaxOffice } from "@/lib/tax-guard";
import { usableEmail } from "@/lib/notify";
import {
  HOLA_TAX_SLUG,
  holaTaxStaffBootstrap,
  portalPath,
} from "@/lib/tax-office";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameSecret(left: string, right: string) {
  if (!left || !right || left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
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
    if (user?.role === "staff" && user.passwordHash) {
      const ok = await compare(password, user.passwordHash);
      if (!ok) {
        await recordTaxLoginFail(client.id, email);
        return NextResponse.json({ error: "invalid" }, { status: 401 });
      }
      await clearTaxLoginFails(client.id, email);
      await setTaxSessionCookie({
        role: "staff",
        userId: user.id,
        clientId: client.id,
        email: user.email,
        name: user.name,
      });
      return NextResponse.json({ ok: true, redirect: portalPath(slug, "/staff") });
    }

    const boot = holaTaxStaffBootstrap();
    const bootstrapOk =
      client.slug === HOLA_TAX_SLUG &&
      Boolean(boot.password) &&
      email === boot.email &&
      sameSecret(password, boot.password);

    if (bootstrapOk) {
      const staff = await upsertTaxStaffUser({
        clientId: client.id,
        email: boot.email,
        password: boot.password,
        name: client.contactName || "Staff",
        phone: client.phone,
      });
      if (!staff) {
        return NextResponse.json({ error: "unavailable" }, { status: 503 });
      }
      await clearTaxLoginFails(client.id, email);
      await setTaxSessionCookie({
        role: "staff",
        userId: staff.id,
        clientId: client.id,
        email: staff.email,
        name: staff.name,
      });
      return NextResponse.json({ ok: true, redirect: portalPath(slug, "/staff") });
    }

    await recordTaxLoginFail(client.id, email);
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  } catch (error) {
    if (error instanceof TaxPortalUnavailableError) {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    console.error("[tax-portal] staff login failed", error);
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
}
