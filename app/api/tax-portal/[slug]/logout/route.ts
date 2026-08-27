import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { parseSiteLocale, SITE_LANG_QUERY, siteLangCookieName } from "@/lib/site-locale";
import { clearTaxSessionCookie } from "@/lib/tax-auth";
import { portalPath } from "@/lib/tax-office";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const locale = parseSiteLocale(
    (await cookies()).get(siteLangCookieName(slug))?.value,
  );
  await clearTaxSessionCookie();
  const url = new URL(portalPath(slug, "/login"), request.url);
  if (locale) url.searchParams.set(SITE_LANG_QUERY, locale);
  return NextResponse.redirect(url, 303);
}
