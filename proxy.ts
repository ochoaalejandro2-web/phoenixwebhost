import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COMPANY } from "@/lib/config";
import {
  CLOSER_COOKIE,
  CLOSER_QUERY,
  closerCookieOptions,
  closerHomePath,
  parseCloserFromPath,
  sanitizeCloserCode,
} from "@/lib/closers";
import {
  clientHostDecision,
  isPlatformHost,
  normalizeHost,
  subdomainSlug,
} from "@/lib/custom-domain";
import {
  resolveKnownCustomDomain,
  resolveWalkInHostSlug,
} from "@/lib/walk-in-hosts";

export async function proxy(request: NextRequest) {
  const host = normalizeHost(request.headers.get("host") || "");
  const path = request.nextUrl.pathname;

  if (path.startsWith("/_next") || path.startsWith("/api")) {
    return NextResponse.next();
  }

  if (isPlatformHost(host, COMPANY.domain)) {
    const pathCloser = parseCloserFromPath(path);
    const queryCloser = sanitizeCloserCode(
      request.nextUrl.searchParams.get(CLOSER_QUERY),
    );
    const code = pathCloser?.code || queryCloser;
    if (pathCloser) {
      const dest = request.nextUrl.clone();
      dest.pathname = closerHomePath(pathCloser.locale);
      dest.search = "";
      const response = NextResponse.redirect(dest);
      response.cookies.set(
        CLOSER_COOKIE,
        pathCloser.code,
        closerCookieOptions(request.nextUrl.protocol === "https:"),
      );
      return response;
    }
    if (code) {
      const response = NextResponse.next();
      response.cookies.set(
        CLOSER_COOKIE,
        code,
        closerCookieOptions(request.nextUrl.protocol === "https:"),
      );
      return response;
    }
    return NextResponse.next();
  }

  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || COMPANY.domain).toLowerCase();
  let slug = subdomainSlug(host, root);
  let customDomain: string | null = null;
  let viaCustomDomain = false;

  if (slug) {
    const walkIn = resolveWalkInHostSlug(slug);
    if (walkIn) {
      slug = walkIn;
    } else {
      try {
        const { getClientBySlug } = await import("@/lib/store");
        const client = await getClientBySlug(slug);
        slug = client?.slug ?? slug;
      } catch {
        // Keep the host slug. The /s/[slug] page can 404; do not 500 the proxy.
      }
    }
  } else {
    const known = resolveKnownCustomDomain(host);
    if (known) {
      slug = known.slug;
      customDomain = known.customDomain;
      viaCustomDomain = true;
    } else {
      try {
        const { getClientByDomain } = await import("@/lib/store");
        const client = await getClientByDomain(host);
        slug = client?.slug ?? null;
        customDomain = client?.customDomain ?? null;
        viaCustomDomain = Boolean(client);
      } catch {
        return NextResponse.next();
      }
    }
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
