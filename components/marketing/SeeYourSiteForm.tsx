"use client";

import { useState } from "react";
import { previewPath, t } from "@/lib/i18n";
import {
  WALK_IN_TYPES,
  type WalkInTypeId,
} from "@/lib/walk-in-preview";
import type { Locale } from "@/lib/types";

const TYPE_LABEL: Record<
  WalkInTypeId,
  | "seeSiteTypeSalon"
  | "seeSiteTypeRestaurant"
  | "seeSiteTypeHandyman"
  | "seeSiteTypeContractor"
  | "seeSiteTypeCleaning"
  | "seeSiteTypeShop"
  | "seeSiteTypeOther"
> = {
  salon: "seeSiteTypeSalon",
  restaurant: "seeSiteTypeRestaurant",
  handyman: "seeSiteTypeHandyman",
  contractor: "seeSiteTypeContractor",
  cleaning: "seeSiteTypeCleaning",
  shop: "seeSiteTypeShop",
  other: "seeSiteTypeOther",
};

export function SeeYourSiteForm({
  locale,
  variant = "hero",
  name = "",
  type = "",
  kind = "",
  error,
}: {
  locale: Locale;
  variant?: "hero" | "page";
  name?: string;
  type?: string;
  kind?: string;
  error?: "name" | "type" | "kind" | null;
}) {
  const c = t(locale);
  const action = previewPath(locale);
  const [selected, setSelected] = useState(type || "");
  const card =
    variant === "page"
      ? "rounded-[1.75rem] border border-zinc-200 bg-snow p-6 text-ink-black sm:p-8"
      : "rounded-[1.75rem] border border-zinc-200 bg-snow p-5 text-ink-black shadow-[0_18px_40px_rgba(10,10,10,0.08)] sm:p-6";

  return (
    <form action={action} method="get" className={card}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
        {c.seeSiteKicker}
      </p>
      <h2
        className={
          variant === "page"
            ? "mt-3 font-display text-3xl text-ink-black sm:text-4xl"
            : "mt-2 font-display text-2xl text-ink-black sm:text-3xl"
        }
      >
        {c.seeSiteTitle}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-body">{c.seeSiteLead}</p>
      <label className="mt-6 block text-sm text-body">
        {c.seeSiteNameLabel}
        <input
          name="name"
          required
          defaultValue={name}
          placeholder={c.seeSiteNamePlaceholder}
          autoComplete="organization"
          enterKeyHint="next"
          className="field-studio mt-2 w-full rounded-full px-5 py-3.5 text-base"
        />
      </label>
      {error === "name" ? (
        <p role="alert" className="mt-2 text-sm text-lime-deep">
          {c.seeSiteNameNeeded}
        </p>
      ) : null}
      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-ink-black">
          {c.seeSiteTypeLabel}
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {WALK_IN_TYPES.map((row) => (
            <label
              key={row.id}
              className="relative flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-center text-sm text-ink-black has-[:checked]:border-lime has-[:checked]:bg-lime/10 has-[:checked]:text-ink-black"
            >
              <input
                type="radio"
                name="type"
                value={row.id}
                required
                defaultChecked={selected === row.id}
                onChange={() => setSelected(row.id)}
                className="sr-only"
              />
              {c[TYPE_LABEL[row.id]]}
            </label>
          ))}
        </div>
      </fieldset>
      {error === "type" ? (
        <p role="alert" className="mt-2 text-sm text-lime-deep">
          {c.seeSiteTypeNeeded}
        </p>
      ) : null}
      {selected === "other" ? (
        <label className="mt-4 block text-sm text-body">
          {c.seeSiteOtherLabel}
          <input
            name="kind"
            required
            defaultValue={kind}
            placeholder={c.seeSiteOtherPlaceholder}
            autoComplete="off"
            className="field-studio mt-2 w-full rounded-full px-5 py-3.5 text-base"
          />
        </label>
      ) : null}
      {error === "kind" ? (
        <p role="alert" className="mt-2 text-sm text-lime-deep">
          {c.seeSiteOtherNeeded}
        </p>
      ) : null}
      <button
        type="submit"
        className="btn-lime mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 py-3 text-sm sm:w-auto"
      >
        {c.seeSiteNext}
      </button>
      <p className="mt-3 text-xs text-body">{c.seeSiteNoFees}</p>
    </form>
  );
}
