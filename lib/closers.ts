export const CLOSER_COOKIE = "phx_ref";
export const CLOSER_QUERY = "ref";
export const CLOSER_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

export type { Closer } from "./types.ts";

export function sanitizeCloserCode(value: unknown): string {
  const raw = String(value || "")
    .trim()
    .toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{1,31}$/.test(raw)) return "";
  return raw;
}

export function closerFromName(name: string): string {
  return sanitizeCloserCode(
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24),
  );
}

export function parseCloserFromPath(pathname: string): {
  code: string;
  locale: "en" | "es";
} | null {
  const match = pathname.match(/^\/(es\/)?r\/([^/]+)\/?$/);
  if (!match) return null;
  const code = sanitizeCloserCode(match[2]);
  if (!code) return null;
  return { code, locale: match[1] ? "es" : "en" };
}

export function closerHomePath(locale: "en" | "es") {
  return locale === "es" ? "/es" : "/";
}

export function closerSellPath(code: string, locale: "en" | "es" = "en") {
  const clean = sanitizeCloserCode(code);
  if (!clean) return closerHomePath(locale);
  return locale === "es" ? `/es/r/${clean}` : `/r/${clean}`;
}

export function closerCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: CLOSER_MAX_AGE_SECONDS,
    secure,
  };
}

export function launchSoldNote(label: string) {
  return `Sold by ${label}. After Stripe succeeded, fulfill Missed-call text-back on the referrer’s Phoenixwebhost account: 6 months free, then 1 year at 50% off. After that, $49 setup + $29/month. Alex keeps monthly care and other add-ons from the new customer. Do not auto-payout — not a cash launch-fee payout.`;
}

export function closerLeadNote(code: string) {
  return `Closer code ${code}. After Stripe succeeds, fulfill Missed-call text-back on the referrer’s Phoenixwebhost account: 6 months free, then 1 year at 50% off. Alex keeps monthly care and other add-ons. Not a cash launch-fee payout.`;
}

export function isCloserSoldNote(body: string) {
  return (
    body.includes("Pay them the $200 launch") ||
    body.includes("fulfill Missed-call text-back")
  );
}
