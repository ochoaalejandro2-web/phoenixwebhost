import Image from "next/image";
import { BookJobForm } from "@/components/sites/BookJobForm";
import { PreviewContactForm } from "@/components/sites/PreviewContactForm";
import { isPreviewClient, previewLeadId, siteHomeHref, displayHours, isSamplePhone } from "@/lib/demo";
import { clientShowsBookJob } from "@/lib/site-addons";
import {
  CLEANING_AREAS,
  CLEANING_PLANS,
  CLEANING_STEPS,
  CLEANING_TRUST,
  photoAlt,
  serviceBlurb,
  serviceName,
  SHOP_PHOTOS,
  SHOP_THEMES,
  shopLayoutReviews,
  type ShopTheme,
} from "@/lib/shop-content";
import { tShop } from "@/lib/shop-i18n";
import type { Client, ContactNotice, Locale, TemplateId } from "@/lib/types";

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n} out of 5`} className="tracking-tight">
      {"★★★★★".slice(0, n)}
      <span className="opacity-30">{"★★★★★".slice(n)}</span>
    </span>
  );
}

function ContactNoticeBanner({
  client,
  notice,
  locale,
  className,
}: {
  client: Client;
  notice?: ContactNotice | null;
  locale: Locale;
  className: string;
}) {
  if (!notice) return null;
  const noticePhone = String(client.phone || "").trim();
  const call = noticePhone
    ? locale === "es"
      ? ` Llame al ${noticePhone}.`
      : ` Please call ${noticePhone}.`
    : "";
  const copy =
    notice === "sent"
      ? locale === "es"
        ? `Su mensaje se envió por correo a ${client.businessName}.`
        : `Your message was emailed to ${client.businessName}.`
      : notice === "no-email"
        ? locale === "es"
          ? `Este negocio no tiene correo registrado, así que no pudimos enviar su mensaje.${call}`
          : `This business has no email on file, so we could not send your message.${call}`
        : notice === "missing"
          ? locale === "es"
            ? "Se requieren el nombre, un correo real y un mensaje."
            : "Name, a real email, and a message are required."
          : locale === "es"
            ? `No pudimos enviar su mensaje por correo.${call || " Intente de nuevo."}`
            : `We could not send your message by email.${call || " Please try again."}`;
  return (
    <p
      role={notice === "sent" ? "status" : "alert"}
      className={`text-sm ${className}`}
    >
      {copy}
    </p>
  );
}

function LiveContactForm({
  client,
  notice,
  locale,
  fieldClass,
  buttonClass,
}: {
  client: Client;
  notice?: ContactNotice | null;
  locale: Locale;
  fieldClass: string;
  buttonClass: string;
}) {
  const c = tShop(locale);
  return (
    <form
      id="contact"
      action={`/api/sites/${client.slug}/contact`}
      method="post"
      className="mt-8 grid gap-3"
    >
      <input type="hidden" name="lang" value={locale} />
      <ContactNoticeBanner
        client={client}
        notice={notice}
        locale={locale}
        className="text-inherit"
      />
      <input
        name="name"
        required
        maxLength={120}
        placeholder={c.formName}
        autoComplete="name"
        className={fieldClass}
      />
      <input
        name="email"
        type="email"
        required
        maxLength={200}
        placeholder={c.formEmail}
        autoComplete="email"
        className={fieldClass}
      />
      <input
        name="phone"
        maxLength={40}
        placeholder={c.formPhone}
        autoComplete="tel"
        className={fieldClass}
      />
      <textarea
        name="message"
        required
        maxLength={4000}
        rows={4}
        placeholder={c.formMessage}
        className={fieldClass}
      />
      <button type="submit" className={buttonClass}>
        {c.formSubmit}
      </button>
    </form>
  );
}

function PhotoStill({
  src,
  alt,
  sizes,
  className,
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={priority}
        className="object-cover"
      />
    </div>
  );
}

export function ShopSite({
  client,
  notice,
  locale,
}: {
  client: Client;
  notice?: ContactNotice | null;
  locale: Locale;
}) {
  const template = client.template as Exclude<TemplateId, "tax">;
  const theme: ShopTheme = SHOP_THEMES[template] ?? SHOP_THEMES.professional;
  const photos = SHOP_PHOTOS[client.template] ?? SHOP_PHOTOS.professional;
  const c = tShop(locale);
  const preview = isPreviewClient(client);
  const home = siteHomeHref(client);
  const displayName = client.logoText?.trim() || client.businessName;
  const phone = String(client.phone || "").trim();
  const services = Array.isArray(client.services) ? client.services : [];
  const hours = displayHours(client.hours, client.template, locale);
  const reviews = shopLayoutReviews(client, preview);
  const isCleaning = client.template === "cleaning";
  const callLabel = phone ? c.call(phone) : c.callShort;
  const ctaBtn = `inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold`;
  const submitBtn = isCleaning
    ? `min-h-11 w-full rounded-full px-5 py-2.5 text-sm font-semibold sm:w-auto sm:justify-self-start ${theme.call} ${theme.callHover}`
    : `justify-self-start rounded-full px-5 py-2.5 text-sm font-semibold ${theme.call} ${theme.callHover}`;
  const showPreviewReviewNote = preview || client.sample;
  const links = isCleaning
    ? [
        { href: "#services", label: c.navServices },
        { href: "#plans", label: c.navPlans },
        { href: "#areas", label: c.navAreas },
        ...(reviews.length ? [{ href: "#reviews", label: c.navReviews }] : []),
        { href: "#contact", label: c.navContact },
      ]
    : [
        { href: "#services", label: c.navServices },
        { href: "#about", label: c.navAbout },
        { href: "#photos", label: c.navPhotos },
        { href: "#hours", label: c.navHours },
        ...(reviews.length ? [{ href: "#reviews", label: c.navReviews }] : []),
        { href: "#contact", label: c.navContact },
      ];

  return (
    <div className={`flex min-h-full flex-col ${theme.page}`}>
      <header
        className={`shop-header sticky top-0 z-40 border-b backdrop-blur ${theme.header} ${theme.headerBorder}`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-5">
          <a
            href={home}
            className={`min-w-0 font-display text-base leading-snug sm:text-lg ${theme.name}`}
          >
            {displayName}
          </a>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <nav className="hidden items-center gap-4 text-sm lg:flex">
              {links.map((link) => (
                <a key={link.href} href={link.href} className={theme.nav}>
                  {link.label}
                </a>
              ))}
            </nav>
            {phone ? (
              <a
                href={telHref(phone)}
                className={`site-phone site-cta inline-flex min-h-11 items-center justify-center rounded-full px-3.5 py-2 text-sm font-semibold sm:px-4 ${theme.call} ${theme.callHover}`}
              >
                <span className="sm:hidden">{c.callShort}</span>
                <span className="hidden sm:inline">{callLabel}</span>
              </a>
            ) : (
              <a
                href="#contact"
                className={`inline-flex min-h-11 items-center justify-center rounded-full px-3.5 py-2 text-sm font-semibold sm:px-4 ${theme.call} ${theme.callHover}`}
              >
                {c.message}
              </a>
            )}
          </div>
        </div>
      </header>

      {client.sample ? (
        <p className={`px-4 py-1 text-center text-[11px] font-semibold tracking-wide sm:px-5 sm:py-1.5 sm:text-xs ${theme.call}`}>
          {c.sampleSite}
        </p>
      ) : null}

      <section className="relative isolate min-h-[70vh] overflow-hidden lg:min-h-[calc(100svh-4.75rem)]">
        <Image
          src={photos.hero.src}
          alt={photoAlt(photos.hero, locale)}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div className={`absolute inset-0 ${theme.overlay}`} aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center px-5 py-16 text-white lg:min-h-[calc(100svh-4.75rem)] lg:py-20">
          <p className={`text-sm uppercase tracking-[0.22em] ${theme.kicker}`}>
            {client.city}
          </p>
          <h1 className={`mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl ${theme.heroTitle ?? "text-white"}`}>
            {client.tagline}
          </h1>
          <p className={`mt-5 max-w-xl text-base sm:text-lg ${theme.heroLead ?? "text-white/90"}`}>
            {client.about}
          </p>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-xl sm:flex-row sm:flex-wrap sm:items-center">
            {isCleaning ? (
              <>
                <a
                  href="#contact"
                  className={`${ctaBtn} w-full sm:w-auto ${theme.call} ${theme.callHover}`}
                >
                  {c.estimate}
                </a>
                {phone ? (
                  <a
                    href={telHref(phone)}
                    className={`site-cta ${ctaBtn} w-full sm:w-auto ${theme.ghostBtn}`}
                  >
                    {callLabel}
                  </a>
                ) : null}
              </>
            ) : (
              <>
                {phone ? (
                  <a
                    href={telHref(phone)}
                    className={`site-cta ${ctaBtn} w-full sm:w-auto ${theme.call} ${theme.callHover}`}
                  >
                    {callLabel}
                  </a>
                ) : null}
                <a
                  href="#contact"
                  className={`${ctaBtn} w-full sm:w-auto ${theme.ghostBtn}`}
                >
                  {c.message}
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {isCleaning ? (
        <section className="border-b border-[#d5e8e3] bg-white">
          <ul className="mx-auto grid max-w-5xl gap-4 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {CLEANING_TRUST.map((item) => (
              <li key={item.title}>
                <p className={`text-sm font-semibold ${theme.sectionTitle}`}>
                  {locale === "es" ? item.titleEs : item.title}
                </p>
                <p className={`mt-2 text-sm leading-relaxed ${theme.muted}`}>
                  {locale === "es" ? item.bodyEs : item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="services" className="mx-auto w-full max-w-5xl px-5 py-16">
        <h2 className={`font-display text-3xl ${theme.sectionTitle}`}>
          {c.servicesTitle(client.template)}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {services.map((service) => {
            const blurb = serviceBlurb(service, locale);
            return (
              <li
                key={service}
                className={`rounded-2xl border p-5 ${theme.card} ${theme.cardBorder}`}
              >
                <h3 className="font-display text-xl">{serviceName(service, locale)}</h3>
                {blurb ? (
                  <p className={`mt-2 text-sm leading-relaxed ${theme.muted}`}>{blurb}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {isCleaning ? (
        <>
          <section id="plans" className="mx-auto w-full max-w-5xl px-5 py-8">
            <h2 className={`font-display text-3xl ${theme.sectionTitle}`}>{c.plansTitle}</h2>
            <p className={`mt-2 text-sm ${theme.muted}`}>{c.plansNote}</p>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {CLEANING_PLANS.map((plan) => (
                <li
                  key={plan.name}
                  className={`rounded-2xl border p-5 ${theme.card} ${theme.cardBorder}`}
                >
                  <h3 className="font-display text-xl">
                    {locale === "es" ? plan.nameEs : plan.name}
                  </h3>
                  <p className={`mt-2 text-lg font-semibold ${theme.sectionTitle}`}>
                    {locale === "es" ? plan.priceEs : plan.price}
                  </p>
                  <p className={`mt-2 text-sm leading-relaxed ${theme.muted}`}>
                    {locale === "es" ? plan.bodyEs : plan.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mx-auto w-full max-w-5xl px-5 py-12">
            <h2 className={`font-display text-3xl ${theme.sectionTitle}`}>{c.howTitle}</h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              {CLEANING_STEPS.map((step) => (
                <li
                  key={step.n}
                  className={`rounded-2xl border p-5 ${theme.card} ${theme.cardBorder}`}
                >
                  <p className="text-sm font-semibold text-[#1b7a72]">{step.n}</p>
                  <h3 className="mt-2 font-display text-xl">
                    {locale === "es" ? step.titleEs : step.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-relaxed ${theme.muted}`}>
                    {locale === "es" ? step.bodyEs : step.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section id="areas" className="mx-auto w-full max-w-5xl px-5 py-8">
            <h2 className={`font-display text-3xl ${theme.sectionTitle}`}>{c.areasTitle}</h2>
            <p className={`mt-2 text-sm ${theme.muted}`}>{c.areasLead}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {CLEANING_AREAS.map((area) => (
                <li
                  key={area}
                  className={`rounded-full border px-4 py-2 text-sm ${theme.card} ${theme.cardBorder}`}
                >
                  {area}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}

      <section id="about" className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-6 sm:grid-cols-2 sm:items-center">
        <PhotoStill
          src={photos.gallery[0].src}
          alt={photoAlt(photos.gallery[0], locale)}
          sizes="(max-width: 640px) 100vw, 512px"
          className={`aspect-[4/3] rounded-2xl border ${theme.cardBorder}`}
        />
        <div>
          <h2 className={`font-display text-3xl ${theme.sectionTitle}`}>{c.aboutTitle}</h2>
          <p className={`mt-4 text-lg leading-relaxed ${theme.muted}`}>{client.about}</p>
          {phone ? (
            <a
              href={telHref(phone)}
              className={`site-cta mt-6 ${ctaBtn} ${theme.call} ${theme.callHover}`}
            >
              {callLabel}
            </a>
          ) : null}
        </div>
      </section>

      <section id="photos" className="mx-auto w-full max-w-5xl px-5 py-16">
        <h2 className={`font-display text-3xl ${theme.sectionTitle}`}>{c.photosTitle}</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.gallery.map((photo) => (
            <PhotoStill
              key={photo.src}
              src={photo.src}
              alt={photoAlt(photo, locale)}
              sizes="(max-width: 768px) 50vw, 256px"
              className={`aspect-[4/5] rounded-xl border ${theme.cardBorder}`}
            />
          ))}
        </div>
      </section>

      <section id="hours" className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className={`grid gap-6 rounded-2xl border p-6 sm:grid-cols-2 ${theme.card} ${theme.cardBorder}`}>
          <div>
            <h2 className={`font-display text-2xl ${theme.sectionTitle}`}>{c.hoursTitle}</h2>
            <p className={`mt-3 text-lg ${theme.body}`}>{hours}</p>
            {preview ? (
              <p className={`mt-2 text-xs ${theme.muted}`}>{c.previewHours}</p>
            ) : null}
          </div>
          <div>
            <p className={`text-lg ${theme.body}`}>
              {client.address}
              {client.address && client.city ? <br /> : null}
              {client.city}
            </p>
            {phone ? (
              <p className="mt-2">
                <a href={telHref(phone)} className="site-phone font-semibold">
                  {phone}
                </a>
              </p>
            ) : null}
            {preview ? (
              <p className={`mt-2 text-xs ${theme.muted}`}>
                {c.previewAddress}
                {isSamplePhone(phone) ? ` ${c.previewPhone}` : ""}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {reviews.length ? (
        <section id="reviews" className="mx-auto w-full max-w-5xl px-5 py-12">
          <h2 className={`font-display text-3xl ${theme.sectionTitle}`}>{c.reviewsTitle}</h2>
          {showPreviewReviewNote ? (
            <p className={`mt-2 text-sm ${theme.muted}`}>{c.previewReviews}</p>
          ) : null}
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <li
                key={review.name}
                className={`rounded-2xl border p-5 ${theme.card} ${theme.cardBorder}`}
              >
                <p className={theme.kicker}>
                  <Stars n={review.stars} />
                </p>
                <p className={`mt-3 text-sm leading-relaxed ${theme.body}`}>
                  {locale === "es" ? review.bodyEs : review.body}
                </p>
                <p className={`mt-4 text-sm font-semibold ${theme.body}`}>
                  {review.name}
                </p>
                <p className={`text-xs ${theme.muted}`}>{review.city}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-5xl px-5 pb-16">
        <div className={`rounded-2xl border p-6 ${theme.card} ${theme.cardBorder}`}>
          <p className={`font-display text-2xl ${theme.sectionTitle}`}>{c.contactTitle(client.template)}</p>
          {isCleaning ? (
            <p className={`mt-2 text-sm ${theme.muted}`}>{c.spanishNote}</p>
          ) : null}
          {preview ? (
            <PreviewContactForm
              locale={locale}
              fieldClass={theme.field}
              buttonClass={submitBtn}
              noteClass={theme.muted}
            />
          ) : (
            <LiveContactForm
              client={client}
              notice={notice}
              locale={locale}
              fieldClass={theme.field}
              buttonClass={submitBtn}
            />
          )}
        </div>
        {clientShowsBookJob(client) ? (
          <div className={`mt-6 rounded-2xl border p-6 ${theme.card} ${theme.cardBorder}`}>
            <BookJobForm
              slug={client.slug}
              locale={locale}
              leadId={previewLeadId(client) || undefined}
              fieldClass={theme.field}
              buttonClass={submitBtn}
            />
          </div>
        ) : null}
      </section>

      <footer className={`mt-auto border-t px-5 py-8 text-sm ${theme.footerBorder} ${theme.footer}`}>
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:justify-between">
          <p>
            {client.businessName} · {client.city}
          </p>
          <p>
            {client.address} · {hours}
          </p>
        </div>
        {isCleaning && client.sample ? (
          <p className="mx-auto mt-3 max-w-5xl text-xs">{c.demoFooter}</p>
        ) : null}
      </footer>
    </div>
  );
}
