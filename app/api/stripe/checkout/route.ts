import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCheckoutForClient, resolveCheckoutClient } from "@/lib/checkout";
import { CLOSER_COOKIE, sanitizeCloserCode } from "@/lib/closers";
import { getLead, updateLead } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      leadId?: string;
      clientId?: string;
      includeBoost?: boolean;
      includeTraffic?: boolean;
      includeLoud?: boolean;
      includeEmail?: boolean;
      boostOnly?: boolean;
      trafficOnly?: boolean;
      loudOnly?: boolean;
      emailOnly?: boolean;
      includeBook?: boolean;
      includeMissedCall?: boolean;
      includeReviews?: boolean;
      includeVoice?: boolean;
      includeDomain?: boolean;
      bookOnly?: boolean;
      missedOnly?: boolean;
      reviewsOnly?: boolean;
      voiceOnly?: boolean;
      domainOnly?: boolean;
    };
    const client = await resolveCheckoutClient(body);
    if (!client) {
      return NextResponse.json({ error: "No client or lead found." }, { status: 404 });
    }
    const cookieStore = await cookies();
    const lead = body.leadId ? await getLead(body.leadId) : null;
    const closerCode =
      sanitizeCloserCode(lead?.closerCode) ||
      sanitizeCloserCode(client.closerCode) ||
      sanitizeCloserCode(cookieStore.get(CLOSER_COOKIE)?.value);
    if (lead && closerCode && lead.closerCode !== closerCode) {
      await updateLead(lead.id, { closerCode });
    }
    const url = await createCheckoutForClient(client, {
      includeBoost: Boolean(body.includeBoost),
      includeTraffic: Boolean(body.includeTraffic),
      includeLoud: Boolean(body.includeLoud),
      includeEmail: Boolean(body.includeEmail),
      boostOnly: Boolean(body.boostOnly),
      trafficOnly: Boolean(body.trafficOnly),
      loudOnly: Boolean(body.loudOnly),
      emailOnly: Boolean(body.emailOnly),
      includeBook: Boolean(body.includeBook),
      includeMissedCall: Boolean(body.includeMissedCall),
      includeReviews: Boolean(body.includeReviews),
      includeVoice: Boolean(body.includeVoice),
      includeDomain: Boolean(body.includeDomain),
      bookOnly: Boolean(body.bookOnly),
      missedOnly: Boolean(body.missedOnly),
      reviewsOnly: Boolean(body.reviewsOnly),
      voiceOnly: Boolean(body.voiceOnly),
      domainOnly: Boolean(body.domainOnly),
      leadId: body.leadId,
      closerCode: closerCode || undefined,
    });
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
