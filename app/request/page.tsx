import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { stripeBoostConfigured, stripeEmailConfigured } from "@/lib/config";
import { t } from "@/lib/i18n";

export const metadata = { title: "Request a demo" };

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
            Optional Business Email: $49 once plus $19/month extra for one
            professional inbox such as info@your domain. A real business email so
            customers take you seriously — not magic.
          </p>
        </div>
        <RequestForm
          locale="en"
          boostReady={stripeBoostConfigured()}
          emailReady={stripeEmailConfigured()}
        />
      </main>
      <SiteFooter locale="en" />
    </StudioShell>
  );
}
