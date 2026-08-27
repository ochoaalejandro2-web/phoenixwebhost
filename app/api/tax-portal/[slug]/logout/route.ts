import { NextResponse } from "next/server";
import { clearTaxSessionCookie } from "@/lib/tax-auth";
import { portalPath } from "@/lib/tax-office";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  await clearTaxSessionCookie();
  const url = new URL(portalPath(slug, "/login"), request.url);
  return NextResponse.redirect(url, 303);
}
