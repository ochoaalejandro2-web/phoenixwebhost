"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  filterPublicDemos,
  templateLabelForDemo,
  type PublicDemo,
} from "@/lib/public-demos";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function DemoSearch({
  locale,
  variant = "hero",
  query,
  onQueryChange,
}: {
  locale: Locale;
  variant?: "hero" | "header" | "section";
  query?: string;
  onQueryChange?: (value: string) => void;
}) {
  const c = t(locale);
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [innerQuery, setInnerQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const value = query ?? innerQuery;
  const results = filterPublicDemos(value);
  const dark = variant === "header";

  function setValue(next: string) {
    onQueryChange?.(next);
    if (query === undefined) setInnerQuery(next);
    setActive(0);
    setOpen(true);
  }

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function openDemo(demo: PublicDemo) {
    window.location.assign(demo.href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const demo = results[active] || results[0];
      if (demo) openDemo(demo);
    }
  }

  const showList = open;
  const inputClass =
    variant === "header"
      ? "w-full rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/45 focus:border-lime focus:bg-white/15"
      : "field-studio mt-0 w-full rounded-full px-5 py-3.5 text-base";

  return (
    <div ref={rootRef} className="relative w-full">
      <label className="sr-only" htmlFor={listId + "-input"}>
        {c.searchLabel}
      </label>
      <input
        id={listId + "-input"}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={c.searchPlaceholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="search"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          showList && results[active] ? `${listId}-${results[active].slug}` : undefined
        }
        className={inputClass}
      />
      {variant !== "header" ? (
        <p className="mt-2 text-xs text-body">{c.searchHint}</p>
      ) : null}
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={c.searchLabel}
          className={
            variant === "header"
              ? "absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-header py-1 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
              : "absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-zinc-200 bg-snow py-1 shadow-[0_18px_40px_rgba(10,10,10,0.12)]"
          }
        >
          {results.length === 0 ? (
            <li className={`px-4 py-3 text-sm ${dark ? "text-white/60" : "text-body"}`}>
              {c.searchEmpty}
            </li>
          ) : (
            results.map((demo, index) => (
              <li key={demo.slug} role="presentation">
                <a
                  id={`${listId}-${demo.slug}`}
                  role="option"
                  aria-selected={index === active}
                  href={demo.href}
                  onMouseEnter={() => setActive(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  className={
                    dark
                      ? `block px-4 py-3 ${index === active ? "bg-white/10" : ""}`
                      : `block px-4 py-3 ${index === active ? "bg-zinc-50" : ""}`
                  }
                >
                  <span
                    className={`block font-medium ${dark ? "text-white" : "text-ink-black"}`}
                  >
                    {demo.name}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs ${dark ? "text-white/55" : "text-body"}`}
                  >
                    {templateLabelForDemo(demo, locale)} · {demo.city}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs ${dark ? "text-lime" : "text-lime-deep"}`}
                  >
                    {demo.hostLabel}
                  </span>
                </a>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
