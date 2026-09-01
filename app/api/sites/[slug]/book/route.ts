import { NextResponse } from "next/server";
import { bookJobMessage, parseBookJob } from "@/lib/book-job";
import { buildClientFromLead, isPreviewClient } from "@/lib/demo";
import { notifyBookingLead } from "@/lib/notify";
import { isAlwaysLiveWalkInDemo } from "@/lib/public-demos";
import { clientShowsBookJob } from "@/lib/site-addons";
import { addContactMessage, getClientBySlug, getLead } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }
  let client = await getClientBySlug(slug);
  const leadId = String(body.leadId || "").trim();
  if (!client && leadId) {
    const lead = await getLead(leadId);
    if (lead) client = buildClientFromLead(lead, [], { preview: true });
  }
  if (!client && slug.startsWith("demo-")) {
    const fromSlug = slug.slice("demo-".length);
    const lead = await getLead(fromSlug);
    if (lead) client = buildClientFromLead(lead, [], { preview: true });
  }
  if (!client) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!clientShowsBookJob(client)) {
    return NextResponse.json({ error: "not offered" }, { status: 403 });
  }
  if (
    client.siteStatus === "taken_down" &&
    !isAlwaysLiveWalkInDemo(client.slug)
  ) {
    return NextResponse.json({ error: "site offline" }, { status: 403 });
  }

  const job = parseBookJob({
    name: String(body.name || ""),
    phone: String(body.phone || ""),
    day: String(body.day || ""),
    note: String(body.note || ""),
  });
  if (!job) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }

  const message = await addContactMessage({
    id: `msg_${crypto.randomUUID()}`,
    clientId: isPreviewClient(client) ? client.id : client.id,
    name: job.name,
    email: "",
    phone: job.phone,
    message: bookJobMessage(job),
    createdAt: new Date().toISOString(),
    source: "booking",
  });
  await notifyBookingLead(client, message);
  return NextResponse.json({ ok: true });
}
