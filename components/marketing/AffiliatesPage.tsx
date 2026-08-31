import {
  CompanyPhone,
  SiteFooter,
  SiteHeader,
  StudioShell,
} from "@/components/marketing/Chrome";
import { COMPANY } from "@/lib/config";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function AffiliatesPage({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <StudioShell>
      <SiteHeader locale={locale} />
      <main className="mx-auto w-full max-w-3xl px-6 py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
          Phoenixwebhost Inc.
        </p>
        <h1 className="mt-4 font-display text-4xl text-ink-black sm:text-5xl">
          {c.affiliatesTitle}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-body">{c.affiliatesLead}</p>
        <section className="mt-14">
          <h2 className="font-display text-2xl text-ink-black">
            {c.affiliatesPayTitle}
          </h2>
          <p className="mt-4 leading-relaxed text-body">{c.affiliatesPayBody}</p>
        </section>
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink-black">
            {c.affiliatesLinkTitle}
          </h2>
          <p className="mt-4 leading-relaxed text-body">{c.affiliatesLinkBody}</p>
        </section>
        <p className="mt-12 text-sm text-body">
          <a href={COMPANY.telHref} className="btn-lime inline-flex rounded-full px-6 py-3 text-sm">
            {c.affiliatesCta}
          </a>
        </p>
        <p className="mt-6 text-sm text-body">
          {c.callPrompt} <CompanyPhone className="font-semibold text-ink-black hover:text-lime" />
          {" · "}
          <a href={`mailto:${COMPANY.email}`} className="hover:text-lime">
            {COMPANY.email}
          </a>
        </p>
      </main>
      <SiteFooter locale={locale} />
    </StudioShell>
  );
}
