"use client";

import type { AdsTier } from "@/lib/ads";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function AdsTierPicker({
  value,
  onChange,
  boostReady,
  trafficReady,
  loudReady,
  locale,
}: {
  value: AdsTier;
  onChange: (tier: AdsTier) => void;
  boostReady: boolean;
  trafficReady: boolean;
  loudReady: boolean;
  locale: Locale;
}) {
  const c = t(locale);

  function toggle(tier: Exclude<AdsTier, "none">) {
    onChange(value === tier ? "none" : tier);
  }

  const options = [
    {
      id: "boost" as const,
      title: c.boostCheckbox,
      help: c.boostCheckboxHelp,
      missing: c.boostMissing,
      ready: boostReady,
      price: "$79",
      priceHint: c.boostMonthHint,
      extra: "$99",
      extraHint: c.boostSetupHint,
    },
    {
      id: "traffic" as const,
      title: c.trafficCheckbox,
      help: c.trafficCheckboxHelp,
      missing: c.trafficMissing,
      ready: trafficReady,
      price: "$199",
      priceHint: c.trafficMonthHint,
    },
    {
      id: "loud" as const,
      title: c.loudCheckbox,
      help: c.loudCheckboxHelp,
      missing: c.loudMissing,
      ready: loudReady,
      price: "$349",
      priceHint: c.loudMonthHint,
    },
  ];

  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-medium text-ink-black">{c.adsPickOne}</legend>
      <p className="text-sm text-body">{c.adsLadderHelp}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option.id)}
              className={`min-h-[7.5rem] rounded-2xl border p-4 text-left text-sm transition ${
                selected
                  ? "border-lime bg-lime/10 text-ink-black"
                  : "border-zinc-200 bg-zinc-50/80 text-body hover:border-lime"
              }`}
            >
              <span className="block font-medium text-ink-black">{option.title}</span>
              <span className="mt-2 flex flex-wrap items-end gap-3">
                {option.extra ? (
                  <span>
                    <span className="price-lime font-display text-2xl">{option.extra}</span>
                    <span className="mt-0.5 block text-xs">{option.extraHint}</span>
                  </span>
                ) : null}
                <span>
                  <span className="price-lime font-display text-2xl">{option.price}</span>
                  <span className="mt-0.5 block text-xs">{option.priceHint}</span>
                </span>
              </span>
              <span className="mt-2 block text-xs leading-relaxed">{option.help}</span>
              {selected && !option.ready ? (
                <span className="mt-2 block text-xs text-lime-deep">{option.missing}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
