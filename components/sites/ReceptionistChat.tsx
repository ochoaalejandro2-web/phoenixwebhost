"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { STUDIO_SITE, receptionistUi } from "@/lib/receptionist";
import type { Locale } from "@/lib/types";

type Line = { from: "us" | "you"; text: string };

export function ReceptionistChat({
  site,
  locale,
  leadId,
  businessName,
}: {
  site: string;
  locale: Locale;
  leadId?: string;
  businessName?: string;
}) {
  const ui = receptionistUi[locale];
  const intro =
    site === STUDIO_SITE
      ? ui.studioLead
      : ui.clientLead(businessName || "this business");
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [conversationId] = useState(() => `chat_${crypto.randomUUID()}`);
  const [lines, setLines] = useState<Line[]>([{ from: "us", text: intro }]);

  async function send() {
    const message = text.replace(/\s+/g, " ").trim();
    if (!message || pending) return;
    setText("");
    const nextLines: Line[] = [...lines, { from: "you", text: message }];
    setLines(nextLines);
    setPending(true);
    try {
      const history = nextLines.slice(1, -1).map((line) => ({
        role: line.from === "you" ? ("user" as const) : ("assistant" as const),
        content: line.text,
      }));
      const res = await fetch("/api/receptionist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site,
          leadId,
          locale,
          conversationId,
          message,
          history,
        }),
      });
      const data = (await res.json()) as { reply?: string };
      const reply =
        data.reply?.trim() ||
        (locale === "es"
          ? "Use el formulario de contacto o el teléfono de esta página."
          : "Use the contact form or the phone number on this page.");
      setLines([...nextLines, { from: "us", text: reply }]);
    } catch {
      setLines([
        ...nextLines,
        {
          from: "us",
          text:
            locale === "es"
              ? "Use el formulario de contacto o el teléfono de esta página."
              : "Use the contact form or the phone number on this page.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open ? (
        <section
          role="dialog"
          aria-label={ui.title}
          className="pointer-events-auto flex h-[min(28rem,70vh)] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[1.4rem] border border-zinc-200 bg-snow text-ink-black shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
        >
          <header className="bg-header px-4 py-3 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-lime">
              {ui.kicker}
            </p>
            <p className="mt-1 font-display text-lg">{ui.title}</p>
            {businessName ? (
              <p className="truncate text-xs text-white/55">{businessName}</p>
            ) : null}
          </header>
          <ol className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3">
            {lines.map((line, index) => (
              <li
                key={`${line.from}-${index}`}
                className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  line.from === "you"
                    ? "self-end bg-header text-white"
                    : "self-start border border-zinc-200 bg-white text-ink-black"
                }`}
              >
                {line.text}
              </li>
            ))}
            {pending ? (
              <li className="self-start text-xs text-body">…</li>
            ) : null}
          </ol>
          <form
            className="flex gap-2 border-t border-zinc-100 p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={ui.placeholder}
              maxLength={500}
              className="field-studio mt-0 min-w-0 flex-1 rounded-full px-4 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-header hover:bg-lime-deep disabled:opacity-60"
            >
              {ui.send}
            </button>
          </form>
        </section>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? ui.close : ui.open}
        onClick={() => setOpen((value) => !value)}
        className="pointer-events-auto flex h-14 items-center gap-2 rounded-full border border-lime bg-header px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,200,81,0.28)] hover:text-lime"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime text-header">
          {open ? "×" : "●"}
        </span>
        {open ? ui.close : ui.open}
      </button>
    </div>
  );
}

export function StudioReceptionist() {
  const pathname = usePathname() || "/";
  const hide = useMemo(
    () => /^\/(login|admin|checkout)(\/|$)/.test(pathname),
    [pathname],
  );
  const locale: Locale =
    pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
  if (hide) return null;
  return (
    <ReceptionistChat
      site={STUDIO_SITE}
      locale={locale}
      businessName="Phoenixwebhost Inc."
    />
  );
}
