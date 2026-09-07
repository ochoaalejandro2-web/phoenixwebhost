import Link from "next/link";
import { PACKAGES, PACKAGE_IDS, requestWithPackage } from "@/lib/packages";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

function LimeCheck() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-lime"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 8.2 L6.8 10.4 L11.5 5.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LimeDash() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 8 H11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PackagesSection({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
        {c.packagesKicker}
      </p>
      <h2 className="mt-3 font-display text-3xl text-ink-black sm:text-4xl">
        {c.packagesTitle}
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-body">{c.packagesLead}</p>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PACKAGE_IDS.map((id) => {
          const pkg = PACKAGES[id];
          const copy = pkg.copy[locale];
          const popular = pkg.popular;
          return (
            <article
              key={id}
              className={
                popular
                  ? "relative flex flex-col rounded-[1.75rem] border-2 border-lime bg-snow p-7 shadow-[0_18px_40px_rgba(0,200,81,0.12)]"
                  : "relative flex flex-col rounded-[1.75rem] border border-zinc-200 bg-snow p-7"
              }
            >
              {popular ? (
                <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                  {c.packageMostPopular}
                </p>
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
                {copy.name}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <p className="price-lime font-display text-4xl">{pkg.setupLabel}</p>
                <p className="pb-1 text-xs text-body">{c.packageLaunchHint}</p>
              </div>
              <div className="mt-1 flex items-end gap-2">
                <p className="font-display text-2xl text-ink-black">
                  {pkg.monthlyLabel}
                </p>
                <p className="pb-0.5 text-xs text-body">{c.packageMonthHint}</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-body">{copy.blurb}</p>
              <ul className="mt-6 grid gap-2.5">
                {copy.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-ink-black">
                    <LimeCheck />
                    <span>{item}</span>
                  </li>
                ))}
                {copy.notIncluded.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-body">
                    <LimeDash />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={requestWithPackage(locale, id)}
                  className="btn-lime inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm"
                >
                  {c.packageCtaRequest}
                </Link>
                {pkg.monthlyCareUrl ? (
                  <a
                    href={pkg.monthlyCareUrl}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm text-ink-black hover:border-lime"
                  >
                    {c.packagePayMonthly}
                  </a>
                ) : (
                  <Link
                    href={requestWithPackage(locale, id)}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm text-body hover:border-lime hover:text-ink-black"
                  >
                    {c.packageCtaContact}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-8 text-sm leading-relaxed text-body">{c.packagesOverage}</p>
    </div>
  );
}
