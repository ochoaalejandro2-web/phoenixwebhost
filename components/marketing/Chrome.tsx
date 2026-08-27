import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { homePath, requestPath, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function StudioShell({
  children,
  grain = true,
}: {
  children: React.ReactNode;
  grain?: boolean;
}) {
  return (
    <div
      className={`studio flex min-h-full flex-col bg-dusk text-cream-soft ${grain ? "grain" : ""}`}
    >
      {children}
    </div>
  );
}

export function SiteHeader({
  locale,
  overlay = false,
}: {
  locale: Locale;
  overlay?: boolean;
}) {
  const c = t(locale);
  const home = homePath(locale);
  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 border-b border-white/10 bg-gradient-to-b from-[#0b1220]/80 to-transparent"
          : "relative z-20 border-b border-gold-line bg-dusk/80 backdrop-blur"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href={home} aria-label="Phoenixwebhost home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-cream-soft md:flex">
          <a href={`${home}#work`} className="hover:text-gold">
            {locale === "es" ? "Trabajo" : "Work"}
          </a>
          <a href={`${home}#pricing`} className="hover:text-gold">
            {c.nav.pricing}
          </a>
          <Link href={c.otherHref} className="hover:text-gold">
            {c.otherLang}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-xs text-cream-soft/80 hover:text-gold sm:inline"
          >
            {c.nav.owner}
          </Link>
          <Link
            href={requestPath(locale)}
            className="btn-gold rounded-full px-4 py-2 text-sm"
          >
            {c.ctaPrimary}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <footer className="mt-auto border-t border-gold-line bg-[#0a101c]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg text-cream">{c.footerLegal}</p>
          <p className="mt-1 text-sm text-cream-soft">
            Alex Ochoa · hello@phoenixwebhost.com · {c.bilingual}
          </p>
        </div>
        <div className="flex gap-5 text-sm text-cream-soft">
          <Link href={homePath(locale)} className="hover:text-gold">
            {locale === "es" ? "Inicio" : "Home"}
          </Link>
          <Link href={requestPath(locale)} className="hover:text-gold">
            {c.nav.request}
          </Link>
          <Link href="/login" className="hover:text-gold">
            {c.nav.owner}
          </Link>
        </div>
      </div>
    </footer>
  );
}
