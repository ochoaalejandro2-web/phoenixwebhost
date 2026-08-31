import { createCloserAction } from "@/app/admin/affiliates/actions";
import { closerSellPath } from "@/lib/closers";
import { publicSiteUrl } from "@/lib/config";
import { demoPath } from "@/lib/demo";
import { listClients, listClosers, listLeads } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AffiliatesAdminPage() {
  const [closers, leads, clients] = await Promise.all([
    listClosers(),
    listLeads(),
    listClients(),
  ]);
  const root = publicSiteUrl().replace(/\/$/, "");

  return (
    <div>
      <h1 className="font-display text-3xl">Affiliates / closers</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Unique sell links for people who send Phoenixwebhost customers. They
        get the $200 launch only after Stripe succeeds. Alex keeps $69/month
        and add-ons. No automatic Stripe payout.
      </p>

      <form
        action={createCloserAction}
        className="mt-8 grid gap-3 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-3"
      >
        <label className="text-sm">
          Name
          <input
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm">
          Email (optional)
          <input
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm">
          Code (optional)
          <input
            name="code"
            placeholder="jose"
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
        <div className="sm:col-span-3">
          <button className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white">
            Add closer
          </button>
        </div>
      </form>

      <ul className="mt-8 space-y-4">
        {closers.length === 0 ? (
          <li className="text-ink-soft">No closers yet.</li>
        ) : (
          closers.map((closer) => {
            const demos = leads.filter((lead) => lead.closerCode === closer.code);
            const paid = clients.filter(
              (client) =>
                client.closerCode === closer.code &&
                client.paymentStatus === "paid",
            );
            const sell = `${root}${closerSellPath(closer.code)}`;
            return (
              <li
                key={closer.id}
                className="rounded-2xl border border-line bg-paper p-5"
              >
                <p className="font-display text-xl">{closer.name}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Code {closer.code}
                  {closer.email ? ` · ${closer.email}` : ""}
                </p>
                <p className="mt-2 text-sm">
                  Sell link:{" "}
                  <a className="text-clay" href={sell} target="_blank" rel="noreferrer">
                    {sell}
                  </a>
                  {" · "}
                  or {root}/?ref={closer.code}
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  {demos.length} demo request{demos.length === 1 ? "" : "s"} ·{" "}
                  {paid.length} paid checkout{paid.length === 1 ? "" : "s"} ·
                  pay ${paid.length * 200} launch if Stripe already succeeded
                </p>
                {demos.length ? (
                  <ul className="mt-3 space-y-1 text-sm">
                    {demos.map((lead) => (
                      <li key={lead.id}>
                        Demo: {lead.businessName} · {lead.name} ·{" "}
                        {lead.purchased ? "purchased" : "not purchased"} ·{" "}
                        <a className="text-clay" href={demoPath(lead.id)}>
                          {demoPath(lead.id)}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {paid.length ? (
                  <ul className="mt-3 space-y-1 text-sm">
                    {paid.map((client) => (
                      <li key={client.id}>
                        Paid: {client.businessName} · $200 launch due to{" "}
                        {closer.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
