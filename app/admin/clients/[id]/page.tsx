import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addEditRequestAction,
  addNoteAction,
  checkoutClientAction,
  finishEditRequestAction,
  markPaidAction,
  markUnpaidAction,
  runPolicyAction,
  saveClientAction,
  sendReminderAction,
  setSiteStatusAction,
} from "@/app/admin/actions";
import { editsThisMonth } from "@/lib/billing";
import { PRICING } from "@/lib/config";
import { monthKey } from "@/lib/slug";
import { getClient, listContactMessages } from "@/lib/store";

export const dynamic = "force-dynamic";

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();
  const usage = editsThisMonth(client, monthKey());
  const thisMonthEdits = client.editRequests.filter((e) => e.month === monthKey());
  const messages = await listContactMessages(client.id);
  const field =
    "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="text-sm text-ink-soft">
          <Link href="/admin/clients">Clients</Link> / {client.slug}
        </p>
        <h1 className="mt-1 font-display text-3xl">{client.businessName}</h1>
        <p className="mt-2 text-ink-soft">
          Template: {client.template} · Site: {client.siteStatus} · Payment:{" "}
          <strong>{client.paymentStatus}</strong>
          {" · "}
          Local Boost:{" "}
          <strong>{client.localBoost ? "purchased" : "not purchased"}</strong>
        </p>
        <p className="mt-1 text-sm">
          Public URL:{" "}
          <Link className="text-clay" href={`/s/${client.slug}`} target="_blank">
            /s/{client.slug}
          </Link>
          {" · "}
          {client.slug}.phoenixwebhost.com
          {client.customDomain ? ` · ${client.customDomain}` : ""}
        </p>

        <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-paper p-5 text-sm sm:grid-cols-2">
          <p>Last payment: {fmt(client.lastPaymentAt)}</p>
          <p>Next invoice: {fmt(client.nextInvoiceAt)}</p>
          <p>Stripe customer: {client.stripeCustomerId || "—"}</p>
          <p>Subscription: {client.stripeSubscriptionId || "—"}</p>
          <p>Local Boost: {client.localBoost ? "purchased" : "not purchased"}</p>
          <p>Boost subscription: {client.stripeBoostSubscriptionId || "—"}</p>
          <p>Reminder: {fmt(client.reminderSentAt)}</p>
          <p>Overdue since: {fmt(client.overdueSince)}</p>
          <p>Offline at: {fmt(client.offlineAt)}</p>
          <p>Files kept until: {fmt(client.filesKeptUntil)}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <form action={markPaidAction}>
            <input type="hidden" name="clientId" value={client.id} />
            <button className="rounded-full bg-sage px-3 py-1.5 text-sm text-white">
              Mark paid / restore
            </button>
          </form>
          <form action={markUnpaidAction}>
            <input type="hidden" name="clientId" value={client.id} />
            <button className="rounded-full bg-clay px-3 py-1.5 text-sm text-white">
              Simulate unpaid
            </button>
          </form>
          <form action={sendReminderAction}>
            <input type="hidden" name="clientId" value={client.id} />
            <button className="rounded-full border border-line px-3 py-1.5 text-sm">
              Record reminder
            </button>
          </form>
          <form action={runPolicyAction}>
            <input type="hidden" name="clientId" value={client.id} />
            <button className="rounded-full border border-line px-3 py-1.5 text-sm">
              Apply unpaid policy
            </button>
          </form>
          <form action={checkoutClientAction}>
            <input type="hidden" name="clientId" value={client.id} />
            <button className="rounded-full border border-line px-3 py-1.5 text-sm">
              Stripe Checkout
            </button>
          </form>
          {client.localBoost ? null : (
            <>
              {client.paymentStatus === "paid" ? (
                <form action={checkoutClientAction}>
                  <input type="hidden" name="clientId" value={client.id} />
                  <input type="hidden" name="kind" value="boost" />
                  <button className="rounded-full border border-line px-3 py-1.5 text-sm">
                    Add Local Boost ($99 + $79/mo)
                  </button>
                </form>
              ) : (
                <form action={checkoutClientAction}>
                  <input type="hidden" name="clientId" value={client.id} />
                  <input type="hidden" name="includeBoost" value="on" />
                  <button className="rounded-full border border-line px-3 py-1.5 text-sm">
                    Checkout with Local Boost
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <form action={setSiteStatusAction} className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <input type="hidden" name="clientId" value={client.id} />
          <span>Pause / offline toggle:</span>
          {(["live", "paused", "offline", "taken_down"] as const).map((status) => (
            <button
              key={status}
              name="siteStatus"
              value={status}
              className={`rounded-full px-3 py-1.5 ${
                client.siteStatus === status
                  ? "bg-ink text-white"
                  : "border border-line"
              }`}
            >
              {status}
            </button>
          ))}
        </form>

        <form action={saveClientAction} className="mt-8 grid gap-3 rounded-2xl border border-line bg-paper p-5">
          <input type="hidden" name="clientId" value={client.id} />
          <h2 className="font-display text-xl">Client details</h2>
          <label className="text-sm">
            Contact
            <input name="contactName" defaultValue={client.contactName} className={field} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Email
              <input name="email" defaultValue={client.email} className={field} />
            </label>
            <label className="text-sm">
              Phone
              <input name="phone" defaultValue={client.phone} className={field} />
            </label>
          </div>
          <label className="text-sm">
            Address
            <input name="address" defaultValue={client.address} className={field} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              City
              <input name="city" defaultValue={client.city} className={field} />
            </label>
            <label className="text-sm">
              Hours
              <input name="hours" defaultValue={client.hours} className={field} />
            </label>
          </div>
          <label className="text-sm">
            Tagline
            <input name="tagline" defaultValue={client.tagline} className={field} />
          </label>
          <label className="text-sm">
            About
            <textarea name="about" rows={4} defaultValue={client.about} className={field} />
          </label>
          <label className="text-sm">
            Custom domain
            <input
              name="customDomain"
              defaultValue={client.customDomain || ""}
              placeholder="www.theirshop.com"
              className={field}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Stripe customer ID
              <input
                name="stripeCustomerId"
                defaultValue={client.stripeCustomerId || ""}
                className={field}
              />
            </label>
            <label className="text-sm">
              Stripe subscription ID
              <input
                name="stripeSubscriptionId"
                defaultValue={client.stripeSubscriptionId || ""}
                className={field}
              />
            </label>
            <label className="text-sm">
              Boost subscription ID
              <input
                name="stripeBoostSubscriptionId"
                defaultValue={client.stripeBoostSubscriptionId || ""}
                className={field}
              />
            </label>
          </div>
          <button className="justify-self-start rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white">
            Save
          </button>
        </form>
      </div>

      <div className="grid gap-6">
        <section className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-display text-xl">This month’s edits</h2>
          <p className="mt-2 text-sm text-ink-soft">
            {usage.requests} of {PRICING.includedEditRequests} requests · {usage.minutes} of{" "}
            {PRICING.includedEditMinutes} minutes.{" "}
            {usage.overage
              ? "Included care is used — extra work is billed separately."
              : `${usage.remainingRequests} requests / ${usage.remainingMinutes} minutes remaining.`}
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {thisMonthEdits.length === 0 && (
              <li className="text-ink-soft">No edit requests this month.</li>
            )}
            {thisMonthEdits.map((row) => (
              <li key={row.id} className="rounded-lg border border-line p-3">
                <p>{row.body}</p>
                <p className="mt-1 text-xs text-ink-soft">
                  {row.minutes} min · {row.status}
                </p>
                {row.status === "open" && (
                  <form action={finishEditRequestAction} className="mt-2">
                    <input type="hidden" name="clientId" value={client.id} />
                    <input type="hidden" name="editId" value={row.id} />
                    <button className="text-clay">Mark done</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
          <form action={addEditRequestAction} className="mt-4 grid gap-2">
            <input type="hidden" name="clientId" value={client.id} />
            <textarea
              name="body"
              required
              placeholder="Hours change, swap a photo…"
              className={field}
            />
            <input name="minutes" type="number" min={1} defaultValue={15} className={field} />
            <button className="justify-self-start rounded-full border border-line px-3 py-1.5 text-sm">
              Log edit request
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-display text-xl">Notes</h2>
          <form action={addNoteAction} className="mt-3 grid gap-2">
            <input type="hidden" name="clientId" value={client.id} />
            <textarea name="body" required placeholder="Monthly note, call log…" className={field} />
            <button className="justify-self-start rounded-full border border-line px-3 py-1.5 text-sm">
              Add note
            </button>
          </form>
          <ul className="mt-4 space-y-3 text-sm">
            {client.notes.map((note) => (
              <li key={note.id}>
                <p>{note.body}</p>
                <p className="text-xs text-ink-soft">{fmt(note.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-display text-xl">Contact form messages</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {messages.length === 0 && (
              <li className="text-ink-soft">None yet.</li>
            )}
            {messages.map((msg) => (
              <li key={msg.id}>
                <p className="font-semibold">
                  {msg.name} · {msg.email}
                </p>
                <p>{msg.message}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
