import { tTaxOffice } from "@/lib/tax-office-i18n";
import type { Locale } from "@/lib/types";

/** Outbound Google review link. Hidden when the URL is empty. No star ratings. */
export function LeaveReviewCta({
  href,
  locale,
  className,
}: {
  href?: string | null;
  locale: Locale;
  className?: string;
}) {
  const url = String(href || "").trim();
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {tTaxOffice(locale).leaveReview}
    </a>
  );
}
