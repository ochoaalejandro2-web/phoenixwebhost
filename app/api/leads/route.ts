import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  stripeBookConfigured,
  stripeBoostConfigured,
  stripeConfigured,
  stripeDomainConfigured,
  stripeEmailConfigured,
  stripeLoudConfigured,
  stripeMissedCallConfigured,
  stripeReviewTextsConfigured,
  stripeTrafficConfigured,
  stripeVoiceConfigured,
} from "@/lib/config";
import { normalizeAdsFlags } from "@/lib/ads";
import { CLOSER_COOKIE, sanitizeCloserCode } from "@/lib/closers";
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
    wantsBookAJob?: boolean;
    wantsMissedCall?: boolean;
    wantsReviewTexts?: boolean;
    wantsVoice?: boolean;
    wantsDomain?: boolean;
    closerCode?: string;
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
  const cookieStore = await cookies();
  const closerCode =
    sanitizeCloserCode(cookieStore.get(CLOSER_COOKIE)?.value) ||
    sanitizeCloserCode(body.closerCode);
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
    wantsBookAJob: Boolean(body.wantsBookAJob),
    wantsMissedCall: Boolean(body.wantsMissedCall),
    wantsReviewTexts: Boolean(body.wantsReviewTexts),
    wantsVoice: Boolean(body.wantsVoice),
    wantsDomain: Boolean(body.wantsDomain),
    closerCode: closerCode || null,
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
    bookReady: stripeBookConfigured(),
    missedReady: stripeMissedCallConfigured(),
    reviewsReady: stripeReviewTextsConfigured(),
    voiceReady: stripeVoiceConfigured(),
    domainReady: stripeDomainConfigured(),
  });
}
