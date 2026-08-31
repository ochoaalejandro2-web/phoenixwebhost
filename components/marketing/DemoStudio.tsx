"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdsTierPicker } from "@/components/marketing/AdsTierPicker";
import { AddonToggle } from "@/components/marketing/RequestForm";
import { adsTierFromFlags, type AdsTier } from "@/lib/ads";
import { COMPANY } from "@/lib/config";
import {
  DEMO_ACCENTS,
  extraDemoPath,
  leadHasExtraPage,
} from "@/lib/demo";
import { t } from "@/lib/i18n";
import type { DemoTweaks, Lead, Locale } from "@/lib/types";

type ChatLine = { from: "us" | "you"; text: string };

function replyCopy(locale: Locale, kind: string) {
  const c = t(locale);
  if (kind === "capped") return c.demoChatCapped;
  if (kind === "quote") return c.demoChatQuote;
  if (kind === "help") return c.demoChatHelp;
  return c.demoChatSaved;
}

export function DemoPurchase({
  lead,
  locale,
  stripeReady,
  boostReady,
  trafficReady,
  loudReady,
  emailReady,
  bookReady = false,
  missedReady = false,
  reviewsReady = false,
  voiceReady = false,
  domainReady = false,
  compact = false,
}: {
  lead: Lead;
  locale: Locale;
  stripeReady: boolean;
  boostReady: boolean;
  trafficReady: boolean;
  loudReady: boolean;
  emailReady: boolean;
  bookReady?: boolean;
  missedReady?: boolean;
  reviewsReady?: boolean;
  voiceReady?: boolean;
  domainReady?: boolean;
  compact?: boolean;
}) {
  const c = t(locale);
  const [adsTier, setAdsTier] = useState<AdsTier>(adsTierFromFlags(lead));
  const [includeEmail, setIncludeEmail] = useState(lead.wantsBusinessEmail);
  const [includeBook, setIncludeBook] = useState(Boolean(lead.wantsBookAJob));
  const [includeMissed, setIncludeMissed] = useState(Boolean(lead.wantsMissedCall));
  const [includeReviews, setIncludeReviews] = useState(Boolean(lead.wantsReviewTexts));
  const [includeVoice, setIncludeVoice] = useState(Boolean(lead.wantsVoice));
  const [includeDomain, setIncludeDomain] = useState(Boolean(lead.wantsDomain));
  const [payError, setPayError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const addonsBlocked =
    (adsTier === "boost" && !boostReady) ||
    (adsTier === "traffic" && !trafficReady) ||
    (adsTier === "loud" && !loudReady) ||
    (includeEmail && !emailReady) ||
    (includeBook && !bookReady) ||
    (includeMissed && !missedReady) ||
    (includeReviews && !reviewsReady) ||
    (includeVoice && !voiceReady) ||
    (includeDomain && !domainReady);

  function payLabel() {
    if (adsTier === "loud" && includeEmail) return c.formPayLoudEmail;
    if (adsTier === "traffic" && includeEmail) return c.formPayTrafficEmail;
    if (adsTier === "boost" && includeEmail) return c.formPayBoostEmail;
    if (adsTier === "loud") return c.formPayLoud;
    if (adsTier === "traffic") return c.formPayTraffic;
    if (adsTier === "boost") return c.formPayBoost;
    if (includeEmail) return c.formPayEmail;
    return c.formPay;
  }

  async function startCheckout() {
    if (lead.purchased) return;
    if (adsTier === "boost" && !boostReady) {
      setPayError(c.boostMissing);
      return;
    }
    if (adsTier === "traffic" && !trafficReady) {
      setPayError(c.trafficMissing);
      return;
    }
    if (adsTier === "loud" && !loudReady) {
      setPayError(c.loudMissing);
      return;
    }
    if (includeEmail && !emailReady) {
      setPayError(c.emailMissing);
      return;
    }
    if (includeBook && !bookReady) {
      setPayError(c.bookMissing);
      return;
    }
    if (includeMissed && !missedReady) {
      setPayError(c.missedMissing);
      return;
    }
    if (includeReviews && !reviewsReady) {
      setPayError(c.reviewTextsMissing);
      return;
    }
    if (includeVoice && !voiceReady) {
      setPayError(c.voiceMissing);
      return;
    }
    if (includeDomain && !domainReady) {
      setPayError(c.domainMissing);
      return;
    }
    setPayError(null);
    setBusy(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: lead.id,
        includeBoost: adsTier === "boost",
        includeTraffic: adsTier === "traffic",
        includeLoud: adsTier === "loud",
        includeEmail,
        includeBook,
        includeMissedCall: includeMissed,
        includeReviews,
        includeVoice,
        includeDomain,
      }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      setBusy(false);
      setPayError(data.error || "Checkout is not available yet.");
      return;
    }
    window.location.href = data.url;
  }

  if (lead.purchased) {
    return (
      <p className="rounded-2xl border border-lime/40 bg-lime/10 px-4 py-3 text-sm text-ink-black">
        {c.demoPurchased}
      </p>
    );
  }

  return (
    <div className={compact ? "grid gap-2" : "grid gap-3"}>
      <AdsTierPicker
        value={adsTier}
        onChange={setAdsTier}
        boostReady={boostReady}
        trafficReady={trafficReady}
        loudReady={loudReady}
        locale={locale}
      />
      <AddonToggle
        checked={includeDomain}
        onChange={setIncludeDomain}
        ready={domainReady}
        title={c.domainCheckbox}
        help={c.domainCheckboxHelp}
        missing={c.domainMissing}
      />
      <AddonToggle
        checked={includeEmail}
        onChange={setIncludeEmail}
        ready={emailReady}
        title={c.emailCheckbox}
        help={c.emailCheckboxHelp}
        missing={c.emailMissing}
      />
      <AddonToggle
        checked={includeBook}
        onChange={setIncludeBook}
        ready={bookReady}
        title={c.bookCheckbox}
        help={c.bookCheckboxHelp}
        missing={c.bookMissing}
      />
      <AddonToggle
        checked={includeMissed}
        onChange={setIncludeMissed}
        ready={missedReady}
        title={c.missedCheckbox}
        help={c.missedCheckboxHelp}
        missing={c.missedMissing}
      />
      <AddonToggle
        checked={includeReviews}
        onChange={setIncludeReviews}
        ready={reviewsReady}
        title={c.reviewTextsCheckbox}
        help={c.reviewTextsCheckboxHelp}
        missing={c.reviewTextsMissing}
      />
      <AddonToggle
        checked={includeVoice}
        onChange={setIncludeVoice}
        ready={voiceReady}
        title={c.voiceCheckbox}
        help={c.voiceCheckboxHelp}
        missing={c.voiceMissing}
      />
      <button
        type="button"
        onClick={startCheckout}
        disabled={!stripeReady || addonsBlocked || busy}
        className="btn-lime rounded-full px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "…" : payLabel()}
      </button>
      {!stripeReady ? (
        <p className="text-sm text-body">
          {locale === "es"
            ? "El pago con tarjeta se activa cuando Alex configura Stripe. Su demo ya está guardada."
            : "Card checkout turns on once Alex connects Stripe. Your demo is already saved."}
        </p>
      ) : null}
      {payError ? <p className="text-sm text-lime-deep">{payError}</p> : null}
    </div>
  );
}

export function DemoChat({
  lead,
  locale,
  compact = false,
}: {
  lead: Lead;
  locale: Locale;
  compact?: boolean;
}) {
  const c = t(locale);
  const router = useRouter();
  const [lines, setLines] = useState<ChatLine[]>([
    { from: "us", text: c.demoChatLead },
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(payload: { chat?: string; demo?: Partial<DemoTweaks> }) {
    setBusy(true);
    const res = await fetch(`/api/leads/${lead.id}/demo`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { replyKind?: string; error?: string };
    setBusy(false);
    if (!res.ok) {
      setLines((current) => [
        ...current,
        { from: "us", text: data.error || c.demoChatQuote },
      ]);
      return;
    }
    setLines((current) => [
      ...current,
      { from: "us", text: replyCopy(locale, data.replyKind || "saved") },
    ]);
    router.refresh();
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    setLines((current) => [...current, { from: "you", text }]);
    await send({ chat: text });
  }

  return (
    <aside
      className={
        compact
          ? "text-white"
          : "rounded-[1.5rem] border border-zinc-200 bg-snow p-5 text-ink-black"
      }
    >
      <p className={compact ? "text-xs uppercase tracking-[0.18em] text-lime" : "text-xs uppercase tracking-[0.18em] text-lime"}>
        {c.demoChatTitle}
      </p>
      <p className={compact ? "mt-2 text-sm text-white/70" : "mt-2 text-sm text-body"}>
        {c.demoQuoted}
      </p>
      <div className="mt-4 grid max-h-56 gap-2 overflow-y-auto text-sm">
        {lines.map((line, index) => (
          <p
            key={`${line.from}-${index}`}
            className={
              line.from === "you"
                ? compact
                  ? "rounded-2xl bg-white/10 px-3 py-2 text-white"
                  : "rounded-2xl bg-header px-3 py-2 text-white"
                : compact
                  ? "rounded-2xl bg-white/5 px-3 py-2 text-white/80"
                  : "rounded-2xl bg-zinc-50 px-3 py-2 text-body"
            }
          >
            {line.text}
          </p>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {DEMO_ACCENTS.filter((row) => row.id !== "template").map((row) => (
          <button
            key={row.id}
            type="button"
            disabled={busy}
            onClick={() => send({ demo: { accent: row.id } })}
            className={
              compact
                ? "rounded-full border border-white/20 px-3 py-1 text-xs hover:border-lime"
                : "rounded-full border border-zinc-200 px-3 py-1 text-xs hover:border-lime"
            }
          >
            {locale === "es" ? row.labelEs : row.label}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-4 grid gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={c.demoChatPlaceholder}
          className={compact ? "field-studio mt-0 bg-white" : "field-studio mt-0"}
          maxLength={240}
        />
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          className={
            compact
              ? "inline-flex items-center justify-center rounded-full border border-lime px-4 py-2 text-sm text-white disabled:opacity-50"
              : "btn-ghost rounded-full px-4 py-2 text-sm disabled:opacity-50"
          }
        >
          {c.demoChatSend}
        </button>
      </form>
      {leadHasExtraPage(lead.demo) ? (
        <Link
          href={extraDemoPath(lead.id)}
          className="mt-3 inline-block text-sm text-lime hover:text-lime-deep"
        >
          {c.demoExtraNav}
        </Link>
      ) : null}
    </aside>
  );
}

export function DemoBar({
  lead,
  locale,
  stripeReady,
  boostReady,
  trafficReady,
  loudReady,
  emailReady,
  bookReady = false,
  missedReady = false,
  reviewsReady = false,
  voiceReady = false,
  domainReady = false,
}: {
  lead: Lead;
  locale: Locale;
  stripeReady: boolean;
  boostReady: boolean;
  trafficReady: boolean;
  loudReady: boolean;
  emailReady: boolean;
  bookReady?: boolean;
  missedReady?: boolean;
  reviewsReady?: boolean;
  voiceReady?: boolean;
  domainReady?: boolean;
}) {
  const c = t(locale);
  const [panel, setPanel] = useState<"buy" | "tweak" | null>(null);

  function toggle(next: "buy" | "tweak") {
    setPanel((current) => (current === next ? null : next));
  }

  return (
    <div className="studio sticky top-0 z-50 border-b border-white/10 bg-header text-white">
      <div className="mx-auto flex max-w-[90rem] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-lime">
            {c.demoKicker}
          </p>
          <p className="mt-0.5 hidden truncate text-xs text-white/70 sm:block">
            {c.demoBanner}
          </p>
        </div>
        <Link
          href={locale === "es" ? "/es/request" : "/request"}
          className="hidden text-xs text-white/50 hover:text-lime sm:inline"
        >
          Phoenixwebhost
        </Link>
        <a
          href={COMPANY.telHref}
          className="hidden whitespace-nowrap text-xs text-lime hover:text-white sm:inline"
        >
          {COMPANY.phone}
        </a>
        {leadHasExtraPage(lead.demo) ? (
          <Link
            href={extraDemoPath(lead.id)}
            className="hidden text-xs text-white/70 hover:text-lime md:inline"
          >
            {c.demoExtraNav}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => toggle("tweak")}
          className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:border-lime hover:text-lime"
        >
          {c.demoChatTitle}
        </button>
        {lead.purchased ? (
          <p className="rounded-full bg-lime/15 px-3 py-1.5 text-xs text-lime">
            {c.demoPurchased}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => toggle("buy")}
            className="btn-lime shrink-0 rounded-full px-3 py-1.5 text-xs sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">{locale === "es" ? "Publicar $200+$69" : "Go live $200+$69"}</span>
            <span className="hidden sm:inline">{c.formPay}</span>
          </button>
        )}
      </div>
      {panel === "buy" && !lead.purchased ? (
        <div className="border-t border-white/10 bg-header">
          <div className="mx-auto grid max-w-xl gap-3 px-4 py-4 sm:px-6">
            <p className="text-sm text-white/80">{c.demoPrice}</p>
            <p className="text-xs text-white/55">{c.demoEmailNote}</p>
            <div className="rounded-2xl bg-white p-4 text-ink-black">
              <DemoPurchase
                lead={lead}
                locale={locale}
                stripeReady={stripeReady}
                boostReady={boostReady}
                trafficReady={trafficReady}
                loudReady={loudReady}
                emailReady={emailReady}
                bookReady={bookReady}
                missedReady={missedReady}
                reviewsReady={reviewsReady}
                voiceReady={voiceReady}
                domainReady={domainReady}
                compact
              />
            </div>
          </div>
        </div>
      ) : null}
      {panel === "tweak" ? (
        <div className="border-t border-white/10 bg-header">
          <div className="mx-auto max-w-xl px-4 py-4 sm:px-6">
            <DemoChat lead={lead} locale={locale} compact />
          </div>
        </div>
      ) : null}
    </div>
  );
}
