"use client";

import { useMemo, useState } from "react";
import { AdsTierPicker } from "@/components/marketing/AdsTierPicker";
import { AddonToggle } from "@/components/marketing/RequestForm";
import { COMPANY } from "@/lib/config";
import { previewPath, t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { walkInRequestHref, type WalkInTypeId } from "@/lib/walk-in-preview";
import {
  emptyWalkInFlags,
  selectedExtraPicks,
  selectedQuotedPicks,
  walkInQuote,
  walkInShowsOrdering,
  type WalkInQuoteFlags,
} from "@/lib/walk-in-quote";

export function SeeYourSiteQuote({
  locale,
  businessName,
  type,
}: {
  locale: Locale;
  businessName: string;
  type: WalkInTypeId;
}) {
  const c = t(locale);
  const [flags, setFlags] = useState<WalkInQuoteFlags>(emptyWalkInFlags());
  const quote = useMemo(() => walkInQuote(flags), [flags]);
  const requestHref = walkInRequestHref(locale, {
    businessName,
    type,
    ads: flags.ads,
    extras: selectedExtraPicks(flags),
    quoted: selectedQuotedPicks(flags),
  });

  function setFlag<K extends keyof WalkInQuoteFlags>(key: K, value: WalkInQuoteFlags[K]) {
    setFlags((current) => ({ ...current, [key]: value }));
  }

  return (
    <aside className="rounded-[1.75rem] border border-zinc-200 bg-snow text-ink-black">
      <div className="border-b border-zinc-100 bg-header px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
          {c.seeSitePriceTitle}
        </p>
        <p className="mt-3 text-sm text-white/70">{c.seeSiteBaseHelp}</p>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
              {c.seeSiteDueNow}
            </p>
            <p className="price-lime mt-1 font-display text-3xl">{quote.setupLabel}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
              {c.seeSitePerMonth}
            </p>
            <p className="price-lime mt-1 font-display text-3xl">{quote.monthlyLabel}</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-white/60">
          {c.seeSiteFirstPay}: {quote.firstPayLabel}
          {quote.yearlyLabel ? ` · ${c.seeSiteYearly} ${quote.yearlyLabel}` : ""}
        </p>
      </div>

      <div className="grid gap-3 p-5 sm:p-6">
        <div className="rounded-2xl border border-lime/40 bg-lime/10 px-4 py-3">
          <p className="font-medium text-ink-black">{c.seeSiteBaseLabel}</p>
          <p className="mt-1 text-sm text-body">{c.seeSiteBaseHelp}</p>
        </div>

        <AdsTierPicker
          value={flags.ads}
          onChange={(ads) => setFlag("ads", ads)}
          boostReady
          trafficReady
          loudReady
          locale={locale}
        />

        <AddonToggle
          checked={flags.book}
          onChange={(value) => setFlag("book", value)}
          ready
          title={c.bookCheckbox}
          help={c.bookCheckboxHelp}
          missing=""
        />
        <AddonToggle
          checked={flags.missed}
          onChange={(value) => setFlag("missed", value)}
          ready
          title={c.missedCheckbox}
          help={c.missedCheckboxHelp}
          missing=""
        />
        <AddonToggle
          checked={flags.reviews}
          onChange={(value) => setFlag("reviews", value)}
          ready
          title={c.reviewTextsCheckbox}
          help={c.reviewTextsCheckboxHelp}
          missing=""
        />
        <AddonToggle
          checked={flags.voice}
          onChange={(value) => setFlag("voice", value)}
          ready
          title={c.voiceCheckbox}
          help={c.voiceCheckboxHelp}
          missing=""
        />
        <AddonToggle
          checked={flags.email}
          onChange={(value) => setFlag("email", value)}
          ready
          title={c.emailCheckbox}
          help={c.emailCheckboxHelp}
          missing=""
        />
        <AddonToggle
          checked={flags.domain}
          onChange={(value) => setFlag("domain", value)}
          ready
          title={c.domainCheckbox}
          help={c.domainCheckboxHelp}
          missing=""
        />
        {walkInShowsOrdering(type) ? (
          <AddonToggle
            checked={flags.ordering}
            onChange={(value) => setFlag("ordering", value)}
            ready
            title={c.seeSiteOrderTitle}
            help={c.seeSiteOrderHelp}
            missing=""
          />
        ) : null}

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
            {c.seeSiteQuotedTitle}
          </p>
          <div className="mt-3 grid gap-3">
            <AddonToggle
              checked={flags.extraPage}
              onChange={(value) => setFlag("extraPage", value)}
              ready
              title={c.seeSiteExtraPage}
              help={c.seeSiteExtraPageHelp}
              missing=""
            />
            <AddonToggle
              checked={flags.photos}
              onChange={(value) => setFlag("photos", value)}
              ready
              title={c.seeSitePhotos}
              help={c.seeSitePhotosHelp}
              missing=""
            />
            <AddonToggle
              checked={flags.spanish}
              onChange={(value) => setFlag("spanish", value)}
              ready
              title={c.seeSiteSpanish}
              help={c.seeSiteSpanishHelp}
              missing=""
            />
          </div>
        </div>

        <p className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm leading-relaxed text-body">
          {c.seeSiteCustomNote}
        </p>

        <div className="sticky bottom-3 grid gap-2 rounded-2xl border border-zinc-200 bg-header p-4 text-white shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                {c.seeSiteDueNow}
              </p>
              <p className="price-lime font-display text-2xl">{quote.setupLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                {c.seeSitePerMonth}
              </p>
              <p className="price-lime font-display text-2xl">{quote.monthlyLabel}</p>
            </div>
          </div>
          <div className="mt-1 grid gap-2 sm:grid-cols-3">
            <a
              href={COMPANY.telHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-4 text-sm font-semibold text-white"
            >
              {c.seeSiteCtaCall} {COMPANY.phone}
            </a>
            <a
              href={COMPANY.smsHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-4 text-sm text-white hover:border-lime"
            >
              {c.seeSiteCtaText} {COMPANY.phone}
            </a>
            <a
              href={requestHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-lime px-4 text-sm text-lime hover:bg-lime hover:text-white"
            >
              {c.seeSiteCtaRequest}
            </a>
          </div>
        </div>

        <a
          href={`${previewPath(locale)}?name=${encodeURIComponent(businessName)}`}
          className="text-center text-xs text-body hover:text-lime"
        >
          {c.seeSiteChange}
        </a>
      </div>
    </aside>
  );
}
