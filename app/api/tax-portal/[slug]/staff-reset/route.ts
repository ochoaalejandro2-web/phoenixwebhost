import { NextResponse } from "next/server";
import {
  TaxPortalUnavailableError,
  clearTaxLoginFails,
  consumeStaffResetToken,
  findTaxUserByEmail,
  resetTaxStaffPassword,
  taxPortalDbReady,
} from "@/lib/tax-db";
import { loadLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath, taxOfficeStaffBootstrap } from "@/lib/tax-office";
import {
  isStaffResetEligible,
  readStaffResetToken,
  staffResetMatchesShop,
  staffResetMayCreateUser,
  STAFF_RESET_MIN_PASSWORD,
} from "@/lib/tax-staff-reset";

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

  let body: { token?: string; password?: string };
  try {
    body = (await request.json()) as { token?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const token = String(body.token || "");
  const password = String(body.password || "");
  if (password.length < STAFF_RESET_MIN_PASSWORD) {
    return NextResponse.json({ error: "weak" }, { status: 400 });
  }
  const claims = readStaffResetToken(token);
  if (!claims || !staffResetMatchesShop(claims, { clientId: client.id, slug })) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    const user = await findTaxUserByEmail(client.id, claims.email);
    const boot = taxOfficeStaffBootstrap(client.slug);
    const eligible = isStaffResetEligible({
      email: claims.email,
      user: user ? { role: user.role } : null,
      bootstrapEmail: boot.email,
    });
    if (!eligible) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const consumed = await consumeStaffResetToken(claims.jti, client.id);
    if (!consumed || consumed.email !== claims.email) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const staff = await resetTaxStaffPassword({
      clientId: client.id,
      email: claims.email,
      password,
      name: client.contactName || "Staff",
      phone: client.phone,
      allowCreate: staffResetMayCreateUser({
        email: claims.email,
        user: user ? { role: user.role } : null,
        bootstrapEmail: boot.email,
      }),
    });
    if (!staff) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    await clearTaxLoginFails(client.id, claims.email);
    return NextResponse.json({
      ok: true,
      redirect: `${portalPath(slug, "/staff/login")}?reset=1`,
    });
  } catch (error) {
    if (error instanceof TaxPortalUnavailableError) {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    console.error("[tax-portal] staff reset failed", error);
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
