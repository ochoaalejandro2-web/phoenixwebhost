import { NextResponse } from "next/server";
import { addLead } from "@/lib/store";
import { stripeConfigured } from "@/lib/config";
import { notifyNewLead } from "@/lib/notify";
import type { Locale } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    businessName?: string;
    email?: string;
    phone?: string;
    city?: string;
    message?: string;
    locale?: Locale;
  };
  if (!body.name || !body.businessName || !body.email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const lead = await addLead({
    id: `lead_${crypto.randomUUID()}`,
    name: String(body.name).trim(),
    businessName: String(body.businessName).trim(),
    email: String(body.email).trim(),
    phone: String(body.phone || "").trim(),
    city: String(body.city || "").trim(),
    message: String(body.message || "").trim(),
    locale: body.locale === "es" ? "es" : "en",
    createdAt: new Date().toISOString(),
  });
  await notifyNewLead(lead);
  return NextResponse.json({ id: lead.id, stripeReady: stripeConfigured() });
}
