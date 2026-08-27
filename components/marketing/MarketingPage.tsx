import Link from "next/link";
import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { HeroDevices, TemplatePreview } from "@/components/marketing/HeroDevices";
import { RequestForm } from "@/components/marketing/RequestForm";
import { TEMPLATES } from "@/lib/config";
import { requestPath, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function MarketingPage({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <StudioShell>
      <SiteHeader locale={locale} />
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-8 h-px hairline-gold"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[12%] top-16 h-24 w-px bg-gradient-to-b from-ice via-ice/40 to-transparent shadow-[0_0_18px_#5EC8FF]"
        />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold">
              {c.heroKicker}
            </p>
            <h1 className="mt-5 max-w-xl font-display text-5xl leading-[1.05] text-ink-black sm:text-6xl lg:text-[4.15rem]">
              {c.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-black/70 sm:text-lg">
              {c.heroLead}
            </p>
            <div className="mt-8 flex flex-wrap items-end gap-8">
              <Link
                href={requestPath(locale)}
                className="btn-gold rounded-full px-8 py-3.5 text-sm"
              >
                {c.ctaPrimary}
              </Link>
              <div className="flex gap-6">
                <div>
                  <p className="price-gold font-display text-4xl">{c.priceLaunch}</p>
                  <p className="text-xs text-ink-black/55">{c.priceLaunchHint}</p>
                </div>
                <div className="w-px bg-gradient-to-b from-gold via-ice to-gold" />
                <div>
                  <p className="price-gold font-display text-4xl">{c.priceMonth}</p>
                  <p className="text-xs text-ink-black/55">{c.priceMonthHint}</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-ink-black/60">{c.ownerLine}</p>
          </div>
          <div className="pb-8 lg:pb-4">
            <HeroDevices />
            <p className="mt-12 text-center text-xs tracking-wide text-ink-black/50 lg:text-left">
              {locale === "es"
                ? "Así se ve un sitio de muestra — listo para su negocio."
                : "A sample site on laptop and phone — ready for your shop."}
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="border-y border-gold/20 bg-mist">
        <div className="mx-auto grid max-w-6xl gap-px px-5 py-0 md:grid-cols-2">
          <article className="py-12 md:pr-10">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">{c.priceLaunch}</p>
            <h2 className="mt-2 font-display text-3xl text-ink-black">{c.launchTitle}</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-black/70">{c.launchBody}</p>
          </article>
          <article className="border-t border-gold/20 py-12 md:border-l md:border-t-0 md:pl-10">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">{c.priceMonth}</p>
            <h2 className="mt-2 font-display text-3xl text-ink-black">{c.monthTitle}</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-black/70">{c.monthBody}</p>
          </article>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gold">
              {locale === "es" ? "Puntos de partida" : "Starting points"}
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink-black sm:text-4xl">
              {c.templatesTitle}
            </h2>
          </div>
          <p className="max-w-md text-sm text-ink-black/65">{c.templatesLead}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((tpl) => (
            <article
              key={tpl.id}
              className="group rounded-2xl border border-gold/25 bg-snow p-3 transition hover:border-ice"
            >
              <TemplatePreview id={tpl.id} />
              <div className="px-2 pb-3 pt-4">
                <h3 className="font-display text-xl text-ink-black">
                  {locale === "es" ? tpl.nameEs : tpl.name}
                </h3>
                <p className="mt-2 text-sm text-ink-black/65">
                  {locale === "es" ? tpl.blurbEs : tpl.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="included" className="border-y border-gold/20 bg-mist">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl text-ink-black">{c.includedTitle}</h2>
            <p className="mt-4 text-ink-black/70">
              {locale === "es"
                ? "Cuidado mensual limitado. Nunca cambios ilimitados."
                : "Limited monthly care. Never unlimited changes."}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.included.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-gold/25 bg-snow px-4 py-3 text-sm text-ink-black/75"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-20 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-xl text-ink-black">{c.notIncludedTitle}</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-black/70">
              {c.notIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gold/25 bg-snow p-6 ice-glow">
            <h3 className="font-display text-xl text-ink-black">{c.unpaidTitle}</h3>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-black/70">
              {c.unpaidSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-3xl text-ink-black">{c.howTitle}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {c.howSteps.map((step) => (
            <article key={step.n}>
              <p className="price-gold font-display text-5xl">{step.n}</p>
              <h3 className="mt-3 font-display text-xl text-ink-black">{step.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-black/70">{step.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-gold/20 bg-mist">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-ink-black">{c.aboutTitle}</h2>
            <p className="mt-4 leading-relaxed text-ink-black/70">{c.aboutBody}</p>
            <h3 className="mt-10 font-display text-2xl text-ink-black">{c.requestTitle}</h3>
            <p className="mt-3 text-ink-black/70">{c.requestLead}</p>
          </div>
          <RequestForm locale={locale} />
        </div>
      </section>

      <SiteFooter locale={locale} />
    </StudioShell>
  );
}
