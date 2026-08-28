import { NextResponse } from "next/server";
import { createCheckoutForClient, resolveCheckoutClient } from "@/lib/checkout";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      leadId?: string;
      clientId?: string;
      includeBoost?: boolean;
      includeEmail?: boolean;
      boostOnly?: boolean;
      emailOnly?: boolean;
    };
    const client = await resolveCheckoutClient(body);
    if (!client) {
      return NextResponse.json({ error: "No client or lead found." }, { status: 404 });
    }
    const url = await createCheckoutForClient(client, {
      includeBoost: Boolean(body.includeBoost),
      includeEmail: Boolean(body.includeEmail),
      boostOnly: Boolean(body.boostOnly),
      emailOnly: Boolean(body.emailOnly),
      leadId: body.leadId,
    });
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
