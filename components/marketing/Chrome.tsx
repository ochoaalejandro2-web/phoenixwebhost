import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { VisitBeacon } from "@/components/marketing/VisitBeacon";
import { COMPANY } from "@/lib/config";
import { homePath, requestPath, reviewsPath, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function CompanyPhone({ className }: { className?: string }) {
  return (
    <a
      href={COMPANY.telHref}
      className={className}
      aria-label={`Call Phoenixwebhost at ${COMPANY.phone}`}
    >
      {COMPANY.phone}
    </a>
  );
}

function CompanyJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: COMPANY.legalName,
    url: "https://phoenixwebhost.com",
    email: COMPANY.email,
    telephone: `+1${COMPANY.telHref.replace("tel:", "")}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Phoenix",
      addressRegion: "AZ",
      addressCountry: "US",
    },
    founder: {
      "@type": "Person",
      name: COMPANY.owner,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
    />
  );
}

export function StudioShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio flex min-h-full flex-col bg-snow text-ink-black">
      <CompanyJsonLd />
      <VisitBeacon />
      {children}
    </div>
  );
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const c = t(locale);
  const home = homePath(locale);
  return (
    <header className="sticky top-0 z-30 bg-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href={home} aria-label="Phoenixwebhost home" className="min-w-0 shrink">
          <Logo tone="dark" compactOnMobile />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-white/85 md:flex">
          <a href={`${home}#work`} className="hover:text-lime">
            {locale === "es" ? "Trabajo" : "Work"}
          </a>
          <a href={`${home}#reviews`} className="hover:text-lime">
            {c.nav.reviews}
          </a>
          <a href={`${home}#pricing`} className="hover:text-lime">
            {c.nav.pricing}
          </a>
          <Link href={c.otherHref} className="hover:text-lime">
            {c.otherLang}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <CompanyPhone className="hidden whitespace-nowrap text-sm font-medium text-lime hover:text-white md:inline" />
          <Link
            href="/login"
            className="hidden text-xs text-white/60 hover:text-lime sm:inline"
          >
            {c.nav.owner}
          </Link>
          <Link
            href={requestPath(locale)}
            className="btn-lime rounded-full px-4 py-2 text-sm"
          >
            {c.ctaPrimary}
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-2 md:hidden">
        <div className="mx-auto flex max-w-6xl">
          <CompanyPhone className="text-sm font-medium text-lime hover:text-white" />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <footer className="mt-auto bg-header text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href={homePath(locale)} aria-label="Phoenixwebhost home">
            <Logo tone="dark" />
          </Link>
          <p className="mt-3 text-sm text-white/60">
            {COMPANY.owner} ·{" "}
            <a href={`mailto:${COMPANY.email}`} className="hover:text-lime">
              {COMPANY.email}
            </a>
            {" · "}
            <CompanyPhone className="text-lime hover:text-white" />
            {" · "}
            {c.bilingual}
          </p>
        </div>
        <div className="flex gap-6 text-sm text-white/70">
          <Link href={homePath(locale)} className="hover:text-lime">
            {locale === "es" ? "Inicio" : "Home"}
          </Link>
          <Link href={reviewsPath(locale)} className="hover:text-lime">
            {c.nav.reviews}
          </Link>
          <Link href={requestPath(locale)} className="hover:text-lime">
            {c.nav.request}
          </Link>
          <Link href="/login" className="hover:text-lime">
            {c.nav.owner}
          </Link>
        </div>
      </div>
    </footer>
  );
}
