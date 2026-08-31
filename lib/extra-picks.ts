import { requestPath } from "./i18n.ts";
import type { Locale } from "./types.ts";

export const EXTRA_PICKS = [
  "domain",
  "email",
  "book",
  "missed",
  "reviews",
  "voice",
] as const;

export type ExtraPick = (typeof EXTRA_PICKS)[number];

export function parseExtraPicks(
  value: string | string[] | undefined | null,
): ExtraPick[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  const parts = raw.flatMap((item) =>
    String(item)
      .split(",")
      .map((part) => part.trim().toLowerCase()),
  );
  return EXTRA_PICKS.filter((key) => parts.includes(key));
}

export function extraFlagsFromPicks(picks: ExtraPick[]) {
  const set = new Set(picks);
  return {
    includeDomain: set.has("domain"),
    includeEmail: set.has("email"),
    includeBook: set.has("book"),
    includeMissed: set.has("missed"),
    includeReviews: set.has("reviews"),
    includeVoice: set.has("voice"),
  };
}

export function requestWithExtra(
  locale: Locale,
  extra: ExtraPick,
  ads?: string,
) {
  const params = new URLSearchParams();
  if (ads && ads !== "none") params.set("ads", ads);
  params.set("extra", extra);
  return `${requestPath(locale)}?${params.toString()}`;
}
