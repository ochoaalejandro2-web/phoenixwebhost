import { SiteLangToggle } from "@/components/sites/SiteLangToggle";
import { clientThemeClass } from "@/lib/client-themes";
import { withSiteLangPath } from "@/lib/site-locale";
import { portalPath } from "@/lib/tax-office";
import {
  tTaxOffice,
  taxOfficeAbout,
  taxOfficeServiceLabel,
  taxOfficeTagline,
} from "@/lib/tax-office-i18n";
import type { Client, ContactNotice, Locale } from "@/lib/types";

type SiteView = {
  client: Client;
  notice?: ContactNotice | null;
  locale: Locale;
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
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

/**
 * Tax office template: white / black / neon, plus a private client drop box.
 * English | Español uses the shared site toggle (`?lang=` + per-slug cookie).
 * Hours, address, and phone stay as stored.
 */
export function TaxOfficeSite({ client, notice, locale }: SiteView) {
  const c = tTaxOffice(locale);
  const home = withSiteLangPath(`/s/${client.slug}`, locale);
  const portal = withSiteLangPath(portalPath(client.slug), locale);
  const staff = withSiteLangPath(portalPath(client.slug, "/staff/login"), locale);
  const field =
    "rounded-none border border-[#00FF66] bg-white px-3 py-2 text-black outline-none focus:shadow-[0_0_0_3px_rgba(0,255,102,0.25)]";
  return (
    <div
      data-template="tax"
      lang={locale}
      className={`${clientThemeClass("tax")} flex min-h-full flex-col bg-white text-black`}
    >
      <header className="border-b border-[#00FF66] bg-white px-5 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <a href={home} className="font-display text-lg tracking-tight text-black">
            {client.businessName}
          </a>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <SiteLangToggle
              slug={client.slug}
              locale={locale}
              label={c.langNav}
            />
            <nav className="flex flex-wrap items-center gap-4 text-sm">
              <a
                href={portal}
                className="font-semibold text-black hover:text-[#00E840]"
              >
                {c.clientLogin}
              </a>
              <a
                href={telHref(client.phone)}
                className="font-semibold text-[#00E840] hover:text-[#00FF66]"
              >
                {client.phone}
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="border-b border-[#00FF66] bg-white">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <p className="text-sm uppercase tracking-[0.22em] text-[#00E840]">
            {client.city}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight tracking-tight text-black">
            {taxOfficeTagline(client.slug, client.tagline, locale)}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-black/80">
            {taxOfficeAbout(client.slug, client.about, locale)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={portal}
              className="bg-[#00FF66] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00E840]"
            >
              {c.clientLogin}
            </a>
            <a
              href={telHref(client.phone)}
              className="border border-[#00FF66] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF66]/10"
            >
              {c.call(client.phone)}
            </a>
          </div>
          <p className="mt-3 text-sm text-black/70">{c.portalHint}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-14">
        <h2 className="font-display text-3xl tracking-tight text-black">
          {c.servicesTitle}
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {client.services.map((service) => (
            <li
              key={service}
              className="border border-[#00FF66] bg-white px-4 py-3 text-black"
            >
              {taxOfficeServiceLabel(service, locale)}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-black/80">
          {client.hours} · {client.phone}
        </p>
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
      </section>

      <footer className="mt-auto border-t border-[#00FF66] bg-white px-5 py-8 text-sm text-black/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:justify-between">
          <p>
            {client.businessName} · {client.city}
          </p>
          <p>
            {client.address} · {client.hours}
          </p>
        </div>
        <p className="mx-auto mt-3 max-w-5xl">
          <a href={staff} className="hover:text-black">
            {c.staffLogin}
          </a>
        </p>
      </footer>
    </div>
  );
}
