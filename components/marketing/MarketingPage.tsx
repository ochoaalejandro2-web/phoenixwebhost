import Image from "next/image";
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
    <StudioShell grain={false}>
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src="/phoenix-dusk-hero.png"
          alt="Downtown Phoenix skyline at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220] via-[#0b1220]/78 to-[#0b1220]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-[#0b1220]/45" />
        <SiteHeader locale={locale} overlay />
        <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl items-center gap-12 px-5 pb-20 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:pb-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold">
              {c.heroKicker}
            </p>
            <h1 className="mt-5 max-w-xl font-display text-5xl leading-[1.05] text-cream sm:text-6xl lg:text-[4.15rem]">
              {c.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-cream-soft sm:text-lg">
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
                  <p className="font-display text-4xl text-gold">{c.priceLaunch}</p>
                  <p className="text-xs text-cream-soft">{c.priceLaunchHint}</p>
                </div>
                <div className="w-px bg-gold-line" />
                <div>
                  <p className="font-display text-4xl text-gold">{c.priceMonth}</p>
                  <p className="text-xs text-cream-soft">{c.priceMonthHint}</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-cream-soft">{c.ownerLine}</p>
          </div>
          <div className="pb-8 lg:pb-4">
            <HeroDevices />
            <p className="mt-12 text-center text-xs tracking-wide text-cream-soft/80 lg:text-left">
              {locale === "es"
                ? "Así se ve un sitio de muestra — listo para su negocio."
                : "A sample site on laptop and phone — ready for your shop."}
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="border-y border-gold-line bg-[#0e1626]">
        <div className="mx-auto grid max-w-6xl gap-px px-5 py-0 md:grid-cols-2">
          <article className="py-12 md:pr-10">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">{c.priceLaunch}</p>
            <h2 className="mt-2 font-display text-3xl text-cream">{c.launchTitle}</h2>
            <p className="mt-4 max-w-md leading-relaxed text-cream-soft">{c.launchBody}</p>
          </article>
          <article className="border-t border-gold-line py-12 md:border-l md:border-t-0 md:pl-10">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">{c.priceMonth}</p>
            <h2 className="mt-2 font-display text-3xl text-cream">{c.monthTitle}</h2>
            <p className="mt-4 max-w-md leading-relaxed text-cream-soft">{c.monthBody}</p>
          </article>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gold">
              {locale === "es" ? "Puntos de partida" : "Starting points"}
            </p>
            <h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">
              {c.templatesTitle}
            </h2>
          </div>
          <p className="max-w-md text-sm text-cream-soft">{c.templatesLead}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((tpl) => (
            <article
              key={tpl.id}
              className="group rounded-2xl border border-gold-line bg-dusk-card p-3 transition hover:border-gold"
            >
              <TemplatePreview id={tpl.id} />
              <div className="px-2 pb-3 pt-4">
                <h3 className="font-display text-xl text-cream">
                  {locale === "es" ? tpl.nameEs : tpl.name}
                </h3>
                <p className="mt-2 text-sm text-cream-soft">
                  {locale === "es" ? tpl.blurbEs : tpl.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="included" className="border-y border-gold-line bg-[#0e1626]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl text-cream">{c.includedTitle}</h2>
            <p className="mt-4 text-cream-soft">
              {locale === "es"
                ? "Cuidado mensual limitado. Nunca cambios ilimitados."
                : "Limited monthly care. Never unlimited changes."}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.included.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-gold-line bg-dusk-card px-4 py-3 text-sm text-cream-soft"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-20 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-xl text-cream">{c.notIncludedTitle}</h3>
            <ul className="mt-4 space-y-2 text-sm text-cream-soft">
              {c.notIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gold-line bg-dusk-card p-6">
            <h3 className="font-display text-xl text-cream">{c.unpaidTitle}</h3>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-cream-soft">
              {c.unpaidSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-3xl text-cream">{c.howTitle}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {c.howSteps.map((step) => (
            <article key={step.n}>
              <p className="font-display text-5xl text-gold">{step.n}</p>
              <h3 className="mt-3 font-display text-xl text-cream">{step.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-soft">{step.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-gold-line bg-[#0e1626]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-cream">{c.aboutTitle}</h2>
            <p className="mt-4 leading-relaxed text-cream-soft">{c.aboutBody}</p>
            <h3 className="mt-10 font-display text-2xl text-cream">{c.requestTitle}</h3>
            <p className="mt-3 text-cream-soft">{c.requestLead}</p>
          </div>
          <RequestForm locale={locale} />
        </div>
      </section>

      <SiteFooter locale={locale} />
    </StudioShell>
  );
}
