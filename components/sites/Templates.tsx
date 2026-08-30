import type { ReactNode } from "react";
import { ReceptionistChat } from "@/components/sites/ReceptionistChat";
import { ShopSite } from "@/components/sites/ShopSite";
import { TaxOfficeSite } from "@/components/sites/TaxOfficeSite";
import { isTaxOfficeTemplate } from "@/lib/client-themes";
import { COMPANY } from "@/lib/config";
import { isPreviewClient } from "@/lib/demo";
import type { Client, ContactNotice, Locale } from "@/lib/types";

export function OfflineSite({ client }: { client: Client }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 py-20 text-center text-ink">
      <p className="text-sm uppercase tracking-[0.18em] text-mesa">
        Phoenixwebhost Inc.
      </p>
      <h1 className="mt-4 max-w-xl font-display text-4xl">
        This website is temporarily offline
      </h1>
      <p className="mt-4 max-w-lg text-ink-soft">
        {client.businessName} is not available right now. If this is your site,
        contact Phoenixwebhost Inc. to restore service.
      </p>
      <p className="mt-2 max-w-lg text-ink-soft">
        Este sitio está temporalmente fuera de línea. Si es suyo, escriba a
        Phoenixwebhost Inc. para restablecerlo.
      </p>
      <p className="mt-8 text-sm text-ink-soft">
        <a href={COMPANY.telHref} className="font-semibold text-ink hover:underline">
          {COMPANY.phone}
        </a>
        {" · "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
      </p>
    </div>
  );
}

export function TakenDownSite() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-20 text-center text-ink">
      <h1 className="font-display text-4xl">This site is no longer available</h1>
      <p className="mt-4 text-ink-soft">
        Files were kept for 30 days after the account went unpaid, then removed.
      </p>
    </div>
  );
}

export function renderClientSite(
  client: Client,
  notice?: ContactNotice | null,
  locale: Locale = "en",
) {
  if (client.siteStatus === "taken_down") return <TakenDownSite />;
  if (client.siteStatus === "offline" || client.siteStatus === "paused") {
    return <OfflineSite client={client} />;
  }
  if (isTaxOfficeTemplate(client.template)) {
    const site = (
      <TaxOfficeSite client={client} notice={notice} locale={locale} />
    );
    return withReceptionist(client, locale, site);
  }
  const site = <ShopSite client={client} notice={notice} locale={locale} />;
  return withReceptionist(client, locale, site);
}

function withReceptionist(
  client: Client,
  locale: Locale,
  site: ReactNode,
) {
  if (isPreviewClient(client)) return site;
  return (
    <>
      {site}
      <ReceptionistChat
        site={client.slug}
        locale={locale}
        businessName={client.businessName}
      />
    </>
  );
}
