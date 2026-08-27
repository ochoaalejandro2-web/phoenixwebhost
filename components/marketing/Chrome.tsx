import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { homePath, requestPath, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function StudioShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio grain flex min-h-full flex-col bg-dusk text-cream-soft">
      {children}
    </div>
  );
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const c = t(locale);
  const home = homePath(locale);
  return (
    <header className="relative z-20 border-b border-gold-line bg-dusk/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href={home} aria-label="Phoenixwebhost home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-cream-soft md:flex">
          <a href={`${home}#pricing`} className="hover:text-gold">
            {c.nav.pricing}
          </a>
          <a href={`${home}#included`} className="hover:text-gold">
            {c.nav.included}
          </a>
          <a href={`${home}#how`} className="hover:text-gold">
            {c.nav.work}
          </a>
          <Link href={c.otherHref} className="hover:text-gold">
            {c.otherLang}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-cream-soft hover:text-gold sm:inline"
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
