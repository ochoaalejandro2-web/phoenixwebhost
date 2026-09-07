"use client";

import { useEffect } from "react";
import { SITE_LANG_QUERY, siteLangCookieName } from "@/lib/site-locale";
import type { Locale } from "@/lib/types";

function persistLang(slug: string, locale: Locale) {
  document.cookie = `${siteLangCookieName(slug)}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function langClass(active: boolean) {
  return active
    ? "font-semibold text-black"
    : "font-semibold text-[#00E840] hover:text-[#00FF66]";
}

/**
 * English | Español control for bilingual generated sites.
 * Query `?lang=` is shareable; a per-slug cookie remembers the choice.
 */
export function SiteLangToggle({
  slug,
  locale,
  label,
}: {
  slug: string;
  locale: Locale;
  label: string;
}) {
  useEffect(() => {
    persistLang(slug, locale);
  }, [slug, locale]);

  return (
    <nav aria-label={label} className="flex items-center gap-1.5 text-sm">
      <a
        href={`?${SITE_LANG_QUERY}=en`}
        hrefLang="en"
        lang="en"
        onClick={() => persistLang(slug, "en")}
        aria-current={locale === "en" ? "true" : undefined}
        className={langClass(locale === "en")}
      >
        English
      </a>
      <span className="text-black/35" aria-hidden="true">
        |
      </span>
      <a
        href={`?${SITE_LANG_QUERY}=es`}
        hrefLang="es"
        lang="es"
        onClick={() => persistLang(slug, "es")}
        aria-current={locale === "es" ? "true" : undefined}
        className={langClass(locale === "es")}
      >
        Español
      </a>
    </nav>
  );
}
