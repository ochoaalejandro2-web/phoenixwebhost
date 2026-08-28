"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AddonToggle } from "@/components/marketing/RequestForm";
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
  emailReady,
}: {
  lead: Lead;
  locale: Locale;
  stripeReady: boolean;
  boostReady: boolean;
  emailReady: boolean;
}) {
  const c = t(locale);
  const [includeBoost, setIncludeBoost] = useState(lead.wantsLocalBoost);
  const [includeEmail, setIncludeEmail] = useState(lead.wantsBusinessEmail);
  const [payError, setPayError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const addonsBlocked =
    (includeBoost && !boostReady) || (includeEmail && !emailReady);

  function payLabel() {
    if (includeBoost && includeEmail) return c.formPayBoostEmail;
    if (includeBoost) return c.formPayBoost;
    if (includeEmail) return c.formPayEmail;
    return c.formPay;
  }

  async function startCheckout() {
    if (lead.purchased) return;
    if (includeBoost && !boostReady) {
      setPayError(c.boostMissing);
      return;
    }
    if (includeEmail && !emailReady) {
      setPayError(c.emailMissing);
      return;
    }
    setPayError(null);
    setBusy(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: lead.id,
        includeBoost,
        includeEmail,
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
    <div className="grid gap-3">
      <AddonToggle
        checked={includeBoost}
        onChange={setIncludeBoost}
        ready={boostReady}
        title={c.boostCheckbox}
        help={c.boostCheckboxHelp}
        missing={c.boostMissing}
      />
      <AddonToggle
        checked={includeEmail}
        onChange={setIncludeEmail}
        ready={emailReady}
        title={c.emailCheckbox}
        help={c.emailCheckboxHelp}
        missing={c.emailMissing}
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

export function DemoChat({ lead, locale }: { lead: Lead; locale: Locale }) {
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
    <aside className="rounded-[1.5rem] border border-zinc-200 bg-snow p-5 text-ink-black">
      <p className="text-xs uppercase tracking-[0.18em] text-lime">{c.demoChatTitle}</p>
      <p className="mt-2 text-sm text-body">{c.demoQuoted}</p>
      <div className="mt-4 grid max-h-56 gap-2 overflow-y-auto text-sm">
        {lines.map((line, index) => (
          <p
            key={`${line.from}-${index}`}
            className={
              line.from === "you"
                ? "rounded-2xl bg-header px-3 py-2 text-white"
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
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs hover:border-lime"
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
          className="field-studio mt-0"
          maxLength={240}
        />
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          className="btn-ghost rounded-full px-4 py-2 text-sm disabled:opacity-50"
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
}: {
  lead: Lead;
  locale: Locale;
}) {
  const c = t(locale);
  return (
    <div className="border-b border-zinc-200 bg-header text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lime">
            {c.demoKicker}
          </p>
          <p className="mt-1 max-w-2xl text-sm text-white/80">
            {lead.businessName} · {c.demoBanner}
          </p>
        </div>
        <Link
          href={locale === "es" ? "/es/request" : "/request"}
          className="text-xs text-white/60 hover:text-lime"
        >
          Phoenixwebhost
        </Link>
      </div>
    </div>
  );
}
