"use client";

import { PACKAGES, PACKAGE_IDS, type PackageId } from "@/lib/packages";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function PackagePicker({
  value,
  onChange,
  locale,
  packageIds = PACKAGE_IDS,
}: {
  value: PackageId;
  onChange: (id: PackageId) => void;
  locale: Locale;
  packageIds?: readonly PackageId[];
}) {
  const c = t(locale);
  const columns = packageIds.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-medium text-ink-black">
        {c.packagePickerTitle}
      </legend>
      <p className="text-sm text-body">{c.packagePickerHelp}</p>
      <div className={`grid gap-3 ${columns}`}>
        {packageIds.map((id) => {
          const pkg = PACKAGES[id];
          const copy = pkg.copy[locale];
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className={`min-h-[7.5rem] rounded-2xl border p-4 text-left text-sm transition ${
                selected
                  ? "border-lime bg-lime/10 text-ink-black"
                  : "border-zinc-200 bg-zinc-50/80 text-body hover:border-lime"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-medium text-ink-black">{copy.name}</span>
                {pkg.popular ? (
                  <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                    {c.packageMostPopular}
                  </span>
                ) : null}
              </span>
              <span className="mt-2 block font-display text-lg text-ink-black">
                {pkg.setupLabel} + {pkg.monthlyLabel}
                {locale === "es" ? "/mes" : "/mo"}
              </span>
              <span className="mt-1 block text-xs leading-relaxed">{copy.blurb}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
