import { NextResponse } from "next/server";
import { stripeBoostConfigured, stripeConfigured } from "@/lib/config";
import { stripeModeLabel } from "@/lib/stripe";
import { storageMode } from "@/lib/store";

export function GET() {
  return NextResponse.json({
    ok: true,
    company: "Phoenixwebhost Inc.",
    stripe: stripeModeLabel(),
    stripeReady: stripeConfigured(),
    boostReady: stripeBoostConfigured(),
    storage: storageMode(),
  });
}
