import { NextResponse } from "next/server";
import { createCheckoutForClient, resolveCheckoutClient } from "@/lib/checkout";

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
      bookOnly?: boolean;
      missedOnly?: boolean;
      reviewsOnly?: boolean;
      voiceOnly?: boolean;
    };
    const client = await resolveCheckoutClient(body);
    if (!client) {
      return NextResponse.json({ error: "No client or lead found." }, { status: 404 });
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
      bookOnly: Boolean(body.bookOnly),
      missedOnly: Boolean(body.missedOnly),
      reviewsOnly: Boolean(body.reviewsOnly),
      voiceOnly: Boolean(body.voiceOnly),
      leadId: body.leadId,
    });
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
