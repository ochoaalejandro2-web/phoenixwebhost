import { NextResponse } from "next/server";
import {
  stripeBookConfigured,
  stripeBoostConfigured,
  stripeConfigured,
  stripeEmailConfigured,
  stripeLoudConfigured,
  stripeMissedCallConfigured,
  stripeReviewTextsConfigured,
  stripeTrafficConfigured,
  stripeVoiceConfigured,
} from "@/lib/config";
import { stripeModeLabel } from "@/lib/stripe";
import { ensureLiveExtraPrices } from "@/lib/stripe-extra-prices";
import { storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureLiveExtraPrices();
  return NextResponse.json({
    ok: true,
    company: "Phoenixwebhost Inc.",
    stripe: stripeModeLabel(),
    stripeReady: stripeConfigured(),
    boostReady: stripeBoostConfigured(),
    trafficReady: stripeTrafficConfigured(),
    loudReady: stripeLoudConfigured(),
    emailReady: stripeEmailConfigured(),
    bookReady: stripeBookConfigured(),
    missedReady: stripeMissedCallConfigured(),
    reviewsReady: stripeReviewTextsConfigured(),
    voiceReady: stripeVoiceConfigured(),
    oidcReady: Boolean(process.env.VERCEL_OIDC_TOKEN),
    storage: storageMode(),
  });
}
