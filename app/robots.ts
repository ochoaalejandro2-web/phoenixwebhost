import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { COMPANY } from "@/lib/config";
import {
  isPlatformHost,
  normalizeHost,
  wwwHost,
} from "@/lib/custom-domain";
import { getClientByDomain } from "@/lib/store";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = normalizeHost((await headers()).get("host") || "");
  if (host && !isPlatformHost(host, COMPANY.domain)) {
    const client = await getClientByDomain(host);
    if (client) {
      const canonical = wwwHost(client.customDomain || host);
      return {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin", "/login", "/api", "/portal", "/demo"],
        },
        sitemap: `https://${canonical}/sitemap.xml`,
      };
    }
  }
  return {
        rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/api", "/demo"] },
    sitemap: "https://phoenixwebhost.com/sitemap.xml",
  };
}
