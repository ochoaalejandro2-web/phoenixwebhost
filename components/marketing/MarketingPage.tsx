import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { HeroDevices, TemplatePreview } from "@/components/marketing/HeroDevices";
import { RequestForm } from "@/components/marketing/RequestForm";
import { ReviewsSection } from "@/components/marketing/ReviewsSection";
import { TEMPLATES } from "@/lib/config";
import { requestPath, t } from "@/lib/i18n";
import { listPublicReviews } from "@/lib/store";
import type { Locale } from "@/lib/types";

function AccentTitle({
  title,
  accent,
  className,
}: {
  title: string;
  accent: string;
  className?: string;
}) {
  const index = title.indexOf(accent);
  if (index < 0) {
    return <h1 className={className}>{title}</h1>;
  }
  return (
    <h1 className={className}>
      {title.slice(0, index)}
      <span className="text-lime">{accent}</span>
      {title.slice(index + accent.length)}
    </h1>
  );
}

function LimeCheck() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-lime"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 8.2 L6.8 10.4 L11.5 5.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function MarketingPage({ locale }: { locale: Locale }) {
  const c = t(locale);
  const reviews = await listPublicReviews();
  return (
    <StudioShell>
      <SiteHeader locale={locale} />
      <section className="relative bg-snow">
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 px-6 pb-28 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-32 lg:pt-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
              {c.heroKicker}
            </p>
            <AccentTitle
              title={c.heroTitle}
              accent={c.heroAccent}
              className="mt-6 max-w-xl font-display text-5xl leading-[1.08] text-ink-black sm:text-6xl lg:text-[3.85rem]"
            />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-body sm:text-lg">
              {c.heroLead}
            </p>
            <div className="mt-10 flex flex-wrap items-end gap-10">
              <Link
                href={requestPath(locale)}
                className="btn-lime rounded-full px-8 py-3.5 text-sm"
              >
                {c.ctaPrimary}
              </Link>
              <div className="flex gap-8">
                <div>
                  <p className="price-lime font-display text-4xl">{c.priceLaunch}</p>
                  <p className="text-xs text-body">{c.priceLaunchHint}</p>
                </div>
                <div className="w-px bg-zinc-200" />
                <div>
                  <p className="price-lime font-display text-4xl">{c.priceMonth}</p>
                  <p className="text-xs text-body">{c.priceMonthHint}</p>
                </div>
              </div>
            </div>
            <p className="mt-8 text-sm text-body">{c.ownerLine}</p>
          </div>
          <div className="pb-10 lg:pb-6">
            <div className="relative overflow-hidden rounded-[2rem]">
              <Image
                src="/luxury-interior.png"
                alt="Sunlit modern interior with glass and pale stone"
                width={1536}
                height={1024}
                priority
                className="h-[22rem] w-full object-cover sm:h-[26rem]"
              />
              <p className="absolute left-4 top-4 rounded-full bg-header/80 px-4 py-2 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm">
                {c.proofLine}
              </p>
            </div>
            <div className="relative z-10 -mt-16 px-4 sm:-mt-20 sm:px-8">
              <HeroDevices />
            </div>
            <p className="mt-14 text-center text-xs tracking-wide text-body lg:text-left">
              {locale === "es"
                ? "Así se ve un sitio de muestra — listo para su negocio."
                : "A sample site on laptop and phone — ready for your shop."}
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="border-y border-zinc-100 bg-zinc-50/80">
        <div className="mx-auto grid max-w-6xl gap-px px-6 py-0 md:grid-cols-2">
          <article className="py-16 md:pr-12">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.priceLaunch}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.launchTitle}</h2>
            <p className="mt-5 max-w-md leading-relaxed text-body">{c.launchBody}</p>
          </article>
          <article className="border-t border-zinc-200 py-16 md:border-l md:border-t-0 md:pl-12">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.priceMonth}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.monthTitle}</h2>
            <p className="mt-5 max-w-md leading-relaxed text-body">{c.monthBody}</p>
          </article>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-lime">
              {locale === "es" ? "Puntos de partida" : "Starting points"}
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink-black sm:text-4xl">
              {c.templatesTitle}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-body">{c.templatesLead}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TEMPLATES.map((tpl) => (
            <article
              key={tpl.id}
              className="group rounded-[1.5rem] border border-zinc-200 bg-snow p-3 transition hover:border-lime/50"
            >
              <TemplatePreview id={tpl.id} />
              <div className="px-2 pb-4 pt-5">
                <h3 className="font-display text-xl text-ink-black">
                  {locale === "es" ? tpl.nameEs : tpl.name}
                </h3>
                <p className="mt-2 text-sm text-body">
                  {locale === "es" ? tpl.blurbEs : tpl.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="included" className="border-y border-zinc-100 bg-zinc-50/80">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl text-ink-black">{c.includedTitle}</h2>
            <p className="mt-5 text-body">
              {locale === "es"
                ? "Cuidado mensual limitado. Nunca cambios ilimitados."
                : "Limited monthly care. Never unlimited changes."}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.included.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-2xl border border-zinc-200 bg-snow px-4 py-3.5 text-sm text-body"
              >
                <LimeCheck />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-xl text-ink-black">{c.notIncludedTitle}</h3>
            <ul className="mt-5 space-y-2.5 text-sm text-body">
              {c.notIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-zinc-200 bg-snow p-8">
            <h3 className="font-display text-xl text-ink-black">{c.unpaidTitle}</h3>
            <ol className="mt-5 list-decimal space-y-2.5 pl-5 text-sm text-body">
              {c.unpaidSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-3xl text-ink-black">{c.howTitle}</h2>
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {c.howSteps.map((step) => (
            <article key={step.n}>
              <p className="price-lime font-display text-5xl">{step.n}</p>
              <h3 className="mt-4 font-display text-xl text-ink-black">{step.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-body">{step.d}</p>
            </article>
          ))}
        </div>
      </section>

      <ReviewsSection locale={locale} reviews={reviews} />

      <section className="border-t border-zinc-100 bg-zinc-50/80">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-ink-black">{c.aboutTitle}</h2>
            <p className="mt-5 leading-relaxed text-body">{c.aboutBody}</p>
            <h3 className="mt-12 font-display text-2xl text-ink-black">{c.requestTitle}</h3>
            <p className="mt-3 text-body">{c.requestLead}</p>
          </div>
          <RequestForm locale={locale} />
        </div>
      </section>

      <SiteFooter locale={locale} />
    </StudioShell>
  );
}
