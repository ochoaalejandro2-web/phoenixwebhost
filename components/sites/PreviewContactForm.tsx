"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import { tShop } from "@/lib/shop-i18n";

export function PreviewContactForm({
  locale,
  fieldClass,
  buttonClass,
  noteClass,
}: {
  locale: Locale;
  fieldClass: string;
  buttonClass: string;
  noteClass: string;
}) {
  const c = tShop(locale);
  const [note, setNote] = useState(false);

  return (
    <form
      id="contact"
      onSubmit={(event) => {
        event.preventDefault();
        setNote(true);
      }}
      className="mt-8 grid gap-3"
    >
      <p className={`text-sm ${noteClass}`}>{c.previewContact}</p>
      {note ? (
        <p role="status" className={`text-sm ${noteClass}`}>
          {c.previewContact}
        </p>
      ) : null}
      <input
        name="name"
        required
        maxLength={120}
        placeholder={c.formName}
        autoComplete="name"
        className={fieldClass}
      />
      <input
        name="email"
        type="email"
        required
        maxLength={200}
        placeholder={c.formEmail}
        autoComplete="email"
        className={fieldClass}
      />
      <input
        name="phone"
        maxLength={40}
        placeholder={c.formPhone}
        autoComplete="tel"
        className={fieldClass}
      />
      <textarea
        name="message"
        required
        maxLength={4000}
        rows={4}
        placeholder={c.formMessage}
        className={fieldClass}
      />
      <button type="submit" className={buttonClass}>
        {c.formSubmit}
      </button>
    </form>
  );
}
