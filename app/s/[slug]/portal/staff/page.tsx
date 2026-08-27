import Link from "next/link";
import { LogoutForm, PortalChrome } from "@/components/tax-portal/PortalChrome";
import { readSiteLocale } from "@/lib/read-site-locale";
import { withSiteLangPath } from "@/lib/site-locale";
import { requireTaxStaff } from "@/lib/tax-auth";
import { listTaxCustomers, taxPortalDbReady } from "@/lib/tax-db";
import { requireLiveTaxOffice } from "@/lib/tax-guard";
import { portalPath } from "@/lib/tax-office";
import { dateLocale, tTaxOffice } from "@/lib/tax-office-i18n";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

function fmt(iso: string | null, locale: Locale, empty: string) {
  if (!iso) return empty;
  return new Date(iso).toLocaleDateString(dateLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function StaffHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const client = await requireLiveTaxOffice(slug);
  const locale = await readSiteLocale(slug, searchParams);
  await requireTaxStaff(slug, client.id);
  const customers = taxPortalDbReady() ? await listTaxCustomers(client.id) : [];
  const c = tTaxOffice(locale);
  return (
    <PortalChrome
      client={client}
      locale={locale}
      nav={<LogoutForm slug={slug} label={c.signOut} />}
    >
      <h1 className="font-display text-3xl tracking-tight">
        {c.staffFoldersTitle}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-black/80">
        {c.staffFoldersLead(client.businessName)}
      </p>
      {customers.length === 0 ? (
        <p className="mt-8 text-sm text-black/70">{c.noClients}</p>
      ) : (
        <ul className="mt-8 divide-y divide-[#00FF66] border border-[#00FF66]">
          {customers.map((person) => (
            <li key={person.id}>
              <Link
                href={withSiteLangPath(
                  portalPath(slug, `/staff/${person.id}`),
                  locale,
                )}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-[#00FF66]/10"
              >
                <div>
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-sm text-black/70">
                    {person.email}
                    {person.phone ? ` · ${person.phone}` : ""}
                  </p>
                </div>
                <p className="text-sm">
                  {c.fileCount(person.fileCount)} ·{" "}
                  {fmt(person.lastUploadAt, locale, c.noFilesYet)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PortalChrome>
  );
}
