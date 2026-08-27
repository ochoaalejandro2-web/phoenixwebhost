import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { stripeBoostConfigured } from "@/lib/config";
import { t } from "@/lib/i18n";

export const metadata = { title: "Request a site" };

export default function RequestPage() {
  const c = t("en");
  return (
    <StudioShell>
      <SiteHeader locale="en" />
      <main className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl text-ink-black">{c.requestTitle}</h1>
          <p className="mt-5 text-lg text-body">{c.requestLead}</p>
          <p className="price-lime mt-8 text-lg">$200 to launch · $69/month to keep it live</p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Optional Local Boost: $99 once plus $79/month extra for Google Business
            Profile setup and a small local ad to your own site. Not magic SEO.
          </p>
        </div>
        <RequestForm locale="en" boostReady={stripeBoostConfigured()} />
      </main>
      <SiteFooter locale="en" />
    </StudioShell>
  );
}
