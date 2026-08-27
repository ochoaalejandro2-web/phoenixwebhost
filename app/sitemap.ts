import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://phoenixwebhost.com/", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/es", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/request", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/es/request", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/reviews", lastModified: new Date() },
    { url: "https://phoenixwebhost.com/es/reviews", lastModified: new Date() },
  ];
}
