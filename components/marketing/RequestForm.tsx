"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function RequestForm({ locale }: { locale: Locale }) {
  const c = t(locale);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [leadId, setLeadId] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [canPay, setCanPay] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        businessName: form.get("businessName"),
        email: form.get("email"),
        phone: form.get("phone"),
        city: form.get("city"),
        message: form.get("message"),
        locale,
      }),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    const data = (await res.json()) as { id: string; stripeReady: boolean };
    setLeadId(data.id);
    setCanPay(data.stripeReady);
    setStatus("done");
  }

  async function startCheckout() {
    if (!leadId) return;
    setPayError(null);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      setPayError(data.error || "Checkout is not available yet.");
      return;
    }
    window.location.href = data.url;
  }

  if (status === "done") {
    return (
      <div className="rounded-[1.5rem] border border-zinc-200 bg-snow p-8">
        <p className="font-display text-2xl text-ink-black">{c.formThanks}</p>
        <p className="mt-3 text-body">
          {locale === "es"
            ? "Si está listo para pagar el lanzamiento de $200 y el plan de $69 al mes, use el botón de abajo."
            : "If you are ready to pay the $200 launch and start $69/month, use the button below."}
        </p>
        <button
          type="button"
          onClick={startCheckout}
          disabled={!canPay}
          className="btn-lime mt-6 rounded-full px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {c.formPay}
        </button>
        {!canPay && (
          <p className="mt-3 text-sm text-body">
            {locale === "es"
              ? "El pago con tarjeta se activa cuando Alex configura Stripe. Su solicitud ya está guardada."
              : "Card checkout turns on once Alex connects Stripe. Your request is already saved."}
          </p>
        )}
        {payError && <p className="mt-3 text-sm text-lime-deep">{payError}</p>}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-[1.5rem] border border-zinc-200 bg-snow p-8 text-ink-black"
    >
      <label className="text-sm text-body">
        {c.formName}
        <input name="name" required className="field-studio" />
      </label>
      <label className="text-sm text-body">
        {c.formBusiness}
        <input name="businessName" required className="field-studio" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-body">
          {c.formEmail}
          <input name="email" type="email" required className="field-studio" />
        </label>
        <label className="text-sm text-body">
          {c.formPhone}
          <input name="phone" required className="field-studio" />
        </label>
      </div>
      <label className="text-sm text-body">
        {c.formCity}
        <input
          name="city"
          placeholder="Phoenix, Mesa, Tucson…"
          className="field-studio"
        />
      </label>
      <label className="text-sm text-body">
        {c.formMessage}
        <textarea name="message" rows={4} className="field-studio" />
      </label>
      <button
        type="submit"
        disabled={status === "saving"}
        className="btn-lime rounded-full px-5 py-2.5 text-sm disabled:opacity-60"
      >
        {status === "saving" ? "…" : c.formSubmit}
      </button>
      {status === "error" && (
        <p className="text-sm text-lime-deep">
          {locale === "es"
            ? "No se pudo enviar. Intente de nuevo."
            : "Could not send. Please try again."}
        </p>
      )}
    </form>
  );
}
