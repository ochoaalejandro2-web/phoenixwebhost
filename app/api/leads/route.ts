import { NextResponse } from "next/server";
import {
  stripeBoostConfigured,
  stripeConfigured,
  stripeEmailConfigured,
  stripeLoudConfigured,
  stripeTrafficConfigured,
} from "@/lib/config";
import { normalizeAdsFlags } from "@/lib/ads";
import { demoPath, emptyDemoTweaks, parseTemplateId } from "@/lib/demo";
import { notifyCustomerDemo, notifyNewLead } from "@/lib/notify";
import { addLead } from "@/lib/store";
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
    template?: string;
    wantsLocalBoost?: boolean;
    wantsTraffic?: boolean;
    wantsLoud?: boolean;
    wantsBusinessEmail?: boolean;
  };
  if (!body.name || !body.businessName || !body.email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const template = parseTemplateId(body.template);
  if (!template) {
    return NextResponse.json(
      { error: "Choose a starting template." },
      { status: 400 },
    );
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
    template,
    ...normalizeAdsFlags({
      wantsLocalBoost: Boolean(body.wantsLocalBoost),
      wantsTraffic: Boolean(body.wantsTraffic),
      wantsLoud: Boolean(body.wantsLoud),
    }),
    wantsBusinessEmail: Boolean(body.wantsBusinessEmail),
    purchased: false,
    clientId: null,
    demo: emptyDemoTweaks(),
    createdAt: new Date().toISOString(),
  });
  await Promise.allSettled([notifyNewLead(lead), notifyCustomerDemo(lead)]);
  return NextResponse.json({
    id: lead.id,
    demoUrl: demoPath(lead.id),
    stripeReady: stripeConfigured(),
    boostReady: stripeBoostConfigured(),
    trafficReady: stripeTrafficConfigured(),
    loudReady: stripeLoudConfigured(),
    emailReady: stripeEmailConfigured(),
  });
}
