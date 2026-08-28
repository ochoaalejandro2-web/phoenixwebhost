import Link from "next/link";
import { listClients, listLeads, listReviews, storageMode } from "@/lib/store";
import { visitTotals } from "@/lib/visits";
import { stripeConfigured } from "@/lib/config";
import { telHref } from "@/lib/notify";
import { stripeModeLabel } from "@/lib/stripe";
import { resetDemoAction } from "@/app/admin/actions";
import type { Lead } from "@/lib/types";

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OpenRequestCard({ lead }: { lead: Lead }) {
  const name = lead.name.trim() || "Unnamed";
  const business = lead.businessName.trim();
  const phone = lead.phone.trim();
  const email = lead.email.trim();
  const note = lead.message.trim();
  const callHref = phone ? telHref(phone) : null;

  return (
    <li className="relative rounded-2xl border border-line bg-paper p-5 transition hover:border-clay/40">
      <p className="font-display text-xl">{name}</p>
      {business ? <p className="mt-0.5 text-sm">{business}</p> : null}
      <p className="relative z-10 mt-2 text-sm text-ink-soft">
        {phone ? (
          callHref ? (
            <a href={callHref} className="hover:text-clay">
              {phone}
            </a>
          ) : (
            phone
          )
        ) : (
          "No phone"
        )}
        {" · "}
        {email ? (
          <a href={`mailto:${email}`} className="hover:text-clay">
            {email}
          </a>
        ) : (
          "No email"
        )}
      </p>
      <p className="mt-2 text-xs text-ink-soft">
        {lead.purchased ? "Purchased" : "Not purchased"} · /demo/{lead.id}
      </p>
      <p className={note ? "mt-3 text-sm" : "mt-3 text-sm text-ink-soft"}>
        {note || "No note"}
      </p>
      <Link
        href={`/admin/leads#${lead.id}`}
        className="absolute inset-0 z-[1] rounded-2xl"
        aria-label={`Open request from ${name}`}
      />
    </li>
  );
}

function PayBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-sage text-white",
    overdue: "bg-clay text-white",
    unpaid: "bg-mesa text-white",
    none: "bg-sand text-ink",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] || "bg-sand"}`}>
      {status}
    </span>
  );
}

export default async function AdminHome() {
  const [clients, leads, reviews, visits] = await Promise.all([
    listClients(),
    listLeads(),
    listReviews(),
    visitTotals(),
  ]);
  const pendingReviews = reviews.filter((review) => review.status === "pending").length;
  const paid = clients.filter((c) => c.paymentStatus === "paid").length;
  const overdue = clients.filter((c) => c.paymentStatus === "overdue").length;
  const live = clients.filter((c) => c.siteStatus === "live").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Phoenixwebhost Inc. · Alex Ochoa · {clients.length} client sites · Stripe{" "}
            {stripeModeLabel()}
            {stripeConfigured() ? "" : " (keys not set)"} · storage {storageMode()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/clients/new"
            className="rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white"
          >
            New client
          </Link>
          <form action={resetDemoAction}>
            <button className="rounded-full border border-line px-4 py-2 text-sm">
              Reset demo data
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-display text-xl">Visits to phoenixwebhost.com</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">
          How many times people opened the public site (home, Spanish, request,
          or reviews). Shop sites such as Hola Tax are not counted. Days use
          Phoenix time.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-soft">Today</p>
            <p className="mt-1 font-display text-3xl">{visits.today}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-soft">
              Last 7 days
            </p>
            <p className="mt-1 font-display text-3xl">{visits.last7}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-soft">
              Last 30 days
            </p>
            <p className="mt-1 font-display text-3xl">{visits.last30}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-wider text-ink-soft">Live sites</p>
          <p className="mt-1 font-display text-3xl">{live}</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-wider text-ink-soft">Paid</p>
          <p className="mt-1 font-display text-3xl">{paid}</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-wider text-ink-soft">Overdue</p>
          <p className="mt-1 font-display text-3xl">{overdue}</p>
        </div>
      </div>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Open demo requests</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Public Request a Demo leads. Name, contact, notes, demo URL, and
              whether they purchased — call next morning if they did not pay.
            </p>
          </div>
          <Link href="/admin/leads" className="text-sm text-clay">
            All requests
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {leads.length === 0 ? (
            <li className="rounded-2xl border border-line bg-paper p-5 text-sm text-ink-soft">
              No open requests.
            </li>
          ) : (
            leads.map((lead) => <OpenRequestCard key={lead.id} lead={lead} />)
          )}
        </ul>
      </section>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Site</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Boost</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Last payment</th>
              <th className="px-4 py-3">Next invoice</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link className="font-semibold text-ink" href={`/admin/clients/${client.id}`}>
                    {client.businessName}
                  </Link>
                  <p className="text-xs text-ink-soft">{client.city}</p>
                </td>
                <td className="px-4 py-3">
                  <Link className="text-clay" href={`/s/${client.slug}`} target="_blank">
                    /s/{client.slug}
                  </Link>
                </td>
                <td className="px-4 py-3">{client.template}</td>
                <td className="px-4 py-3">{client.siteStatus}</td>
                <td className="px-4 py-3">
                  <PayBadge status={client.paymentStatus} />
                </td>
                <td className="px-4 py-3">
                  {client.localBoost ? "Local Boost" : "—"}
                </td>
                <td className="px-4 py-3">
                  {client.businessEmail ? "Business Email" : "—"}
                </td>
                <td className="px-4 py-3">{fmt(client.lastPaymentAt)}</td>
                <td className="px-4 py-3">{fmt(client.nextInvoiceAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-ink-soft">
        {pendingReviews} review{pendingReviews === 1 ? "" : "s"} waiting for
        approval.{" "}
        <Link href="/admin/reviews" className="text-clay">
          Moderate reviews
        </Link>
      </p>
    </div>
  );
}
