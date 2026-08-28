import Image from "next/image";
import { PreviewContactForm } from "@/components/sites/PreviewContactForm";
import { SiteLangToggle } from "@/components/sites/SiteLangToggle";
import { HOLA_TAX_SLUG, clientThemeClass } from "@/lib/client-themes";
import { displayHours, isPreviewClient, isSamplePhone, siteHomeHref } from "@/lib/demo";
import { tHolaTax, withHolaTaxLlcService } from "@/lib/hola-tax-i18n";
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
  const phone = client.phone.trim();
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
  return (
    <a href={home} className="font-display text-lg tracking-tight text-black">
      {client.logoText?.trim() || client.businessName}
    </a>
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
  const preview = isPreviewClient(client);
  const home = preview
    ? siteHomeHref(client)
    : withSiteLangPath(`/s/${client.slug}`, locale);
  const portal = withSiteLangPath(portalPath(client.slug), locale);
  const staff = withSiteLangPath(portalPath(client.slug, "/staff/login"), locale);
  const field =
    "rounded-none border border-[#00FF66] bg-white px-3 py-2 text-black outline-none focus:shadow-[0_0_0_3px_rgba(0,255,102,0.25)]";
  const services = isHola
    ? withHolaTaxLlcService(client.services)
    : client.services;
  const shop = tShop(locale);
  const taxPhotos = SHOP_PHOTOS.tax;
  const reviews = preview ? DEMO_REVIEWS.tax : [];
  const hours = displayHours(client.hours, "tax", locale);
  return (
    <div
      data-template="tax"
      lang={locale}
      className={`${clientThemeClass("tax")} flex min-h-full flex-col bg-white text-black`}
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
              {client.phone.trim() ? (
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

      {isHola ? (
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
              {client.phone.trim() ? (
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
        <div className="mt-10 grid gap-4 border border-[#00FF66] bg-white p-6 sm:grid-cols-2">
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
            {client.phone.trim() ? (
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
          className="mt-8 grid gap-3 border border-[#00FF66] bg-white p-6"
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
      </section>

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
    </div>
  );
}
