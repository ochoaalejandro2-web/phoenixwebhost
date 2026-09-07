import { createHmac, timingSafeEqual } from "crypto";
import { portalPath } from "./tax-office.ts";
import { withSiteLangPath } from "./site-locale.ts";
import type { TaxPortalRole } from "./tax-access.ts";
import type { Locale } from "./types.ts";

export const STAFF_RESET_TTL_MS = 30 * 60 * 1000;
export const STAFF_RESET_MIN_PASSWORD = 8;
export const STAFF_RESET_AUDIENCE = "tax-staff-reset";

export type StaffResetUser = { role: TaxPortalRole } | null;

export type StaffResetClaims = {
  jti: string;
  clientId: string;
  email: string;
  slug: string;
  exp: number;
};

function resetSecret() {
  return process.env.AUTH_SECRET || "dev-only-phoenixwebhost-change-me";
}

function signaturesMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function normalizeStaffResetEmail(value: string | undefined | null) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/** Existing staff for that shop, or that shop’s bootstrap email when no user exists. */
export function isStaffResetEligible(input: {
  email: string;
  user: StaffResetUser;
  bootstrapEmail: string;
}) {
  const email = normalizeStaffResetEmail(input.email);
  const boot = normalizeStaffResetEmail(input.bootstrapEmail);
  if (!email) return false;
  if (input.user?.role === "staff") return true;
  if (input.user) return false;
  return Boolean(boot) && email === boot;
}

export function staffResetMayCreateUser(input: {
  email: string;
  user: StaffResetUser;
  bootstrapEmail: string;
}) {
  return !input.user && isStaffResetEligible(input);
}

export function staffResetMatchesShop(
  claims: Pick<StaffResetClaims, "clientId" | "slug">,
  shop: { clientId: string; slug: string },
) {
  return claims.clientId === shop.clientId && claims.slug === shop.slug;
}

export function createStaffResetToken(
  input: {
    clientId: string;
    email: string;
    slug: string;
  },
  now = Date.now(),
): { token: string; claims: StaffResetClaims } {
  const claims: StaffResetClaims = {
    jti: crypto.randomUUID(),
    clientId: input.clientId,
    email: normalizeStaffResetEmail(input.email),
    slug: input.slug,
    exp: now + STAFF_RESET_TTL_MS,
  };
  const body = Buffer.from(
    JSON.stringify({ aud: STAFF_RESET_AUDIENCE, ...claims }),
  ).toString("base64url");
  const sig = createHmac("sha256", resetSecret()).update(body).digest("base64url");
  return { token: `${body}.${sig}`, claims };
}

export function readStaffResetToken(
  token: string,
  now = Date.now(),
): StaffResetClaims | null {
  const raw = String(token || "").trim();
  if (!raw || raw.length > 2000) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 1 || dot === raw.length - 1) return null;
  const body = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = createHmac("sha256", resetSecret())
    .update(body)
    .digest("base64url");
  if (!signaturesMatch(sig, expected)) return null;
  try {
    const json = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      aud?: string;
      jti?: string;
      clientId?: string;
      email?: string;
      slug?: string;
      exp?: number;
    };
    if (json.aud !== STAFF_RESET_AUDIENCE) return null;
    if (
      typeof json.jti !== "string" ||
      typeof json.clientId !== "string" ||
      typeof json.email !== "string" ||
      typeof json.slug !== "string" ||
      typeof json.exp !== "number"
    ) {
      return null;
    }
    if (!json.jti || !json.clientId || !json.slug) return null;
    if (json.exp <= now) return null;
    const email = normalizeStaffResetEmail(json.email);
    if (!email) return null;
    return {
      jti: json.jti,
      clientId: json.clientId,
      email,
      slug: json.slug,
      exp: json.exp,
    };
  } catch {
    return null;
  }
}

export function staffResetPath(slug: string, token: string, locale?: Locale | null) {
  const path = `${portalPath(slug, "/staff/reset")}?token=${encodeURIComponent(token)}`;
  return withSiteLangPath(path, locale);
}

export function staffResetAbsoluteUrl(
  origin: string,
  slug: string,
  token: string,
  locale?: Locale | null,
) {
  const base = origin.replace(/\/$/, "");
  return `${base}${staffResetPath(slug, token, locale)}`;
}

export function staffResetEmailBodies(input: {
  businessName: string;
  resetUrl: string;
  locale: Locale;
}) {
  const es = input.locale === "es";
  const subject = es
    ? `Restablecer la contraseña del personal de ${input.businessName}`
    : `Reset your ${input.businessName} staff password`;
  const intro = es
    ? `Alguien pidió restablecer la contraseña del personal de ${input.businessName}. El enlace es de un solo uso y caduca en 30 minutos.`
    : `Someone asked to reset the staff password for ${input.businessName}. This one-time link expires in 30 minutes.`;
  const cta = es ? "Elegir una contraseña nueva" : "Choose a new password";
  const ignore = es
    ? "Si usted no pidió esto, ignore este correo. El acceso de clientes no cambia."
    : "If you did not ask for this, ignore this email. Client logins are not affected.";
  const html = `<!doctype html>
<html><body style="font-family:Georgia,serif;background:#fff;color:#111;padding:24px">
  <p style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#00C851;margin:0">Phoenixwebhost Inc.</p>
  <h1 style="font-size:24px;margin:8px 0 16px">${escapeHtml(subject)}</h1>
  <p>${escapeHtml(intro)}</p>
  <p style="margin-top:24px"><a href="${escapeHtml(input.resetUrl)}" style="display:inline-block;background:#00C851;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700">${escapeHtml(cta)}</a></p>
  <p style="margin-top:24px;word-break:break-all">${escapeHtml(input.resetUrl)}</p>
  <p>${escapeHtml(ignore)}</p>
</body></html>`;
  const text = [
    subject,
    "",
    intro,
    "",
    `${cta}: ${input.resetUrl}`,
    "",
    ignore,
  ].join("\n");
  return { subject, html, text };
}
