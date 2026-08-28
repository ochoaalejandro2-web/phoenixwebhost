"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/config";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function AddonToggle({
  checked,
  onChange,
  ready,
  title,
  help,
  missing,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  ready: boolean;
  title: string;
  help: string;
  missing: string;
}) {
  return (
    <div>
      <label className="flex cursor-pointer gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 text-sm text-body">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#00c851]"
        />
        <span>
          <span className="block font-medium text-ink-black">{title}</span>
          <span className="mt-1 block">{help}</span>
        </span>
      </label>
      {checked && !ready ? (
        <p className="mt-3 text-sm text-lime-deep">{missing}</p>
      ) : null}
    </div>
  );
}

export function RequestForm({
  locale,
  boostReady = false,
  emailReady = false,
}: {
  locale: Locale;
  boostReady?: boolean;
  emailReady?: boolean;
}) {
  const c = t(locale);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [includeBoost, setIncludeBoost] = useState(false);
  const [includeEmail, setIncludeEmail] = useState(false);

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
        template: form.get("template"),
        locale,
        wantsLocalBoost: includeBoost,
        wantsBusinessEmail: includeEmail,
      }),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    const data = (await res.json()) as { demoUrl?: string };
    if (data.demoUrl) {
      window.location.href = data.demoUrl;
      return;
    }
    setStatus("error");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-[1.5rem] border border-zinc-200 bg-snow p-8 text-ink-black"
    >
      <label className="text-sm text-body">
        {c.formName}
        <input name="name" required autoComplete="name" className="field-studio" />
      </label>
      <label className="text-sm text-body">
        {c.formBusiness}
        <input name="businessName" required className="field-studio" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-body">
          {c.formEmail}
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field-studio"
          />
        </label>
        <label className="text-sm text-body">
          {c.formPhone}
          <input name="phone" autoComplete="tel" className="field-studio" />
          <span className="mt-1 block text-xs text-body/80">{c.formPhoneHint}</span>
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
        {c.formTemplate}
        <select name="template" required defaultValue="" className="field-studio">
          <option value="" disabled>
            {locale === "es" ? "Elija una plantilla" : "Choose a starting point"}
          </option>
          {TEMPLATES.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {locale === "es" ? tpl.nameEs : tpl.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-body">
        {c.formMessage}
        <textarea name="message" rows={4} className="field-studio" />
      </label>
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
        type="submit"
        disabled={status === "saving"}
        className="btn-lime rounded-full px-5 py-2.5 text-sm disabled:opacity-60"
      >
        {status === "saving" ? "…" : c.formSubmit}
      </button>
      {status === "error" && (
        <p className="text-sm text-lime-deep">
          {locale === "es"
            ? "No se pudo crear la demo. Intente de nuevo."
            : "Could not create the demo. Please try again."}
        </p>
      )}
    </form>
  );
}
