import Image from "next/image";
import Link from "next/link";
import {
  CompanyPhone,
  SiteFooter,
  SiteHeader,
  StudioShell,
} from "@/components/marketing/Chrome";
import { DemoSearch } from "@/components/marketing/DemoSearch";
import { HeroDevices } from "@/components/marketing/HeroDevices";
import { RequestForm } from "@/components/marketing/RequestForm";
import { ReviewsSection } from "@/components/marketing/ReviewsSection";
import { StartingPoints } from "@/components/marketing/StartingPoints";
import {
  COMPANY,
  stripeBookConfigured,
  stripeBoostConfigured,
  stripeDomainConfigured,
  stripeEmailConfigured,
  stripeLoudConfigured,
  stripeMissedCallConfigured,
  stripeReviewTextsConfigured,
  stripeTrafficConfigured,
  stripeVoiceConfigured,
} from "@/lib/config";
import { requestWithExtra } from "@/lib/extra-picks";
import { requestPath, t } from "@/lib/i18n";
import { ensureLiveExtraPrices } from "@/lib/stripe-extra-prices";
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
  await ensureLiveExtraPrices();
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
            <div className="mt-8 max-w-lg">
              <DemoSearch locale={locale} variant="hero" />
            </div>
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
            <p className="mt-2 text-sm text-body">
              <CompanyPhone className="font-medium text-ink-black hover:text-lime" />
              {" · "}
              <a href={`mailto:${COMPANY.email}`} className="hover:text-lime">
                {COMPANY.email}
              </a>
            </p>
          </div>
          <div className="pb-10 lg:pb-6">
            <div className="relative overflow-hidden rounded-[2rem]">
              <Image
                src="/luxury-night-hero.png"
                alt="Night view of a modern glass house overlooking a desert city valley"
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
        <div className="mx-auto max-w-6xl border-t border-zinc-200 px-6 pt-10">
          <p className="text-sm text-body">{c.adsLadderHelp}</p>
          <p className="mt-2 text-xs text-body">{c.adsPickOne}</p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-px border-t border-zinc-200 md:grid-cols-3">
          <article className="px-6 py-14 md:pr-8">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.boostKicker}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.boostTitle}</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-body">{c.boostBody}</p>
            <div className="mt-8 flex flex-wrap gap-10">
              <div>
                <p className="price-lime font-display text-4xl">$99</p>
                <p className="text-xs text-body">{c.boostSetupHint}</p>
              </div>
              <div className="w-px bg-zinc-200" />
              <div>
                <p className="price-lime font-display text-4xl">$79</p>
                <p className="text-xs text-body">{c.boostMonthHint}</p>
              </div>
            </div>
            <Link
              href={`${requestPath(locale)}?ads=boost`}
              className="btn-lime mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm sm:w-auto"
            >
              {c.boostCheckbox}
            </Link>
          </article>
          <article className="border-t border-zinc-200 px-6 py-14 md:border-l md:border-t-0 md:px-8">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.trafficKicker}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.trafficTitle}</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-body">{c.trafficBody}</p>
            <div className="mt-8">
              <p className="price-lime font-display text-4xl">$199</p>
              <p className="text-xs text-body">{c.trafficMonthHint}</p>
            </div>
            <Link
              href={`${requestPath(locale)}?ads=traffic`}
              className="btn-lime mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm sm:w-auto"
            >
              {c.trafficCheckbox}
            </Link>
          </article>
          <article className="border-t border-zinc-200 px-6 py-14 md:border-l md:border-t-0 md:pl-8">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.loudKicker}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.loudTitle}</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-body">{c.loudBody}</p>
            <div className="mt-8">
              <p className="price-lime font-display text-4xl">$349</p>
              <p className="text-xs text-body">{c.loudMonthHint}</p>
            </div>
            <Link
              href={`${requestPath(locale)}?ads=loud`}
              className="btn-lime mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm sm:w-auto"
            >
              {c.loudCheckbox}
            </Link>
          </article>
        </div>
        <div className="mx-auto max-w-6xl border-t border-zinc-200 px-6 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
            {c.includedSplit}
          </p>
          <p className="mt-2 text-sm text-body">
            {locale === "es"
              ? "Sitio a la medida y recepcionista de IA en el chat. El dueño recibe el lead por correo."
              : "Custom site and the AI receptionist chat. The owner gets the lead by email."}
          </p>
        </div>
        <div id="extras" className="mx-auto max-w-6xl border-t border-zinc-200 px-6 py-10 scroll-mt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
            {c.extrasSplit}
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink-black">{c.extrasMenuTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            {c.extrasMenuLead}
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-px border-t border-zinc-200 md:grid-cols-3">
          <article id="domain" className="px-6 py-14 md:pr-8">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.domainKicker}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.domainTitle}</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-body">{c.domainBody}</p>
            <div className="mt-8">
              <p className="price-lime font-display text-4xl">$20</p>
              <p className="text-xs text-body">{c.domainYearHint}</p>
            </div>
            <Link
              href={requestWithExtra(locale, "domain")}
              className="btn-lime mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm sm:w-auto"
            >
              {c.domainCheckbox}
            </Link>
          </article>
          <article id="business-email" className="border-t border-zinc-200 px-6 py-14 md:border-l md:border-t-0 md:px-8">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.emailKicker}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.emailTitle}</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-body">{c.emailBody}</p>
            <div className="mt-8 flex flex-wrap gap-10">
              <div>
                <p className="price-lime font-display text-4xl">$49</p>
                <p className="text-xs text-body">{c.emailSetupHint}</p>
              </div>
              <div className="w-px bg-zinc-200" />
              <div>
                <p className="price-lime font-display text-4xl">$19</p>
                <p className="text-xs text-body">{c.emailMonthHint}</p>
              </div>
            </div>
            <Link
              href={requestWithExtra(locale, "email")}
              className="btn-lime mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm sm:w-auto"
            >
              {c.emailCheckbox}
            </Link>
          </article>
          <article id="book-a-job" className="border-t border-zinc-200 px-6 py-14 md:border-l md:border-t-0 md:pl-8">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.bookKicker}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.bookTitle}</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-body">{c.bookBody}</p>
            <div className="mt-8 flex flex-wrap gap-10">
              <div>
                <p className="price-lime font-display text-4xl">$49</p>
                <p className="text-xs text-body">{c.bookSetupHint}</p>
              </div>
              <div className="w-px bg-zinc-200" />
              <div>
                <p className="price-lime font-display text-4xl">$19</p>
                <p className="text-xs text-body">{c.bookMonthHint}</p>
              </div>
            </div>
            <Link
              href={requestWithExtra(locale, "book")}
              className="btn-lime mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm sm:w-auto"
            >
              {c.bookCheckbox}
            </Link>
          </article>
        </div>
        <div className="mx-auto grid max-w-6xl gap-px border-t border-zinc-200 md:grid-cols-3">
          <article id="missed-call" className="px-6 py-14 md:pr-8">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.missedKicker}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.missedTitle}</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-body">{c.missedBody}</p>
            <div className="mt-8 flex flex-wrap gap-10">
              <div>
                <p className="price-lime font-display text-4xl">$49</p>
                <p className="text-xs text-body">{c.missedSetupHint}</p>
              </div>
              <div className="w-px bg-zinc-200" />
              <div>
                <p className="price-lime font-display text-4xl">$29</p>
                <p className="text-xs text-body">{c.missedMonthHint}</p>
              </div>
            </div>
            <Link
              href={requestWithExtra(locale, "missed")}
              className="btn-lime mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm sm:w-auto"
            >
              {c.missedCheckbox}
            </Link>
          </article>
          <article id="review-texts" className="border-t border-zinc-200 px-6 py-14 md:border-l md:border-t-0 md:px-8">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.reviewTextsKicker}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.reviewTextsTitle}</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-body">{c.reviewTextsBody}</p>
            <div className="mt-8">
              <p className="price-lime font-display text-4xl">$29</p>
              <p className="text-xs text-body">{c.reviewTextsMonthHint}</p>
            </div>
            <Link
              href={requestWithExtra(locale, "reviews")}
              className="btn-lime mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm sm:w-auto"
            >
              {c.reviewTextsCheckbox}
            </Link>
          </article>
          <article id="voice-receptionist" className="border-t border-zinc-200 px-6 py-14 md:border-l md:border-t-0 md:pl-8">
            <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.voiceKicker}</p>
            <h2 className="mt-3 font-display text-3xl text-ink-black">{c.voiceTitle}</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-body">{c.voiceBody}</p>
            <div className="mt-8 flex flex-wrap gap-10">
              <div>
                <p className="price-lime font-display text-4xl">$99</p>
                <p className="text-xs text-body">{c.voiceSetupHint}</p>
              </div>
              <div className="w-px bg-zinc-200" />
              <div>
                <p className="price-lime font-display text-4xl">$79</p>
                <p className="text-xs text-body">{c.voiceMonthHint}</p>
              </div>
            </div>
            <Link
              href={requestWithExtra(locale, "voice")}
              className="btn-lime mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm sm:w-auto"
            >
              {c.voiceCheckbox}
            </Link>
          </article>
        </div>
      </section>

      <StartingPoints locale={locale} />

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
          <RequestForm
            locale={locale}
            boostReady={stripeBoostConfigured()}
            trafficReady={stripeTrafficConfigured()}
            loudReady={stripeLoudConfigured()}
            emailReady={stripeEmailConfigured()}
            bookReady={stripeBookConfigured()}
            missedReady={stripeMissedCallConfigured()}
            reviewsReady={stripeReviewTextsConfigured()}
            voiceReady={stripeVoiceConfigured()}
            domainReady={stripeDomainConfigured()}
          />
        </div>
      </section>

      <SiteFooter locale={locale} />
    </StudioShell>
  );
}
