"use client";

import { useState } from "react";
import { TemplatePreview } from "@/components/marketing/HeroDevices";
import { DemoSearch } from "@/components/marketing/DemoSearch";
import { TEMPLATES } from "@/lib/config";
import { t } from "@/lib/i18n";
import {
  demoForTemplate,
  filterTemplates,
} from "@/lib/public-demos";
import type { Locale } from "@/lib/types";

export function StartingPoints({ locale }: { locale: Locale }) {
  const c = t(locale);
  const [query, setQuery] = useState("");
  const visible = TEMPLATES.filter((tpl) =>
    filterTemplates(query).includes(tpl.id),
  );

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-lime">
            {locale === "es" ? "Puntos de partida" : "Starting points"}
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink-black sm:text-4xl">
            {c.templatesTitle}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-body">{c.templatesLead}</p>
      </div>
      <div className="mt-8 max-w-lg">
        <DemoSearch
          locale={locale}
          variant="section"
          query={query}
          onQueryChange={setQuery}
        />
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((tpl) => {
          const demo = demoForTemplate(tpl.id);
          const title = locale === "es" ? tpl.nameEs : tpl.name;
          const blurb = locale === "es" ? tpl.blurbEs : tpl.blurb;
          const body = (
            <>
              <TemplatePreview id={tpl.id} />
              <div className="px-2 pb-4 pt-5">
                <h3 className="font-display text-xl text-ink-black">{title}</h3>
                <p className="mt-2 text-sm text-body">{blurb}</p>
                {demo ? (
                  <p className="mt-3 text-xs font-medium text-lime">
                    {demo.name} →
                  </p>
                ) : null}
              </div>
            </>
          );
          if (!demo) {
            return (
              <article
                key={tpl.id}
                className="rounded-[1.5rem] border border-zinc-200 bg-snow p-3"
              >
                {body}
              </article>
            );
          }
          return (
            <article
              key={tpl.id}
              className="group rounded-[1.5rem] border border-zinc-200 bg-snow p-3 transition hover:border-lime/50"
            >
              <a
                href={demo.href}
                className="block rounded-[1.2rem] outline-none focus-visible:ring-2 focus-visible:ring-lime"
                aria-label={`${c.searchOpenDemo}: ${demo.name}`}
              >
                {body}
              </a>
            </article>
          );
        })}
      </div>
      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-body">{c.searchEmpty}</p>
      ) : null}
    </section>
  );
}
