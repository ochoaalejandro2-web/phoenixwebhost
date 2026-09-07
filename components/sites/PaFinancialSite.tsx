import Image from "next/image";
import { SiteLangToggle } from "@/components/sites/SiteLangToggle";
import {
  PA_FINANCIAL_BRAND,
  PA_FINANCIAL_EMAIL,
  PA_FINANCIAL_INSTAGRAM,
  PA_FINANCIAL_LEGAL,
  PA_FINANCIAL_LOGO_SRC,
  PA_FINANCIAL_SERVICES,
  PA_FINANCIAL_SLUG,
  PA_FINANCIAL_WHATSAPP,
  paFinancialHours,
  paFinancialServiceBlurb,
  paFinancialServiceLabel,
  tPaFinancial,
  type PaFinancialPage,
} from "@/lib/pa-financial-i18n";
import { withSiteLangPath } from "@/lib/site-locale";
import { portalPath } from "@/lib/tax-office";
import type { Client, ContactNotice, Locale } from "@/lib/types";

const BURGUNDY = "#871A1A";

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function pagePath(page: PaFinancialPage) {
  if (page === "home") return `/s/${PA_FINANCIAL_SLUG}`;
  return `/s/${PA_FINANCIAL_SLUG}/${page}`;
}

function BrandMark({ locale, home }: { locale: Locale; home: string }) {
  const copy = tPaFinancial(locale);
  if (PA_FINANCIAL_LOGO_SRC) {
    return (
      <a href={home} className="inline-flex shrink-0 items-center">
        <Image
          src={PA_FINANCIAL_LOGO_SRC}
          alt={copy.logoAlt}
          width={640}
          height={160}
          className="h-10 w-auto"
        />
      </a>
    );
  }
  return (
    <a href={home} className="font-display text-lg tracking-tight text-black">
      <span className="font-semibold" style={{ color: BURGUNDY }}>
        {PA_FINANCIAL_BRAND}
      </span>
    </a>
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
  const copy = tPaFinancial(locale);
  const phone = String(client.phone || "").trim();
  const ok = notice === "sent";
  const text =
    notice === "sent"
      ? copy.noticeSent(client.businessName)
      : notice === "no-email"
        ? copy.noticeNoEmail(phone)
        : notice === "missing"
          ? copy.noticeMissing
          : copy.noticeFailed(phone);
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`text-sm ${ok ? "text-[#871A1A]" : "text-black"}`}
    >
      {text}
    </p>
  );
}

function AppointmentCtas({
  client,
  locale,
  contactHref,
}: {
  client: Client;
  locale: Locale;
  contactHref: string;
}) {
  const copy = tPaFinancial(locale);
  const phone = String(client.phone || "").trim();
  const btn =
    "inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold";
  return (
    <div className="flex flex-wrap gap-3">
      {phone ? (
        <a
          href={telHref(phone)}
          className={`${btn} site-phone site-cta bg-[#871A1A] text-white hover:bg-black`}
        >
          {copy.ctaCall(phone)}
        </a>
      ) : null}
      <a
        href={PA_FINANCIAL_WHATSAPP}
        className={`${btn} border border-[#871A1A] text-[#871A1A] hover:bg-[#871A1A] hover:text-white`}
      >
        {copy.ctaWhatsApp}
      </a>
      <a
        href={`mailto:${PA_FINANCIAL_EMAIL}`}
        className={`${btn} border border-black text-black hover:bg-black hover:text-white`}
      >
        {copy.ctaEmail}
      </a>
      <a
        href={contactHref}
        className={`${btn} border border-black/20 text-black hover:border-[#871A1A] hover:text-[#871A1A]`}
      >
        {copy.ctaMessage}
      </a>
    </div>
  );
}

function SiteNav({
  locale,
  page,
}: {
  locale: Locale;
  page: PaFinancialPage;
}) {
  const copy = tPaFinancial(locale);
  const items: { id: PaFinancialPage; label: string }[] = [
    { id: "home", label: copy.navHome },
    { id: "about", label: copy.navAbout },
    { id: "services", label: copy.navServices },
    { id: "contact", label: copy.navContact },
  ];
  return (
    <nav className="flex flex-wrap items-center gap-4 text-sm">
      {items.map((item) => {
        const href = withSiteLangPath(pagePath(item.id), locale);
        const active = page === item.id;
        return (
          <a
            key={item.id}
            href={href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "font-semibold text-[#871A1A]"
                : "font-semibold text-black hover:text-[#871A1A]"
            }
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

function ContactForm({
  client,
  notice,
  locale,
}: {
  client: Client;
  notice?: ContactNotice | null;
  locale: Locale;
}) {
  const copy = tPaFinancial(locale);
  const field =
    "rounded-none border border-black/20 bg-white px-3 py-2 text-black outline-none focus:border-[#871A1A] focus:shadow-[0_0_0_3px_rgba(135,26,26,0.18)]";
  return (
    <form
      id="contact"
      action={`/api/sites/${client.slug}/contact`}
      method="post"
      className="grid gap-3 border border-black/15 bg-white p-6"
    >
      <input type="hidden" name="lang" value={locale} />
      <input type="hidden" name="returnTo" value="contact" />
      <p className="font-display text-xl tracking-tight text-black">
        {copy.contactTitle}
      </p>
      <ContactNoticeBanner client={client} notice={notice} locale={locale} />
      <input
        name="name"
        required
        maxLength={120}
        placeholder={copy.formName}
        autoComplete="name"
        className={field}
      />
      <input
        name="email"
        type="email"
        required
        maxLength={200}
        placeholder={copy.formEmail}
        autoComplete="email"
        className={field}
      />
      <input
        name="phone"
        maxLength={40}
        placeholder={copy.formPhone}
        autoComplete="tel"
        className={field}
      />
      <textarea
        name="message"
        required
        maxLength={4000}
        rows={4}
        placeholder={copy.formMessage}
        className={field}
      />
      <button
        type="submit"
        className="justify-self-start bg-[#871A1A] px-5 py-2 text-sm font-semibold text-white hover:bg-black"
      >
        {copy.formSubmit}
      </button>
    </form>
  );
}

function HoursCard({ locale }: { locale: Locale }) {
  const copy = tPaFinancial(locale);
  return (
    <div className="grid gap-4 border border-black/15 bg-white p-6 sm:grid-cols-2">
      <div>
        <p className="font-display text-2xl tracking-tight text-black">
          {copy.hoursTitle}
        </p>
        <p className="mt-3 text-black">{copy.hours}</p>
      </div>
      <div>
        <p className="font-display text-2xl tracking-tight text-black">
          {copy.addressLabel}
        </p>
        <p className="mt-3 text-black">{copy.addressSoon}</p>
        <p className="mt-2 text-black">{copy.city}</p>
      </div>
    </div>
  );
}

export function PaFinancialSite({
  client,
  notice,
  locale,
  page = "home",
}: {
  client: Client;
  notice?: ContactNotice | null;
  locale: Locale;
  page?: PaFinancialPage;
}) {
  const copy = tPaFinancial(locale);
  const home = withSiteLangPath(pagePath("home"), locale);
  const about = withSiteLangPath(pagePath("about"), locale);
  const services = withSiteLangPath(pagePath("services"), locale);
  const contact = withSiteLangPath(pagePath("contact"), locale);
  const portal = withSiteLangPath(portalPath(client.slug), locale);
  const staff = withSiteLangPath(portalPath(client.slug, "/staff/login"), locale);
  const phone = String(client.phone || "").trim();
  const hours = paFinancialHours(locale);
  const listed = (
    Array.isArray(client.services) && client.services.length
      ? client.services
      : [...PA_FINANCIAL_SERVICES]
  ).filter(Boolean);

  return (
    <div
      data-template="tax"
      data-client="pa-financial"
      lang={locale}
      className="theme-pa-financial flex min-h-full flex-col bg-white text-black"
    >
      <header className="shop-header sticky top-0 z-40 border-b border-black/10 bg-white/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <BrandMark locale={locale} home={home} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <SiteLangToggle
              slug={client.slug}
              locale={locale}
              label={copy.langNav}
              activeClass="font-semibold text-black"
              idleClass="font-semibold text-[#871A1A] hover:text-black"
            />
            <SiteNav locale={locale} page={page} />
            {phone ? (
              <a
                href={telHref(phone)}
                className="site-phone font-semibold text-[#871A1A] hover:text-black"
              >
                {phone}
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {page === "home" ? (
        <section className="relative isolate overflow-hidden border-b border-black/10 bg-black">
          <div
            className="absolute inset-0 bg-gradient-to-r from-black via-black to-[#871A1A]"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center px-5 py-16 lg:min-h-[calc(100svh-4.75rem)] lg:py-20">
            <p className="text-sm uppercase tracking-[0.22em] text-white/70">
              {copy.kicker}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-tight text-white sm:text-5xl">
              {copy.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/90 sm:text-lg">
              {copy.heroLead}
            </p>
            <div className="mt-8">
              <AppointmentCtas
                client={client}
                locale={locale}
                contactHref={contact}
              />
            </div>
            <p className="mt-4 max-w-xl text-sm text-white/75">
              <a href={portal} className="font-semibold text-white hover:underline">
                {copy.clientLogin}
              </a>
              {" — "}
              {copy.portalHint}
            </p>
          </div>
        </section>
      ) : (
        <section className="border-b border-black/10 bg-black px-5 py-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm uppercase tracking-[0.22em] text-white/70">
              {copy.kicker}
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-tight text-white">
              {page === "about"
                ? copy.aboutTitle
                : page === "services"
                  ? copy.servicesTitle
                  : copy.contactTitle}
            </h1>
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-5xl px-5 py-14">
        {page === "home" ? (
          <>
            <h2 className="font-display text-3xl tracking-tight text-black">
              {copy.servicesTitle}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {listed.map((service) => (
                <li key={service} className="border border-black/15 bg-white px-4 py-4">
                  <a href={services} className="block hover:text-[#871A1A]">
                    <p className="font-semibold text-black">
                      {paFinancialServiceLabel(service, locale)}
                    </p>
                    <p className="mt-2 text-sm text-black/70">
                      {paFinancialServiceBlurb(service, locale)}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="font-display text-3xl tracking-tight text-black">
                  {copy.aboutTitle}
                </h2>
                <p className="mt-4 text-black/80">{copy.about}</p>
                <p className="mt-4">
                  <a
                    href={about}
                    className="font-semibold text-[#871A1A] hover:text-black"
                  >
                    {copy.navAbout} →
                  </a>
                </p>
              </div>
              <HoursCard locale={locale} />
            </div>
            <div id="reviews" className="mt-12 border border-black/15 bg-white px-5 py-6">
              <h2 className="font-display text-3xl tracking-tight text-black">
                {copy.reviewsTitle}
              </h2>
              <p className="mt-3 text-black/70">{copy.reviewsSoon}</p>
            </div>
            <div className="mt-10">
              <AppointmentCtas
                client={client}
                locale={locale}
                contactHref={contact}
              />
            </div>
          </>
        ) : null}

        {page === "about" ? (
          <>
            <p className="text-lg text-black/80">{copy.aboutLead}</p>
            <div className="mt-6 grid gap-4">
              {copy.aboutBody.map((para) => (
                <p key={para} className="max-w-3xl text-black/80">
                  {para}
                </p>
              ))}
            </div>
            <div className="mt-10">
              <HoursCard locale={locale} />
            </div>
            <div className="mt-8">
              <AppointmentCtas
                client={client}
                locale={locale}
                contactHref={contact}
              />
            </div>
          </>
        ) : null}

        {page === "services" ? (
          <>
            <p className="text-lg text-black/80">{copy.servicesLead}</p>
            <ul className="mt-8 grid gap-4">
              {listed.map((service) => (
                <li key={service} className="border border-black/15 bg-white px-5 py-5">
                  <h2 className="font-display text-2xl tracking-tight text-black">
                    {paFinancialServiceLabel(service, locale)}
                  </h2>
                  <p className="mt-3 max-w-3xl text-black/80">
                    {paFinancialServiceBlurb(service, locale)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <AppointmentCtas
                client={client}
                locale={locale}
                contactHref={contact}
              />
            </div>
          </>
        ) : null}

        {page === "contact" ? (
          <>
            <p className="text-lg text-black/80">{copy.contactLead}</p>
            <div className="mt-6">
              <AppointmentCtas
                client={client}
                locale={locale}
                contactHref={contact}
              />
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
              <ContactForm client={client} notice={notice} locale={locale} />
              <div className="grid gap-4">
                <HoursCard locale={locale} />
                <div className="border border-black/15 bg-white p-6 text-sm">
                  {phone ? (
                    <p>
                      <a
                        href={telHref(phone)}
                        className="site-phone font-semibold text-[#871A1A]"
                      >
                        {phone}
                      </a>
                    </p>
                  ) : null}
                  <p className="mt-2">
                    <a
                      href={`mailto:${PA_FINANCIAL_EMAIL}`}
                      className="font-semibold text-[#871A1A]"
                    >
                      {PA_FINANCIAL_EMAIL}
                    </a>
                  </p>
                  <p className="mt-2">
                    <a
                      href={PA_FINANCIAL_INSTAGRAM}
                      className="font-semibold text-[#871A1A]"
                    >
                      {copy.instagram}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>

      {page === "home" ? (
        <section className="mx-auto w-full max-w-5xl px-5 pb-14">
          <ContactForm client={client} notice={notice} locale={locale} />
        </section>
      ) : null}

      <footer className="mt-auto border-t border-black/10 bg-white px-5 py-8 text-sm text-black/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:justify-between">
          <p>
            {PA_FINANCIAL_LEGAL} · {copy.city}
          </p>
          <p>
            {hours}
            {phone ? ` · ${phone}` : ""}
          </p>
        </div>
        <p className="mx-auto mt-3 max-w-5xl">
          <a href={PA_FINANCIAL_INSTAGRAM} className="hover:text-[#871A1A]">
            {copy.instagram}
          </a>
          {" · "}
          <a href={staff} className="hover:text-black">
            {copy.staffLogin}
          </a>
        </p>
      </footer>
    </div>
  );
}
