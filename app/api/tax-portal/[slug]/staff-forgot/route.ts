import { NextResponse } from "next/server";
import {
  TaxPortalUnavailableError,
  findTaxUserByEmail,
  insertStaffResetToken,
  taxLoginLocked,
  taxPortalDbReady,
} from "@/lib/tax-db";
import { loadLiveTaxOffice } from "@/lib/tax-guard";
import { notifyEmailReady, notifyStaffPasswordReset, usableEmail } from "@/lib/notify";
import { publicSiteUrl } from "@/lib/config";
import { parseSiteLocale } from "@/lib/site-locale";
import { taxOfficeStaffBootstrap } from "@/lib/tax-office";
import {
  createStaffResetToken,
  isStaffResetEligible,
  staffResetAbsoluteUrl,
} from "@/lib/tax-staff-reset";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeOrigin(value: unknown) {
  const raw = String(value || "").trim();
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.origin;
  } catch {
    return "";
  }
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
  if (!notifyEmailReady()) {
    return NextResponse.json({ error: "mail" }, { status: 503 });
  }

  let body: { email?: string; locale?: string; origin?: string };
  try {
    body = (await request.json()) as {
      email?: string;
      locale?: string;
      origin?: string;
    };
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!usableEmail(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const locale = parseSiteLocale(body.locale) || "en";
  const origin = safeOrigin(body.origin) || publicSiteUrl();

  try {
    if (await taxLoginLocked(client.id, email)) {
      return NextResponse.json({ ok: true });
    }

    const user = await findTaxUserByEmail(client.id, email);
    const boot = taxOfficeStaffBootstrap(client.slug);
    const eligible = isStaffResetEligible({
      email,
      user: user ? { role: user.role } : null,
      bootstrapEmail: boot.email,
    });
    if (!eligible) {
      return NextResponse.json({ ok: true });
    }

    const { token, claims } = createStaffResetToken({
      clientId: client.id,
      email,
      slug: client.slug,
    });
    await insertStaffResetToken({
      jti: claims.jti,
      clientId: client.id,
      email,
      expiresAt: new Date(claims.exp),
    });
    const resetUrl = staffResetAbsoluteUrl(origin, client.slug, token, locale);
    const sent = await notifyStaffPasswordReset({
      to: email,
      businessName: client.businessName,
      resetUrl,
      locale,
    });
    if (!sent) {
      console.error("[tax-portal] staff reset email failed", client.slug);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof TaxPortalUnavailableError) {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    console.error("[tax-portal] staff forgot failed", error);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
