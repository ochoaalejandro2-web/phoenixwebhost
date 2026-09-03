import {
  CompanyPhone,
  SiteFooter,
  SiteHeader,
  StudioShell,
} from "@/components/marketing/Chrome";
import { SeeYourSiteForm } from "@/components/marketing/SeeYourSiteForm";
import { SeeYourSiteQuote } from "@/components/marketing/SeeYourSiteQuote";
import { renderClientSite } from "@/components/sites/Templates";
import { COMPANY } from "@/lib/config";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import {
  buildWalkInPreviewClient,
  parseWalkInType,
  sanitizeWalkInName,
} from "@/lib/walk-in-preview";

export function SeeYourSitePage({
  locale,
  name,
  type,
}: {
  locale: Locale;
  name?: string;
  type?: string;
}) {
  const c = t(locale);
  const businessName = sanitizeWalkInName(name);
  const walkInType = parseWalkInType(type);
  const missingName = Boolean(type) && !businessName;
  const missingType = Boolean(businessName) && !walkInType;
  const ready = Boolean(businessName && walkInType);

  return (
    <StudioShell>
      <SiteHeader locale={locale} />
      {ready && walkInType ? (
        <SeeYourSiteResult
          locale={locale}
          businessName={businessName}
          type={walkInType}
        />
      ) : (
        <main className="mx-auto w-full max-w-3xl px-6 py-14 sm:py-20">
          <SeeYourSiteForm
            locale={locale}
            variant="page"
            name={businessName}
            type={walkInType || type || ""}
            error={missingName ? "name" : missingType ? "type" : null}
          />
          <p className="mt-8 text-sm text-body">
            {c.callPrompt}{" "}
            <CompanyPhone className="font-semibold text-ink-black hover:text-lime" />
            . {COMPANY.email}
          </p>
        </main>
      )}
      <SiteFooter locale={locale} />
    </StudioShell>
  );
}

function SeeYourSiteResult({
  locale,
  businessName,
  type,
}: {
  locale: Locale;
  businessName: string;
  type: NonNullable<ReturnType<typeof parseWalkInType>>;
}) {
  const c = t(locale);
  const client = buildWalkInPreviewClient({ businessName, type, locale });
  return (
    <main>
      <section className="border-b border-zinc-100 bg-header text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lime">
              {c.seeSitePreviewKicker}
            </p>
            <p className="mt-1 truncate text-sm text-white/80">{businessName}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href={COMPANY.telHref} className="text-lime hover:text-white">
              {c.seeSiteCtaCall} {COMPANY.phone}
            </a>
            <a href={COMPANY.smsHref} className="text-white/70 hover:text-lime">
              {c.seeSiteCtaText} {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1.05fr)_22rem] lg:items-start lg:px-6">
        <div>
          <p className="mb-4 text-sm leading-relaxed text-body">
            {c.seeSitePreviewNote}
          </p>
          <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-[0_24px_60px_rgba(10,10,10,0.10)]">
            <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <span className="h-2 w-2 rounded-full bg-lime" />
              <span className="ml-2 truncate text-[11px] tracking-wide text-body">
                {businessName.toLowerCase().replace(/[^a-z0-9]+/g, "") || "preview"}
                .phoenixwebhost.com
              </span>
            </div>
            <div className="demo-preview max-h-[70vh] overflow-y-auto">
              {renderClientSite(client, null, locale)}
            </div>
          </div>
        </div>
        <SeeYourSiteQuote
          locale={locale}
          businessName={businessName}
          type={type}
        />
      </div>
    </main>
  );
}
