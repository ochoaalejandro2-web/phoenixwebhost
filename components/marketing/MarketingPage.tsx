import Link from "next/link";
import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { TEMPLATES } from "@/lib/config";
import { requestPath, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function MarketingPage({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <StudioShell>
      <SiteHeader locale={locale} />
      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              {c.heroKicker}
            </p>
            <h1 className="mt-5 max-w-xl font-display text-5xl leading-[1.08] text-cream sm:text-6xl">
              {c.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-soft">
              {c.heroLead}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={requestPath(locale)}
                className="btn-gold rounded-full px-7 py-3 text-sm"
              >
                {c.ctaPrimary}
              </Link>
              <a
                href="#pricing"
                className="rounded-full border border-gold-line px-7 py-3 text-sm font-semibold text-cream hover:border-gold hover:text-gold"
              >
                {c.ctaSecondary}
              </a>
            </div>
            <p className="mt-6 text-sm text-cream-soft">{c.ownerLine}</p>
          </div>
          <div className="rounded-3xl border border-gold-line bg-dusk-card p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.18em] text-gold">
              {locale === "es" ? "Precios claros" : "Clear prices"}
            </p>
            <div className="mt-6 grid gap-6">
              <div>
                <p className="font-display text-6xl tracking-tight text-gold">{c.priceLaunch}</p>
                <p className="mt-1 text-cream-soft">{c.priceLaunchHint}</p>
              </div>
              <div className="rule" />
              <div>
                <p className="font-display text-6xl tracking-tight text-gold">{c.priceMonth}</p>
                <p className="mt-1 text-cream-soft">{c.priceMonthHint}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-y border-gold-line bg-[#0e1626]">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-2">
            <article className="rounded-2xl border border-gold-line bg-dusk-card p-8">
              <h2 className="font-display text-3xl text-cream">{c.launchTitle}</h2>
              <p className="mt-4 leading-relaxed text-cream-soft">{c.launchBody}</p>
            </article>
            <article className="rounded-2xl border border-gold-line bg-dusk-card p-8">
              <h2 className="font-display text-3xl text-cream">{c.monthTitle}</h2>
              <p className="mt-4 leading-relaxed text-cream-soft">{c.monthBody}</p>
            </article>
          </div>
        </section>

        <section id="included" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-cream">{c.includedTitle}</h2>
            <ul className="mt-6 space-y-3">
              {c.included.map((item) => (
                <li key={item} className="flex gap-3 text-cream-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl text-cream">{c.notIncludedTitle}</h2>
            <ul className="mt-6 space-y-3">
              {c.notIncluded.map((item) => (
                <li key={item} className="flex gap-3 text-cream-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/50" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl border border-gold-line bg-dusk-card px-6 py-5">
              <h3 className="font-display text-2xl text-cream">{c.unpaidTitle}</h3>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm/6 text-cream-soft">
                {c.unpaidSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-y border-gold-line bg-[#0e1626]">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-display text-3xl text-cream">{c.templatesTitle}</h2>
            <p className="mt-3 max-w-2xl text-cream-soft">{c.templatesLead}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TEMPLATES.map((tpl) => (
                <article
                  key={tpl.id}
                  className="rounded-2xl border border-gold-line bg-dusk-card p-5"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-gold">
                    {tpl.id}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-cream">
                    {locale === "es" ? tpl.nameEs : tpl.name}
                  </h3>
                  <p className="mt-2 text-sm text-cream-soft">
                    {locale === "es" ? tpl.blurbEs : tpl.blurb}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl text-cream">{c.howTitle}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {c.howSteps.map((step) => (
              <article
                key={step.n}
                className="rounded-2xl border border-gold-line bg-dusk-card p-6"
              >
                <p className="font-display text-3xl text-gold">{step.n}</p>
                <h3 className="mt-2 font-display text-xl text-cream">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-soft">{step.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-gold-line bg-[#0e1626]">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-display text-3xl text-cream">{c.aboutTitle}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-cream-soft">
              {c.aboutBody}
            </p>
          </div>
        </section>

        <section id="request" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-cream">{c.requestTitle}</h2>
            <p className="mt-4 leading-relaxed text-cream-soft">{c.requestLead}</p>
          </div>
          <RequestForm locale={locale} />
        </section>
      </main>
      <SiteFooter locale={locale} />
    </StudioShell>
  );
}
