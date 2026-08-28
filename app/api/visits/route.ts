import { NextResponse } from "next/server";
import { isLikelyBot, recordVisit } from "@/lib/visits";

export async function POST(request: Request) {
  const agent = request.headers.get("user-agent") || "";
  if (isLikelyBot(agent)) {
    return new NextResponse(null, { status: 204 });
  }
  try {
    await recordVisit();
  } catch {
    /* Admin still loads; a missed increment is better than a noisy beacon. */
  }
  return new NextResponse(null, { status: 204 });
}
