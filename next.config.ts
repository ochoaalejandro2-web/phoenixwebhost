import type { NextConfig } from "next";

const WALK_IN_HOST_REWRITES: Array<{ host: string; slug: string }> = [
  { host: "ironwood.phoenixwebhost.com", slug: "ironwood-handyman" },
  { host: "ironwood-handyman.phoenixwebhost.com", slug: "ironwood-handyman" },
  { host: "paloverde.phoenixwebhost.com", slug: "palo-verde-yards" },
  { host: "palo-verde-yards.phoenixwebhost.com", slug: "palo-verde-yards" },
  { host: "desertpeak.phoenixwebhost.com", slug: "desert-peak-roofing" },
  { host: "desert-peak-roofing.phoenixwebhost.com", slug: "desert-peak-roofing" },
  { host: "casa-luna-salon.phoenixwebhost.com", slug: "casa-luna-salon" },
  { host: "mesa-street-kitchen.phoenixwebhost.com", slug: "mesa-street-kitchen" },
];

const nextConfig: NextConfig = {
  transpilePackages: ["pdfjs-dist"],
  async rewrites() {
    return WALK_IN_HOST_REWRITES.flatMap(({ host, slug }) => [
      {
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: `/s/${slug}`,
      },
      {
        source: "/es",
        has: [{ type: "host" as const, value: host }],
        destination: `/s/${slug}?lang=es`,
      },
    ]);
  },
};

export default nextConfig;
