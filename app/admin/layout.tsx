import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { Mark } from "@/components/brand/Logo";
import { storageMode } from "@/lib/store";
import { stripeModeLabel } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwner();
  const mode = storageMode();
  return (
    <div className="flex min-h-full bg-sand text-ink">
      <aside className="hidden w-60 shrink-0 border-r border-line bg-sage text-white md:flex md:flex-col">
        <div className="flex items-center gap-2 px-5 py-5">
          <Mark size={28} />
          <div>
            <p className="font-display text-sm">Phoenixwebhost</p>
            <p className="text-[11px] uppercase tracking-wider text-white/70">
              Owner panel
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3 text-sm">
          <Link className="rounded-lg px-3 py-2 hover:bg-white/10" href="/admin">
            Dashboard
          </Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-white/10" href="/admin/clients">
            Clients
          </Link>
          <Link
            className="rounded-lg px-3 py-2 hover:bg-white/10"
            href="/admin/clients/new"
          >
            New client
          </Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-white/10" href="/admin/leads">
            Requests
          </Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-white/10" href="/admin/affiliates">
            Affiliates
          </Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-white/10" href="/admin/reviews">
            Reviews
          </Link>
        </nav>
        <div className="mt-auto px-5 py-5 text-xs text-white/70">
          <p>Alex Ochoa</p>
          <p>Stripe: {stripeModeLabel()}</p>
          <p>Data: {mode}</p>
          <a href="/api/auth/logout" className="mt-3 inline-block text-white">
            Sign out
          </a>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-paper px-5 py-3 md:hidden">
          <span className="font-display">Owner panel</span>
          <nav className="flex gap-3 text-sm">
            <Link href="/admin">Home</Link>
            <Link href="/admin/clients">Clients</Link>
            <Link href="/admin/leads">Requests</Link>
            <Link href="/admin/affiliates">Affiliates</Link>
            <Link href="/admin/reviews">Reviews</Link>
            <a href="/api/auth/logout">Out</a>
          </nav>
        </header>
        {mode !== "postgres" && process.env.VERCEL ? (
          <p className="bg-[#f6e2c8] px-5 py-2 text-sm text-ink">
            No DATABASE_URL on Vercel — client records reset when the server
            sleeps. Add a Neon Postgres URL for production.
          </p>
        ) : null}
        <div className="flex-1 px-5 py-6">{children}</div>
      </div>
    </div>
  );
}
