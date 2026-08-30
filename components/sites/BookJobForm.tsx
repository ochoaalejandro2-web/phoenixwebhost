"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";

const copy = {
  en: {
    title: "Book a job",
    lead: "Pick a day, leave your name and phone, and a short note. We will call you back.",
    name: "Name",
    phone: "Phone",
    day: "Day you want",
    note: "What needs doing",
    send: "Request this day",
    thanks: "We have the request. We will call you back.",
    missing: "Name, phone, and a day are required.",
  },
  es: {
    title: "Reservar un trabajo",
    lead: "Elija un día, deje nombre y teléfono y una nota corta. Lo llamamos.",
    name: "Nombre",
    phone: "Teléfono",
    day: "Día que quiere",
    note: "Qué hay que hacer",
    send: "Pedir este día",
    thanks: "Recibimos la solicitud. Lo llamamos.",
    missing: "Se requieren nombre, teléfono y un día.",
  },
} as const;

export function BookJobForm({
  slug,
  locale,
  leadId,
  fieldClass,
  buttonClass,
}: {
  slug: string;
  locale: Locale;
  leadId?: string;
  fieldClass: string;
  buttonClass: string;
}) {
  const c = copy[locale];
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">(
    "idle",
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("saving");
    const res = await fetch(`/api/sites/${slug}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        name: form.get("name"),
        phone: form.get("phone"),
        day: form.get("day"),
        note: form.get("note"),
      }),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <form id="book" onSubmit={onSubmit} className="grid gap-3">
      <p className="font-display text-2xl">{c.title}</p>
      <p className="text-sm opacity-80">{c.lead}</p>
      {status === "sent" ? (
        <p role="status" className="text-sm">
          {c.thanks}
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm">
          {c.missing}
        </p>
      ) : null}
      <input name="name" required maxLength={120} placeholder={c.name} className={fieldClass} />
      <input name="phone" required maxLength={40} placeholder={c.phone} className={fieldClass} />
      <input name="day" required type="date" className={fieldClass} />
      <textarea name="note" rows={3} maxLength={800} placeholder={c.note} className={fieldClass} />
      <button type="submit" disabled={status === "saving"} className={buttonClass}>
        {c.send}
      </button>
    </form>
  );
}
