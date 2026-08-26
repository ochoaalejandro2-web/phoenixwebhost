import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { homePath, requestPath, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function SiteHeader({ locale }: { locale: Locale }) {
  const c = t(locale);
  const home = homePath(locale);
  return (
    <header className="relative z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href={home} aria-label="Phoenixwebhost home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex">
          <a href={`${home}#pricing`} className="hover:text-ink">
            {c.nav.pricing}
          </a>
          <a href={`${home}#included`} className="hover:text-ink">
            {c.nav.included}
          </a>
          <a href={`${home}#how`} className="hover:text-ink">
            {c.nav.work}
          </a>
          <Link href={c.otherHref} className="hover:text-ink">
            {c.otherLang}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-ink-soft hover:text-ink sm:inline"
          >
            {c.nav.owner}
          </Link>
          <Link
            href={requestPath(locale)}
            className="rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white hover:bg-clay-dark"
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
    <footer className="mt-auto border-t border-line bg-sand">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg text-ink">{c.footerLegal}</p>
          <p className="mt-1 text-sm text-ink-soft">
            Alex Ochoa · hello@phoenixwebhost.com · {c.bilingual}
          </p>
        </div>
        <div className="flex gap-5 text-sm text-ink-soft">
          <Link href={homePath(locale)} className="hover:text-ink">
            {locale === "es" ? "Inicio" : "Home"}
          </Link>
          <Link href={requestPath(locale)} className="hover:text-ink">
            {c.nav.request}
          </Link>
          <Link href="/login" className="hover:text-ink">
            {c.nav.owner}
          </Link>
        </div>
      </div>
    </footer>
  );
}
