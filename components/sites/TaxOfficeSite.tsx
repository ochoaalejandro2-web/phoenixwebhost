import Image from "next/image";
import { BookJobForm } from "@/components/sites/BookJobForm";
import { PreviewContactForm } from "@/components/sites/PreviewContactForm";
import { SiteLangToggle } from "@/components/sites/SiteLangToggle";
import { HOLA_TAX_SLUG, clientThemeClass } from "@/lib/client-themes";
import {
  PA_FINANCIAL_EMAIL,
  PA_FINANCIAL_FACEBOOK,
  PA_FINANCIAL_INSTAGRAM,
  PA_FINANCIAL_LOGO,
  PA_FINANCIAL_OWNER,
  PA_FINANCIAL_SLUG,
  PA_FINANCIAL_WHATSAPP,
  paFinancialContactUs,
  paFinancialCopy,
  paFinancialHours,
  paFinancialServiceBlurb,
  paFinancialServicesTitle,
} from "@/lib/pa-financial-i18n";
import { displayHours, isPreviewClient, isSamplePhone, previewLeadId, siteHomeHref } from "@/lib/demo";
import { clientShowsBookJob } from "@/lib/site-addons";
import {
  isHolaTaxBookkeepingService,
  tHolaTax,
  withHolaTaxListedServices,
} from "@/lib/hola-tax-i18n";
import { DEMO_REVIEWS, photoAlt, SHOP_PHOTOS } from "@/lib/shop-content";
import { tShop } from "@/lib/shop-i18n";
import { withSiteLangPath } from "@/lib/site-locale";
import { portalPath } from "@/lib/tax-office";
import {
  tTaxOffice,
  taxOfficeAbout,
  taxOfficeServiceLabel,
  taxOfficeTagline,
} from "@/lib/tax-office-i18n";
import type { Client, ContactNotice, Locale } from "@/lib/types";

const HOLA_PHOTOS = {
  office: "/clients/hola-tax-service/office.png",
  calculator: "/clients/hola-tax-service/calculator.jpg",
  desk: "/clients/hola-tax-service/desk.jpg",
  llcSigning: "/clients/hola-tax-service/llc-signing.jpg",
  llcHandshake: "/clients/hola-tax-service/llc-handshake.jpg",
  llcStorefront: "/clients/hola-tax-service/llc-storefront.jpg",
} as const;

type SiteView = {
  client: Client;
  notice?: ContactNotice | null;
  locale: Locale;
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function SiteStill({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-[#00FF66] bg-black ${className ?? ""}`}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

function ContactNoticeBanner({
  client,
  notice,
  locale,
}: {
  client: Client;
  notice?: ContactNotice | null;
  locale: Locale;
}) {
  if (!notice) return null;
  const c = tTaxOffice(locale);
  const phone = String(client.phone || "").trim();
  const ok = notice === "sent";
  const copy =
    notice === "sent"
      ? c.noticeSent(client.businessName)
      : notice === "no-email"
        ? c.noticeNoEmail(phone)
        : notice === "missing"
          ? c.noticeMissing
          : c.noticeFailed(phone);
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`text-sm ${ok ? "text-[#00E840]" : "text-black"}`}
    >
      {copy}
    </p>
  );
}

function PaServiceIcon({ service }: { service: string }) {
  if (/itin/i.test(service)) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-none stroke-white stroke-[1.6]">
        <path d="M7 19c2-4 5-7 10-10" />
        <path d="M14 6.5c.8-.4 2.2-.2 3 .6.8.8 1 2.2.6 3" />
        <path d="M6 8.5 8 6l1.2.4L8.4 8.2z" />
        <path d="M16.2 4.2 17 5.6" />
        <path d="M19.2 7.2 20.4 8" />
        <path d="M15.4 9.8 16.6 10.6" />
      </svg>
    );
  }
  if (/business/i.test(service)) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-none stroke-white stroke-[1.6]">
        <rect x="5" y="4" width="11" height="15" rx="1.2" />
        <path d="M8 8h5M8 11h5M8 14h3" />
        <path d="M14 16.5 19 8.5" />
        <path d="M17.2 8.2h2.4v2.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-none stroke-white stroke-[1.6]">
      <rect x="6" y="3.5" width="12" height="17" rx="1.6" />
      <rect x="8" y="5.5" width="8" height="4" rx="0.6" />
      <text
        x="12"
        y="8.7"
        textAnchor="middle"
        fill="white"
        stroke="none"
        fontSize="4"
        fontWeight="600"
      >
        1040
      </text>
      <path d="M8.5 12h1.4M11.3 12h1.4M14.1 12h1.4M8.5 14.4h1.4M11.3 14.4h1.4M14.1 14.4h1.4M8.5 16.8h1.4M11.3 16.8h1.4M14.1 16.8h1.4" />
    </svg>
  );
}

function SocialGlyph({
  kind,
  className = "h-5 w-5",
}: {
  kind: "whatsapp" | "phone" | "email" | "facebook" | "instagram";
  className?: string;
}) {
  if (kind === "whatsapp" || kind === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-none stroke-current stroke-[1.7]`}>
        <path d="M7.2 3.8h3.1l1.1 3.2-2 1.2a11.2 11.2 0 0 0 6.4 6.4l1.2-2 3.2 1.1v3.1c0 .7-.6 1.3-1.3 1.3C10.4 18.1 5.9 13.6 5.9 5.1c0-.7.6-1.3 1.3-1.3Z" />
      </svg>
    );
  }
  if (kind === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-none stroke-current stroke-[1.7]`}>
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
        <path d="m4.2 7.2 7.8 6.2 7.8-6.2" />
      </svg>
    );
  }
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-current`}>
        <path d="M14.2 20v-7.1h2.4l.36-2.78h-2.76V8.4c0-.8.22-1.35 1.38-1.35H17V4.57A18.6 18.6 0 0 0 14.7 4.4c-2.3 0-3.87 1.4-3.87 3.98v2.22H8.4V12.9h2.43V20h3.37Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-none stroke-current stroke-[1.7]`}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.1" cy="6.9" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PaFinancialWordmark() {
  return (
    <div className="pa-appoint-wordmark text-center text-white">
      <svg viewBox="0 0 120 120" aria-hidden="true" className="mx-auto h-28 w-28 sm:h-36 sm:w-36">
        <polygon
          points="60,8 104,34 104,86 60,112 16,86 16,34"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <rect x="40" y="30" width="40" height="58" rx="5" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="46" y="36" width="28" height="14" rx="2" fill="currentColor" />
        <text
          x="60"
          y="47"
          textAnchor="middle"
          fill="#111111"
          fontSize="8"
          fontWeight="700"
        >
          1040
        </text>
        <path
          d="M48 58h6M57 58h6M66 58h6M48 66h6M57 66h6M66 66h6M48 74h6M57 74h6M66 74h6"
          stroke="currentColor"
          strokeWidth="2.2"
        />
      </svg>
      <p className="mt-3 font-display text-xl font-semibold tracking-[0.08em] sm:text-2xl">
        P&A FINANCIAL LLC
      </p>
      <p className="mt-1 text-[0.7rem] tracking-[0.22em] text-white/80">
        INCOME TAXES AND BOOKKEEPING
      </p>
    </div>
  );
}

function PaOwnerPortrait({
  alt,
  sizes,
  caption,
  className,
  preload,
}: {
  alt: string;
  sizes: string;
  caption?: string;
  className?: string;
  preload?: boolean;
}) {
  return (
    <figure className={`pa-portrait ${className ?? ""}`}>
      <div className="pa-portrait-frame">
        <Image
          src={PA_FINANCIAL_OWNER}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover object-[50%_18%]"
        />
      </div>
      {caption ? <figcaption className="pa-portrait-caption">{caption}</figcaption> : null}
    </figure>
  );
}

function PaFinancialServices({
  services,
  locale,
}: {
  services: string[];
  locale: Locale;
}) {
  return (
    <div id="services" className="pa-services">
      <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20">
        <p className="pa-kicker">{paFinancialCopy(locale).servicesLead}</p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-white sm:text-4xl">
          {paFinancialServicesTitle(locale)}
        </h2>
        <div className="pa-services-row mt-12">
          <span className="pa-chevron" aria-hidden="true">
            ‹
          </span>
          <ul className="grid flex-1 gap-6 md:grid-cols-3">
            {services.map((service) => (
              <li key={service} className="pa-service-card px-6 py-9 text-center">
                <span className="pa-service-icon mx-auto inline-flex h-14 w-14 items-center justify-center">
                  <PaServiceIcon service={service} />
                </span>
                <p className="mt-5 font-display text-lg font-semibold tracking-tight text-white">
                  {taxOfficeServiceLabel(service, locale)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  {paFinancialServiceBlurb(service, locale)}
                </p>
              </li>
            ))}
          </ul>
          <span className="pa-chevron" aria-hidden="true">
            ›
          </span>
        </div>
        <a href="#contact" className="pa-service-cta mt-12 inline-flex">
          {paFinancialContactUs(locale)}
        </a>
      </div>
    </div>
  );
}

function PaFinancialAppointment({ locale }: { locale: Locale }) {
  const pa = paFinancialCopy(locale);
  return (
    <section id="appointment" className="pa-appoint" aria-labelledby="pa-appoint-title">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-16 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2 id="pa-appoint-title" className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            {pa.scheduleTitle}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white sm:text-base">
            {pa.scheduleBlurb}
          </p>
          <div className="pa-appoint-card mt-7">
            <a href={PA_FINANCIAL_WHATSAPP} className="pa-appoint-btn" target="_blank" rel="noreferrer">
              <SocialGlyph kind="whatsapp" className="h-6 w-6" />
              WhatsApp
            </a>
            <a href={`mailto:${PA_FINANCIAL_EMAIL}`} className="pa-appoint-btn">
              <SocialGlyph kind="email" className="h-6 w-6" />
              Email
            </a>
            <a href={PA_FINANCIAL_FACEBOOK} className="pa-appoint-btn">
              <SocialGlyph kind="facebook" className="h-6 w-6" />
              Facebook
            </a>
            <a
              href={PA_FINANCIAL_INSTAGRAM}
              className="pa-appoint-btn"
              target="_blank"
              rel="noreferrer"
            >
              <SocialGlyph kind="instagram" className="h-6 w-6" />
              Instagram
            </a>
          </div>
        </div>
        <PaFinancialWordmark />
      </div>
    </section>
  );
}

function PaFinancialFooter({
  locale,
  home,
  phone,
  staff,
}: {
  locale: Locale;
  home: string;
  phone: string;
  staff: string;
}) {
  const pa = paFinancialCopy(locale);
  const c = tTaxOffice(locale);
  return (
    <footer className="pa-footer mt-auto px-5 py-10 text-sm text-white">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <a href={home} className="inline-flex items-center">
          <Image
            src={PA_FINANCIAL_LOGO}
            alt="P&A Financial LLC"
            width={1042}
            height={1042}
            className="h-24 w-24 sm:h-28 sm:w-28"
          />
        </a>
        <div>
          <p className="font-display text-base font-semibold tracking-tight">{pa.footerLinks}</p>
          <ul className="mt-3 grid gap-1.5">
            <li>
              <a href={home}>{pa.navHome}</a>
            </li>
            <li>
              <a href="#about">{pa.navAbout}</a>
            </li>
            <li>
              <a href="#services">{pa.navServices}</a>
            </li>
            <li>
              <a href="#contact">{pa.navContact}</a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display text-base font-semibold tracking-tight">{pa.footerContact}</p>
          <ul className="mt-3 grid gap-2">
            {phone ? (
              <li>
                <a href={telHref(phone)} className="inline-flex items-center gap-2">
                  <SocialGlyph kind="phone" className="h-4 w-4" />
                  {phone}
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${PA_FINANCIAL_EMAIL}`} className="inline-flex items-center gap-2">
                <SocialGlyph kind="email" className="h-4 w-4" />
                {PA_FINANCIAL_EMAIL}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display text-base font-semibold tracking-tight">{pa.footerSocial}</p>
          <ul className="mt-3 grid gap-2">
            <li>
              <a
                href={PA_FINANCIAL_INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2"
              >
                <SocialGlyph kind="instagram" className="h-4 w-4" />
                {pa.footerInstagram}
              </a>
            </li>
            <li>
              <a href={PA_FINANCIAL_FACEBOOK} className="inline-flex items-center gap-2">
                <SocialGlyph kind="facebook" className="h-4 w-4" />
                {pa.footerFacebook}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-5xl text-white/60">
        <a href={staff}>{c.staffLogin}</a>
      </p>
    </footer>
  );
}

function BrandMark({
  client,
  locale,
  home,
}: {
  client: Client;
  locale: Locale;
  home: string;
}) {
  const hola = tHolaTax(locale);
  if (client.slug === HOLA_TAX_SLUG) {
    return (
      <a href={home} className="inline-flex shrink-0 items-center">
        <Image
          src="/clients/hola-tax-service/logo.png"
          alt={hola.logoAlt}
          width={1300}
          height={451}
          className="h-9 w-auto sm:h-11"
        />
      </a>
    );
  }
  if (client.slug === PA_FINANCIAL_SLUG) {
    const brand = client.logoText?.trim() || "P&A Financial";
    return (
      <a href={home} className="pa-brand inline-flex shrink-0 items-center gap-3">
        <Image
          src={PA_FINANCIAL_LOGO}
          alt=""
          width={1042}
          height={1042}
          className="pa-brand-logo h-12 w-12 sm:h-14 sm:w-14"
        />
        <span className="pa-brand-name">{brand}</span>
      </a>
    );
  }
  return (
    <a href={home} className="font-display text-lg tracking-tight text-black">
      {client.logoText?.trim() || client.businessName}
    </a>
  );
}

function PaFinancialHero({
  client,
  locale,
  phone,
}: {
  client: Client;
  locale: Locale;
  phone: string;
}) {
  const c = tTaxOffice(locale);
  const pa = paFinancialCopy(locale);
  return (
    <section className="pa-hero" aria-labelledby="pa-hero-title">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="pa-kicker">
            {client.city}
            {" · "}
            {pa.hours}
          </p>
          <h1
            id="pa-hero-title"
            className="mt-4 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-black sm:text-5xl"
          >
            {taxOfficeTagline(client.slug, client.tagline, locale)}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-black/72 sm:text-lg">
            {pa.heroLede}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {phone ? (
              <a href={telHref(phone)} className="site-cta pa-btn px-6 py-2.5 text-sm font-semibold">
                {c.call(phone)}
              </a>
            ) : null}
            <a href="#contact" className="pa-btn-ghost px-6 py-2.5 text-sm font-semibold">
              {c.ctaMessage}
            </a>
          </div>
        </div>
        <PaOwnerPortrait
          alt={`${pa.ownerName}, ${pa.ownerRole} of P&A Financial LLC`}
          sizes="(max-width: 1024px) 100vw, 520px"
          caption={`${pa.ownerName} · ${pa.ownerRole}`}
          className="pa-hero-portrait"
          preload
        />
      </div>
    </section>
  );
}

/**
 * Tax office template: white / black / neon, plus a private client drop box.
 * Hola Tax (first live shop) also gets its logo, favicon, and photo hero.
 * English | Español uses the shared site toggle (`?lang=` + per-slug cookie).
 */
export function TaxOfficeSite({ client, notice, locale }: SiteView) {
  const c = tTaxOffice(locale);
  const hola = tHolaTax(locale);
  const isHola = client.slug === HOLA_TAX_SLUG;
  const isPaFinancial = client.slug === PA_FINANCIAL_SLUG;
  const pa = isPaFinancial ? paFinancialCopy(locale) : null;
  const preview = isPreviewClient(client);
  const home = preview
    ? siteHomeHref(client)
    : withSiteLangPath(`/s/${client.slug}`, locale);
  const portal = withSiteLangPath(portalPath(client.slug), locale);
  const staff = withSiteLangPath(portalPath(client.slug, "/staff/login"), locale);
  const field = isPaFinancial
    ? "pa-field"
    : "rounded-none border border-[#00FF66] bg-white px-3 py-2 text-black outline-none focus:shadow-[0_0_0_3px_rgba(0,255,102,0.25)]";
  const panel = isPaFinancial
    ? "pa-panel"
    : "border border-[#00FF66] bg-white";
  const phone = String(client.phone || "").trim();
  const listedServices = Array.isArray(client.services) ? client.services : [];
  const services = isHola
    ? withHolaTaxListedServices(listedServices)
    : listedServices;
  const shop = tShop(locale);
  const taxPhotos = SHOP_PHOTOS.tax;
  const reviews = preview ? DEMO_REVIEWS.tax : [];
  const hours =
    client.slug === PA_FINANCIAL_SLUG
      ? paFinancialHours(locale)
      : displayHours(client.hours, "tax", locale);
  return (
    <div
      data-template="tax"
      lang={locale}
      className={`${clientThemeClass("tax")}${client.slug === PA_FINANCIAL_SLUG ? " theme-pa-financial" : ""} flex min-h-full flex-col bg-white text-black`}
    >
      <header className="shop-header sticky top-0 z-40 border-b border-[#00FF66] bg-white/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <BrandMark client={client} locale={locale} home={home} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {preview ? null : (
              <SiteLangToggle
                slug={client.slug}
                locale={locale}
                label={c.langNav}
              />
            )}
            <nav className="flex flex-wrap items-center gap-4 text-sm">
              {preview ? null : (
                <a
                  href={portal}
                  className="font-semibold text-black hover:text-[#00E840]"
                >
                  {c.clientLogin}
                </a>
              )}
              {phone ? (
              <a
                href={telHref(client.phone)}
                className="site-phone font-semibold text-[#00E840] hover:text-[#00FF66]"
              >
                {client.phone}
              </a>
              ) : null}
            </nav>
          </div>
        </div>
      </header>

      {isPaFinancial && pa ? (
        <PaFinancialHero client={client} locale={locale} phone={phone} />
      ) : isHola ? (
        <section className="relative isolate min-h-[70vh] overflow-hidden border-b border-[#00FF66] lg:min-h-[calc(100svh-4.75rem)]">
          <Image
            src={HOLA_PHOTOS.office}
            alt={hola.photos.office}
            fill
            preload
            sizes="100vw"
            className="object-cover object-[72%_center]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/15"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center px-5 py-16 lg:min-h-[calc(100svh-4.75rem)] lg:py-20">
            <p className="text-sm uppercase tracking-[0.22em] text-[#00FF66]">
              {client.city}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-tight text-white sm:text-5xl">
              {taxOfficeTagline(client.slug, client.tagline, locale)}
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/90 sm:text-lg">
              {taxOfficeAbout(client.slug, client.about, locale)}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={telHref(client.phone)}
                className="bg-[#00FF66] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00E840]"
              >
                {c.call(client.phone)}
              </a>
              <a
                href="#bookkeeping"
                className="border border-[#00FF66] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00FF66] hover:text-black"
              >
                {hola.booksHeroCta}
              </a>
              <a
                href="#contact"
                className="border border-[#00FF66] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00FF66] hover:text-black"
              >
                {c.ctaMessage}
              </a>
            </div>
            <p className="mt-4 max-w-xl text-sm text-white/80">
              <a href={portal} className="font-semibold text-[#00FF66] hover:text-[#00E840]">
                {c.clientLogin}
              </a>
              {" — "}
              {c.portalHint}
            </p>
          </div>
        </section>
      ) : (
        <section className="relative isolate min-h-[70vh] overflow-hidden border-b border-[#00FF66] lg:min-h-[calc(100svh-4.75rem)]">
          <Image
            src={taxPhotos.hero.src}
            alt={photoAlt(taxPhotos.hero, locale)}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/15"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center px-5 py-16 lg:min-h-[calc(100svh-4.75rem)] lg:py-20">
            <p className="text-sm uppercase tracking-[0.22em] text-[#00FF66]">
              {client.city}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-tight text-white sm:text-5xl">
              {taxOfficeTagline(client.slug, client.tagline, locale)}
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/90 sm:text-lg">
              {taxOfficeAbout(client.slug, client.about, locale)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {phone ? (
                <a
                  href={telHref(client.phone)}
                  className="site-cta bg-[#00FF66] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00E840]"
                >
                  {c.call(client.phone)}
                </a>
              ) : null}
              <a
                href="#contact"
                className="border border-[#00FF66] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00FF66] hover:text-black"
              >
                {c.ctaMessage}
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-5xl px-5 py-14">
        {isHola ? (
          <>
            <div className="mb-6">
              <SiteStill
                src={HOLA_PHOTOS.llcSigning}
                alt={hola.photos.llcSigning}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="aspect-[16/7] sm:aspect-[2.35/1]"
              />
            </div>
            <div className="mb-10 grid gap-3 sm:grid-cols-2">
              <SiteStill
                src={HOLA_PHOTOS.calculator}
                alt={hola.photos.calculator}
                sizes="(max-width: 640px) 100vw, 512px"
                className="aspect-[3/2]"
              />
              <SiteStill
                src={HOLA_PHOTOS.desk}
                alt={hola.photos.desk}
                sizes="(max-width: 640px) 100vw, 512px"
                className="aspect-[3/2]"
              />
            </div>
          </>
        ) : isPaFinancial && pa ? (
          <aside id="about" className="pa-about mb-14 max-w-3xl">
            <p className="pa-kicker">{pa.aboutKicker}</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-black sm:text-4xl">
              {pa.aboutTitle}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-black/75">
              {taxOfficeAbout(client.slug, client.about, locale)}
            </p>
            <p className="mt-6 font-display text-xl tracking-tight text-black">
              {pa.ownerName}
            </p>
            <p className="mt-1 text-sm tracking-[0.12em] uppercase text-black/55">
              {pa.ownerRole}
            </p>
          </aside>
        ) : (
          <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {taxPhotos.gallery.map((photo) => (
              <SiteStill
                key={photo.src}
                src={photo.src}
                alt={photoAlt(photo, locale)}
                sizes="(max-width: 768px) 50vw, 256px"
                className="aspect-[4/5]"
              />
            ))}
          </div>
        )}
        {client.slug === PA_FINANCIAL_SLUG ? (
          <PaFinancialServices services={services} locale={locale} />
        ) : (
          <>
            <h2 className="font-display text-3xl tracking-tight text-black">
              {c.servicesTitle}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const llc = isHola && /llc/i.test(service);
            if (llc) {
              return (
                <li key={service} className="bg-white sm:col-span-1">
                  <SiteStill
                    src={HOLA_PHOTOS.llcHandshake}
                    alt={hola.photos.llcHandshake}
                    sizes="(max-width: 640px) 100vw, 512px"
                    className="aspect-[3/2]"
                  />
                  <p className="border-x border-b border-[#00FF66] px-4 py-3 text-black">
                    {taxOfficeServiceLabel(service, locale)}
                  </p>
                </li>
              );
            }
            if (isHola && isHolaTaxBookkeepingService(service)) {
              return (
                <li
                  key={service}
                  className="border border-[#00FF66] bg-white px-4 py-3 text-black"
                >
                  <a href="#bookkeeping" className="block hover:text-[#00E840]">
                    {taxOfficeServiceLabel(service, locale)}
                    <span className="mt-1 block text-sm font-semibold text-[#00E840]">
                      {hola.booksPrice}
                    </span>
                  </a>
                </li>
              );
            }
            return (
              <li
                key={service}
                className="border border-[#00FF66] bg-white px-4 py-3 text-black"
              >
                {taxOfficeServiceLabel(service, locale)}
              </li>
            );
          })}
        </ul>
          </>
        )}
        {isHola ? (
          <aside
            id="bookkeeping"
            className="mt-6 border border-[#00FF66] bg-white px-5 py-6"
          >
            <p className="text-sm uppercase tracking-[0.22em] text-[#00E840]">
              {hola.booksKicker}
            </p>
            <h3 className="mt-2 font-display text-2xl tracking-tight text-black">
              {hola.booksTitle}
            </h3>
            <p className="mt-2 font-display text-3xl tracking-tight text-black">
              {hola.booksPrice}
            </p>
            <p className="mt-3 text-black/80">{hola.booksLead}</p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-3">
              {hola.booksSteps.map((step, index) => (
                <li
                  key={step}
                  className="border border-[#00FF66] px-4 py-3 text-black"
                >
                  <p className="text-sm font-semibold text-[#00E840]">
                    {index + 1}
                  </p>
                  <p className="mt-2 text-sm text-black">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-black/80">{hola.booksTaxNote}</p>
            <p className="mt-2 text-black/80">{hola.booksCatchup}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={telHref(client.phone)}
                className="bg-[#00FF66] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00E840]"
              >
                {hola.ctaCallOrText(client.phone)}
              </a>
              <a
                href="#contact"
                className="border border-[#00FF66] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF66]/10"
              >
                {c.ctaMessage}
              </a>
            </div>
          </aside>
        ) : null}
        {isHola ? (
          <aside className="mt-6 grid gap-3 sm:grid-cols-2">
            <SiteStill
              src={HOLA_PHOTOS.llcStorefront}
              alt={hola.photos.llcStorefront}
              sizes="(max-width: 640px) 100vw, 512px"
              className="aspect-[3/2]"
            />
            <div className="flex flex-col justify-center border border-[#00FF66] bg-white px-5 py-5">
              <p className="text-sm uppercase tracking-[0.22em] text-[#00E840]">
                {hola.llcPromoKicker}
              </p>
              <h3 className="mt-2 font-display text-2xl tracking-tight text-black">
                {hola.llcPromoTitle}
              </h3>
              <p className="mt-3 text-black/80">{hola.llcPromo}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={telHref(client.phone)}
                  className="bg-[#00FF66] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00E840]"
                >
                  {c.call(client.phone)}
                </a>
                <a
                  href="#contact"
                  className="border border-[#00FF66] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF66]/10"
                >
                  {c.ctaMessage}
                </a>
              </div>
            </div>
          </aside>
        ) : null}
        <div className={`mt-10 grid gap-4 p-6 sm:grid-cols-2 ${panel}`}>
          <div>
            <p className="font-display text-2xl tracking-tight text-black">
              {shop.hoursTitle}
            </p>
            <p className="mt-3 text-black">{hours}</p>
            {preview ? (
              <p className="mt-2 text-xs text-black/60">{shop.previewHours}</p>
            ) : null}
          </div>
          <div>
            <p className="text-black">
              {client.address}
              {client.address ? <br /> : null}
              {client.city}
            </p>
            {phone ? (
              <p className="mt-2">
                <a
                  href={telHref(client.phone)}
                  className="site-phone font-semibold text-[#00E840]"
                >
                  {client.phone}
                </a>
              </p>
            ) : null}
            {preview ? (
              <p className="mt-2 text-xs text-black/60">
                {shop.previewAddress}
                {isSamplePhone(client.phone) ? ` ${shop.previewPhone}` : ""}
              </p>
            ) : null}
          </div>
        </div>

        {reviews.length ? (
          <div id="reviews" className="mt-12">
            <h2 className="font-display text-3xl tracking-tight text-black">
              {shop.reviewsTitle}
            </h2>
            <p className="mt-2 text-sm text-black/70">{shop.previewReviews}</p>
            <ul className="mt-6 grid gap-3 md:grid-cols-3">
              {reviews.map((review) => (
                <li
                  key={review.name}
                  className="border border-[#00FF66] bg-white px-4 py-4"
                >
                  <p className="text-[#00E840]">★★★★★</p>
                  <p className="mt-3 text-sm text-black">
                    {locale === "es" ? review.bodyEs : review.body}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-black">
                    {review.name}
                  </p>
                  <p className="text-xs text-black/60">{review.city}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {preview ? (
          <div className="mt-8 border border-[#00FF66] bg-white p-6">
            <p className="font-display text-xl tracking-tight text-black">
              {c.contactTitle}
            </p>
            <PreviewContactForm
              locale={locale}
              fieldClass={field}
              buttonClass="justify-self-start bg-[#00FF66] px-5 py-2 text-sm font-semibold text-black hover:bg-[#00E840]"
              noteClass="text-black/70"
            />
          </div>
        ) : (
        <form
          id="contact"
          action={`/api/sites/${client.slug}/contact`}
          method="post"
          className={`mt-8 grid gap-3 p-6 ${panel}`}
        >
          <input type="hidden" name="lang" value={locale} />
          <p className="font-display text-xl tracking-tight text-black">
            {c.contactTitle}
          </p>
          <ContactNoticeBanner client={client} notice={notice} locale={locale} />
          <input
            name="name"
            required
            maxLength={120}
            placeholder={c.formName}
            autoComplete="name"
            className={field}
          />
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder={c.formEmail}
            autoComplete="email"
            className={field}
          />
          <input
            name="phone"
            maxLength={40}
            placeholder={c.formPhone}
            autoComplete="tel"
            className={field}
          />
          <textarea
            name="message"
            required
            maxLength={4000}
            rows={4}
            placeholder={c.formMessage}
            className={field}
          />
          <button
            type="submit"
            className="justify-self-start bg-[#00FF66] px-5 py-2 text-sm font-semibold text-black hover:bg-[#00E840]"
          >
            {c.formSubmit}
          </button>
        </form>
        )}
        {clientShowsBookJob(client) ? (
          <div className="mt-8 border border-[#00FF66] bg-white p-6">
            <BookJobForm
              slug={client.slug}
              locale={locale}
              leadId={previewLeadId(client) || undefined}
              fieldClass={field}
              buttonClass="justify-self-start bg-[#00FF66] px-5 py-2 text-sm font-semibold text-black hover:bg-[#00E840]"
            />
          </div>
        ) : null}
      </section>

      {isPaFinancial ? <PaFinancialAppointment locale={locale} /> : null}

      {isPaFinancial ? (
        <PaFinancialFooter locale={locale} home={home} phone={phone} staff={staff} />
      ) : (
      <footer className="mt-auto border-t border-[#00FF66] bg-white px-5 py-8 text-sm text-black/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:justify-between">
          <p>
            {client.businessName} · {client.city}
          </p>
          <p>
            {client.address} · {hours}
          </p>
        </div>
        {preview ? null : (
          <p className="mx-auto mt-3 max-w-5xl">
            <a href={staff} className="hover:text-black">
              {c.staffLogin}
            </a>
          </p>
        )}
      </footer>
      )}
    </div>
  );
}
