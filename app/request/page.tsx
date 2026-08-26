import { SiteFooter, SiteHeader } from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { t } from "@/lib/i18n";

export const metadata = { title: "Request a site" };

export default function RequestPage() {
  const c = t("en");
  return (
    <div className="flex min-h-full flex-col grain">
      <SiteHeader locale="en" />
      <main className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl">{c.requestTitle}</h1>
          <p className="mt-4 text-lg text-ink-soft">{c.requestLead}</p>
          <p className="mt-6 text-ink">$200 to launch · $69/month to keep it live</p>
        </div>
        <RequestForm locale="en" />
      </main>
      <SiteFooter locale="en" />
    </div>
  );
}
