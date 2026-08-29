import { createClientFromLeadAction } from "@/app/admin/actions";
import { demoPath, templateLabel } from "@/lib/demo";
import { listLeads } from "@/lib/store";

export default async function LeadsPage() {
  const leads = await listLeads();
  return (
    <div>
      <h1 className="font-display text-3xl">Demo requests</h1>
      <p className="mt-2 text-ink-soft">
        Public Request a Demo submissions. Each row has the preview URL and
        whether they purchased. If they did not pay, call the next morning.
      </p>
      <ul className="mt-6 space-y-4">
        {leads.length === 0 && (
          <li className="text-ink-soft">No demos yet.</li>
        )}
        {leads.map((lead) => (
          <li
            id={lead.id}
            key={lead.id}
            className="scroll-mt-6 rounded-2xl border border-line bg-paper p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">{lead.businessName}</p>
                <p className="text-sm text-ink-soft">
                  {lead.name} · {lead.email} · {lead.phone || "no phone"} ·{" "}
                  {lead.city} · {lead.locale.toUpperCase()} ·{" "}
                  {templateLabel(lead.template, "en")}
                  {lead.wantsLocalBoost ? " · Wants Local Boost" : ""}
                  {lead.wantsTraffic ? " · Wants Traffic" : ""}
                  {lead.wantsLoud ? " · Wants Loud" : ""}
                  {lead.wantsBusinessEmail ? " · Wants Business Email" : ""}
                </p>
                <p className="mt-2 text-sm">
                  Demo:{" "}
                  <a
                    className="text-clay"
                    href={demoPath(lead.id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {demoPath(lead.id)}
                  </a>
                  {" · "}
                  {lead.purchased ? "Purchased" : "Not purchased"}
                </p>
                <p className="mt-3 text-sm">{lead.message || "No note"}</p>
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
