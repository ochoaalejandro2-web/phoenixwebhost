import { SiteLangToggle } from "@/components/sites/SiteLangToggle";
import { clientThemeClass } from "@/lib/client-themes";
import { withSiteLangPath } from "@/lib/site-locale";
import { portalPath } from "@/lib/tax-office";
import { tTaxOffice } from "@/lib/tax-office-i18n";
import type { Client, Locale } from "@/lib/types";

export const taxFieldClass =
  "mt-1 w-full rounded-none border border-[#00FF66] bg-white px-3 py-2 text-black outline-none focus:shadow-[0_0_0_3px_rgba(0,255,102,0.25)]";

export const taxButtonClass =
  "inline-flex items-center justify-center bg-[#00FF66] px-5 py-2 text-sm font-semibold text-black hover:bg-[#00E840] disabled:opacity-60";

export function PortalChrome({
  client,
  children,
  nav,
  locale,
}: {
  client: Client;
  children: React.ReactNode;
  nav?: React.ReactNode;
  locale: Locale;
}) {
  const c = tTaxOffice(locale);
  return (
    <div
      lang={locale}
      className={`${clientThemeClass("tax")} flex min-h-full flex-col bg-white text-black`}
    >
      <header className="border-b border-[#00FF66] bg-white px-5 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <a
            href={withSiteLangPath(`/s/${client.slug}`, locale)}
            className="font-display text-lg tracking-tight text-black"
          >
            {client.businessName}
          </a>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <SiteLangToggle
              slug={client.slug}
              locale={locale}
              label={c.langNav}
            />
            {nav}
            <a
              href={withSiteLangPath(portalPath(client.slug), locale)}
              className="font-semibold hover:text-[#00E840]"
            >
              {c.portalNav}
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">{children}</main>
      <footer className="border-t border-[#00FF66] px-5 py-6 text-sm text-black/70">
        <div className="mx-auto max-w-5xl">{c.portalFooter}</div>
      </footer>
    </div>
  );
}

export function LogoutForm({
  slug,
  label,
}: {
  slug: string;
  label: string;
}) {
  return (
    <form action={`/api/tax-portal/${slug}/logout`} method="post">
      <button type="submit" className="text-sm font-semibold hover:text-[#00E840]">
        {label}
      </button>
    </form>
  );
}
