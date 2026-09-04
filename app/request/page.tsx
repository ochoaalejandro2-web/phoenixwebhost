import {
  CompanyPhone,
  SiteFooter,
  SiteHeader,
  StudioShell,
} from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { parseAdsTier } from "@/lib/ads";
import {
  COMPANY,
  stripeBookConfigured,
  stripeBoostConfigured,
  stripeDomainConfigured,
  stripeEmailConfigured,
  stripeLoudConfigured,
  stripeMissedCallConfigured,
  stripeReviewTextsConfigured,
  stripeTrafficConfigured,
  stripeVoiceConfigured,
} from "@/lib/config";
import { parseTemplateId } from "@/lib/demo";
import { parseExtraPicks } from "@/lib/extra-picks";
import { t } from "@/lib/i18n";
import {
  parseQuotedPicks,
  sanitizeWalkInKind,
  sanitizeWalkInName,
} from "@/lib/walk-in-preview";

export const metadata = { title: "Request a demo" };

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{
    ads?: string;
    extra?: string | string[];
    business?: string;
    template?: string;
    quoted?: string | string[];
    other?: string;
  }>;
}) {
  const { ads, extra, business, template, quoted, other } = await searchParams;
  const c = t("en");
  return (
    <StudioShell>
      <SiteHeader locale="en" />
      <main className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl text-ink-black">{c.requestTitle}</h1>
          <p className="mt-5 text-lg text-body">{c.requestLead}</p>
          <p className="price-lime mt-8 text-lg">$200 to launch · $69/month to keep it live</p>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-body">
            First payment is $269 if you pay launch and the first month together.
            This demo starts from a proven template — we do not invent a brand-new
            custom design for $200.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Optional Local Boost: $99 once plus $79/month extra for Google Business
            Profile setup and a small local ad to your own site. Not magic SEO.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Optional Traffic: $199/month extra for a bigger Google ad than Local
            Boost, so more people can see the business. Not a ranking promise.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Optional Loud: $349/month extra for the aggressive ads package. Louder
            ads, more people seeing it. Not a ranking promise. Pick one ads level.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Optional Business Email: $49 once plus $19/month extra for one
            professional inbox such as info@your domain. A real business email so
            customers take you seriously — not magic.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            The AI receptionist chat is included in $200 + $69. Optional extras:
            register a .com (~$20 first year), Book a job $49 + $19/mo,
            missed-call text-back $49 + $29/mo, review texts $29/mo, voice
            receptionist $99 + $79/mo. Those are not the included chat. If you
            already have a domain, skip domain register.
          </p>
          <p className="mt-6 text-sm text-body">
            {c.callPrompt}{" "}
            <CompanyPhone className="font-semibold text-ink-black hover:text-lime" />
            . {COMPANY.email}
          </p>
        </div>
        <RequestForm
          locale="en"
          boostReady={stripeBoostConfigured()}
          trafficReady={stripeTrafficConfigured()}
          loudReady={stripeLoudConfigured()}
          emailReady={stripeEmailConfigured()}
          bookReady={stripeBookConfigured()}
          missedReady={stripeMissedCallConfigured()}
          reviewsReady={stripeReviewTextsConfigured()}
          voiceReady={stripeVoiceConfigured()}
          domainReady={stripeDomainConfigured()}
          initialAds={parseAdsTier(ads)}
          initialExtras={parseExtraPicks(extra)}
          initialBusiness={sanitizeWalkInName(business)}
          initialTemplate={parseTemplateId(template) || ""}
          initialQuoted={parseQuotedPicks(quoted)}
          initialOther={sanitizeWalkInKind(other)}
        />
      </main>
      <SiteFooter locale="en" />
    </StudioShell>
  );
}
