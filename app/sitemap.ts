import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { COMPANY } from "@/lib/config";
import {
  isPlatformHost,
  normalizeHost,
  wwwHost,
} from "@/lib/custom-domain";
import { getClientByDomain } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = normalizeHost((await headers()).get("host") || "");
  if (host && !isPlatformHost(host, COMPANY.domain)) {
    const client = await getClientByDomain(host);
    if (client) {
      const canonical = wwwHost(client.customDomain || host);
      return [
        { url: `https://${canonical}/`, lastModified: new Date() },
      ];
    }
  }
  return [
    { url: "https://phoenixwebhost.com/", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/es", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/preview", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/es/preview", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/see-your-site", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/es/see-your-site", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/request", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/es/request", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/reviews", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/es/reviews", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/affiliates", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/es/affiliates", lastModified: new Date() },
  ];
}
