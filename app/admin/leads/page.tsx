import { createClientFromLeadAction } from "@/app/admin/actions";
import { listLeads } from "@/lib/store";

export default async function LeadsPage() {
  const leads = await listLeads();
  return (
    <div>
      <h1 className="font-display text-3xl">Site requests</h1>
      <p className="mt-2 text-ink-soft">
        Public form submissions. Generate a client site from a request when you
        are ready to build.
      </p>
      <ul className="mt-6 space-y-4">
        {leads.length === 0 && (
          <li className="text-ink-soft">No requests yet.</li>
        )}
        {leads.map((lead) => (
          <li key={lead.id} className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">{lead.businessName}</p>
                <p className="text-sm text-ink-soft">
                  {lead.name} · {lead.email} · {lead.phone} · {lead.city} ·{" "}
                  {lead.locale.toUpperCase()}
                </p>
                <p className="mt-3 text-sm">{lead.message}</p>
              </div>
              <form action={createClientFromLeadAction}>
                <input type="hidden" name="leadId" value={lead.id} />
                <button className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white">
                  Generate site
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
