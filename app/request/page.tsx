import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { t } from "@/lib/i18n";

export const metadata = { title: "Request a site" };

export default function RequestPage() {
  const c = t("en");
  return (
    <StudioShell>
      <SiteHeader locale="en" />
      <main className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl text-ink-black">{c.requestTitle}</h1>
          <p className="mt-4 text-lg text-ink-black/70">{c.requestLead}</p>
          <p className="price-gold mt-6">$200 to launch · $69/month to keep it live</p>
        </div>
        <RequestForm locale="en" />
      </main>
      <SiteFooter locale="en" />
    </StudioShell>
  );
}
