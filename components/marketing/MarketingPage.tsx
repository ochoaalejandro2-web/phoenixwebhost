import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { TEMPLATES } from "@/lib/config";
import { requestPath, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function MarketingPage({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <div className="grain flex min-h-full flex-col">
      <SiteHeader locale={locale} />
      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-mesa">
              {c.heroKicker}
            </p>
            <h1 className="mt-4 max-w-xl text-4xl leading-[1.12] text-ink sm:text-5xl">
              {c.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              {c.heroLead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={requestPath(locale)}
                className="rounded-full bg-clay px-6 py-3 text-sm font-semibold text-white hover:bg-clay-dark"
              >
                {c.ctaPrimary}
              </Link>
              <a
                href="#pricing"
                className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:bg-sand"
              >
                {c.ctaSecondary}
              </a>
            </div>
            <p className="mt-6 text-sm text-ink-soft">{c.ownerLine}</p>
          </div>
          <div className="rounded-3xl border border-line bg-paper p-8 shadow-[0_20px_50px_rgba(28,23,18,0.06)]">
            <p className="text-sm uppercase tracking-[0.16em] text-ink-soft">
              {locale === "es" ? "Precios claros" : "Clear prices"}
            </p>
            <div className="mt-6 grid gap-6">
              <div>
                <p className="font-display text-5xl text-ink">{c.priceLaunch}</p>
                <p className="mt-1 text-ink-soft">{c.priceLaunchHint}</p>
              </div>
              <div className="rule" />
              <div>
                <p className="font-display text-5xl text-ink">{c.priceMonth}</p>
                <p className="mt-1 text-ink-soft">{c.priceMonthHint}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-y border-line bg-sand/70">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-2">
            <article className="rounded-2xl border border-line bg-paper p-8">
              <h2 className="font-display text-3xl">{c.launchTitle}</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">{c.launchBody}</p>
            </article>
            <article className="rounded-2xl border border-line bg-paper p-8">
              <h2 className="font-display text-3xl">{c.monthTitle}</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">{c.monthBody}</p>
            </article>
          </div>
        </section>

        <section id="included" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">{c.includedTitle}</h2>
            <ul className="mt-6 space-y-3">
              {c.included.map((item) => (
                <li key={item} className="flex gap-3 text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl">{c.notIncludedTitle}</h2>
            <ul className="mt-6 space-y-3">
              {c.notIncluded.map((item) => (
                <li key={item} className="flex gap-3 text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mesa" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl bg-sage px-6 py-5 text-white">
              <h3 className="font-display text-2xl">{c.unpaidTitle}</h3>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm/6 text-white/90">
                {c.unpaidSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-sand/50">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-display text-3xl">{c.templatesTitle}</h2>
            <p className="mt-3 max-w-2xl text-ink-soft">{c.templatesLead}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TEMPLATES.map((tpl) => (
                <article
                  key={tpl.id}
                  className="rounded-2xl border border-line bg-paper p-5"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-mesa">
                    {tpl.id}
                  </p>
                  <h3 className="mt-2 font-display text-xl">
                    {locale === "es" ? tpl.nameEs : tpl.name}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">
                    {locale === "es" ? tpl.blurbEs : tpl.blurb}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl">{c.howTitle}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {c.howSteps.map((step) => (
              <article key={step.n} className="rounded-2xl border border-line p-6">
                <p className="font-display text-3xl text-clay">{step.n}</p>
                <h3 className="mt-2 font-display text-xl">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-display text-3xl">{c.aboutTitle}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-soft">
              {c.aboutBody}
            </p>
          </div>
        </section>

        <section id="request" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">{c.requestTitle}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{c.requestLead}</p>
          </div>
          <RequestForm locale={locale} />
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
