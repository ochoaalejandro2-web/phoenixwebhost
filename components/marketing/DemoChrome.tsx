import {
  DemoBar,
  DemoChat,
  DemoPurchase,
} from "@/components/marketing/DemoStudio";
import {
  stripeBoostConfigured,
  stripeConfigured,
  stripeEmailConfigured,
} from "@/lib/config";
import {
  accentHex,
  extraDemoPath,
  leadHasExtraPage,
  templateLabel,
} from "@/lib/demo";
import { t } from "@/lib/i18n";
import type { Lead } from "@/lib/types";

export function DemoChrome({
  lead,
  children,
}: {
  lead: Lead;
  children: React.ReactNode;
}) {
  const locale = lead.locale;
  const c = t(locale);
  const hex = accentHex(lead.demo.accent);
  return (
    <div className="studio min-h-full bg-snow text-ink-black">
      <DemoBar lead={lead} locale={locale} />
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-lime">
            {templateLabel(lead.template, locale)}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink-black">
            {lead.businessName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body">
            {c.demoPrice}
          </p>
          <p className="mt-2 text-sm text-body">{c.demoEmailNote}</p>
          {leadHasExtraPage(lead.demo) ? (
            <p className="mt-2 text-sm">
              <a
                href={extraDemoPath(lead.id)}
                className="text-lime hover:text-lime-deep"
              >
                {c.demoExtraNav}
              </a>
            </p>
          ) : null}
          <div className="mt-6">
            <p className="font-display text-xl text-ink-black">
              {c.demoPurchaseTitle}
            </p>
            <div className="mt-4">
              <DemoPurchase
                lead={lead}
                locale={locale}
                stripeReady={stripeConfigured()}
                boostReady={stripeBoostConfigured()}
                emailReady={stripeEmailConfigured()}
              />
            </div>
          </div>
        </div>
        <DemoChat lead={lead} locale={locale} />
      </div>
      <div
        className="demo-preview border-t border-zinc-200"
        data-accent={lead.demo.accent}
        style={hex ? { ["--site-accent" as string]: hex } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
