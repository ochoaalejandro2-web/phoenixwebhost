import { createClientFromLeadAction } from "@/app/admin/actions";
import { demoPath, templateLabel } from "@/lib/demo";
import { STUDIO_INBOX } from "@/lib/site-addons";
import { listClients, listContactMessages, listLeads } from "@/lib/store";
import type { InboxSource } from "@/lib/types";

function sourceLabel(source?: InboxSource) {
  if (source === "chat") return "Chat";
  if (source === "booking") return "Book a job";
  return "Contact form";
}

export default async function LeadsPage() {
  const [leads, clients, inbox] = await Promise.all([
    listLeads(),
    listClients(),
    listContactMessages(),
  ]);
  const names = new Map(clients.map((row) => [row.id, row.businessName]));
  names.set(STUDIO_INBOX, "Phoenixwebhost studio");

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
                  {lead.wantsBookAJob ? " · Wants Book a job" : ""}
                  {lead.wantsMissedCall ? " · Wants missed-call text-back" : ""}
                  {lead.wantsReviewTexts ? " · Wants review texts" : ""}
                  {lead.wantsVoice ? " · Wants voice receptionist" : ""}
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

      <h2 className="mt-12 font-display text-3xl">Chat and booking</h2>
      <p className="mt-2 text-ink-soft">
        Messages from the included receptionist and Book a job forms. Site
        owners get the same lead by email. Newest first.
      </p>
      <ul className="mt-6 space-y-4">
        {inbox.length === 0 && (
          <li className="text-ink-soft">No chat or booking leads yet.</li>
        )}
        {inbox.map((msg) => (
          <li key={msg.id} className="rounded-2xl border border-line bg-paper p-5">
            <p className="font-display text-xl">
              {names.get(msg.clientId) ||
                (msg.clientId.startsWith("demo_")
                  ? "Demo preview"
                  : msg.clientId)}
            </p>
            <p className="text-sm text-ink-soft">
              {sourceLabel(msg.source)} · {msg.name || "Visitor"}
              {msg.phone ? ` · ${msg.phone}` : ""}
              {msg.email ? ` · ${msg.email}` : ""}
              {msg.notifiedAt ? " · emailed" : ""}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm">{msg.message}</p>
            <p className="mt-2 text-xs text-ink-soft">
              {new Date(msg.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
