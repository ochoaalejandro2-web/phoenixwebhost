import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COMPANY } from "@/lib/config";
import { getClientByDomain } from "@/lib/store";

const ROOTS = new Set([
  COMPANY.domain,
  `www.${COMPANY.domain}`,
  "localhost",
  "127.0.0.1",
]);

export async function proxy(request: NextRequest) {
  const hostHeader = request.headers.get("host") || "";
  const host = hostHeader.split(":")[0].toLowerCase();
  const path = request.nextUrl.pathname;

  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/admin") ||
    path.startsWith("/login") ||
    path.startsWith("/s/")
  ) {
    return NextResponse.next();
  }

  if (ROOTS.has(host) || host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  let slug: string | null = null;
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || COMPANY.domain).toLowerCase();
  if (host.endsWith(`.${root}`)) {
    slug = host.slice(0, -(root.length + 1));
  } else if (host.endsWith(".localhost")) {
    slug = host.replace(/\.localhost$/, "");
  } else {
    const client = await getClientByDomain(host);
    slug = client?.slug ?? null;
  }

  if (!slug || slug === "www") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = path === "/" ? `/s/${slug}` : `/s/${slug}${path}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
