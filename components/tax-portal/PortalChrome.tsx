import { clientThemeClass } from "@/lib/client-themes";
import { portalPath } from "@/lib/tax-office";
import type { Client } from "@/lib/types";

export const taxFieldClass =
  "mt-1 w-full rounded-none border border-[#00FF66] bg-white px-3 py-2 text-black outline-none focus:shadow-[0_0_0_3px_rgba(0,255,102,0.25)]";

export const taxButtonClass =
  "inline-flex items-center justify-center bg-[#00FF66] px-5 py-2 text-sm font-semibold text-black hover:bg-[#00E840] disabled:opacity-60";

export function PortalChrome({
  client,
  children,
  nav,
}: {
  client: Client;
  children: React.ReactNode;
  nav?: React.ReactNode;
}) {
  return (
    <div
      className={`${clientThemeClass("tax")} flex min-h-full flex-col bg-white text-black`}
    >
      <header className="border-b border-[#00FF66] bg-white px-5 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <a
            href={`/s/${client.slug}`}
            className="font-display text-lg tracking-tight text-black"
          >
            {client.businessName}
          </a>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {nav}
            <a href={portalPath(client.slug)} className="font-semibold hover:text-[#00E840]">
              Client portal
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">{children}</main>
      <footer className="border-t border-[#00FF66] px-5 py-6 text-sm text-black/70">
        <div className="mx-auto max-w-5xl">
          Private document drop box · Buzón privado de documentos. Not tax-prep
          software.
        </div>
      </footer>
    </div>
  );
}

export function LogoutForm({ slug }: { slug: string }) {
  return (
    <form action={`/api/tax-portal/${slug}/logout`} method="post">
      <button type="submit" className="text-sm font-semibold hover:text-[#00E840]">
        Sign out
      </button>
    </form>
  );
}
