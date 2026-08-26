import Link from "next/link";
import { listClients } from "@/lib/store";

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function ClientsPage() {
  const clients = await listClients();
  return (
    <div>
      <div className="flex items-end justify-between">
        <h1 className="font-display text-3xl">Clients</h1>
        <Link
          href="/admin/clients/new"
          className="rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white"
        >
          New client
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
        {clients.map((client) => (
          <li key={client.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div>
              <Link href={`/admin/clients/${client.id}`} className="font-semibold">
                {client.businessName}
              </Link>
              <p className="text-sm text-ink-soft">
                {client.slug}.phoenixwebhost.com · {client.siteStatus} · {client.paymentStatus}
              </p>
            </div>
            <p className="text-sm text-ink-soft">
              Paid {fmt(client.lastPaymentAt)} · Next {fmt(client.nextInvoiceAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
