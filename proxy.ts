import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COMPANY } from "@/lib/config";
import {
  clientHostDecision,
  isPlatformHost,
  normalizeHost,
  subdomainSlug,
} from "@/lib/custom-domain";
import { getClientByDomain, getClientBySlug } from "@/lib/store";

export async function proxy(request: NextRequest) {
  const host = normalizeHost(request.headers.get("host") || "");
  const path = request.nextUrl.pathname;

  if (path.startsWith("/_next") || path.startsWith("/api")) {
    return NextResponse.next();
  }

  if (isPlatformHost(host, COMPANY.domain)) {
    return NextResponse.next();
  }

  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || COMPANY.domain).toLowerCase();
  let slug = subdomainSlug(host, root);
  let customDomain: string | null = null;
  let viaCustomDomain = false;

  if (slug) {
    const client = await getClientBySlug(slug);
    slug = client?.slug ?? slug;
  } else {
    const client = await getClientByDomain(host);
    slug = client?.slug ?? null;
    customDomain = client?.customDomain ?? null;
    viaCustomDomain = Boolean(client);
  }

  if (!slug) return NextResponse.next();

  const decision = clientHostDecision({
    host,
    pathname: path,
    search: request.nextUrl.search,
    protocol: request.nextUrl.protocol,
    slug,
    customDomain,
    viaCustomDomain,
  });

  if (decision.type === "next") return NextResponse.next();

  if (decision.type === "redirect") {
    return NextResponse.redirect(decision.url, 301);
  }

  const url = request.nextUrl.clone();
  url.pathname = decision.pathname;
  url.search = decision.search;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
    "/robots.txt",
    "/sitemap.xml",
  ],
};
