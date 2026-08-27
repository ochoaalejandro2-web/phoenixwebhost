"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function ReviewForm({ locale }: { locale: Locale }) {
  const c = t(locale);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [rating, setRating] = useState(5);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.get("companyName"),
        reviewerName: form.get("reviewerName"),
        city: form.get("city"),
        rating,
        body: form.get("body"),
      }),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="rounded-[1.5rem] border border-zinc-200 bg-snow p-8">
        <p className="font-display text-2xl text-ink-black">{c.reviewsThanks}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-[1.5rem] border border-zinc-200 bg-snow p-8 text-ink-black"
    >
      <p className="font-display text-xl text-ink-black">{c.reviewsFormTitle}</p>
      <p className="text-sm text-body">{c.reviewsFormLead}</p>
      <label className="text-sm text-body">
        {c.reviewsCompany}
        <input name="companyName" required maxLength={120} className="field-studio" />
      </label>
      <label className="text-sm text-body">
        {c.reviewsReviewer}
        <input name="reviewerName" required maxLength={120} className="field-studio" />
      </label>
      <label className="text-sm text-body">
        {c.reviewsCity}
        <input
          name="city"
          maxLength={80}
          placeholder="Phoenix, Mesa, Tucson…"
          className="field-studio"
        />
      </label>
      <fieldset className="text-sm text-body">
        <legend>{c.reviewsRating}</legend>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} ${locale === "es" ? "estrellas" : "stars"}`}
              aria-pressed={rating === value}
              className={`px-1 text-2xl leading-none ${
                value <= rating ? "text-lime" : "text-zinc-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <label className="text-sm text-body">
        {c.reviewsBody}
        <textarea
          name="body"
          required
          maxLength={600}
          rows={4}
          className="field-studio"
        />
      </label>
      <button
        type="submit"
        disabled={status === "saving"}
        className="btn-lime rounded-full px-5 py-2.5 text-sm disabled:opacity-60"
      >
        {status === "saving" ? "…" : c.reviewsSubmit}
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
