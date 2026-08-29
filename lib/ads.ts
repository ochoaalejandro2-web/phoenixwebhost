export type AdsTier = "none" | "boost" | "traffic" | "loud";

export const ADS_TIER_CONFLICT =
  "Pick one ads level: Local Boost, Traffic, or Loud. They cannot be combined.";

export const ADS_ALREADY_ACTIVE =
  "This client already has an ads add-on. Cancel that subscription before switching levels.";

const ADS_FLAGS = ["boost", "traffic", "loud"] as const;

export function parseAdsTier(value: string | undefined | null): AdsTier {
  if (value === "boost" || value === "traffic" || value === "loud") return value;
  return "none";
}

export function adsFlagsFromTier(tier: AdsTier) {
  return {
    wantsLocalBoost: tier === "boost",
    wantsTraffic: tier === "traffic",
    wantsLoud: tier === "loud",
  };
}

export function adsTierFromFlags(input: {
  wantsLocalBoost?: boolean;
  wantsTraffic?: boolean;
  wantsLoud?: boolean;
  localBoost?: boolean;
  trafficAds?: boolean;
  loudAds?: boolean;
}): AdsTier {
  if (input.wantsLoud || input.loudAds) return "loud";
  if (input.wantsTraffic || input.trafficAds) return "traffic";
  if (input.wantsLocalBoost || input.localBoost) return "boost";
  return "none";
}

export function normalizeAdsFlags(input: {
  wantsLocalBoost?: boolean;
  wantsTraffic?: boolean;
  wantsLoud?: boolean;
}) {
  const selected = ADS_FLAGS.filter((tier) => {
    if (tier === "boost") return Boolean(input.wantsLocalBoost);
    if (tier === "traffic") return Boolean(input.wantsTraffic);
    return Boolean(input.wantsLoud);
  });
  if (selected.length > 1) return adsFlagsFromTier("none");
  return adsFlagsFromTier(selected[0] ?? "none");
}

export function countAdsFlags(input: {
  includeBoost?: boolean;
  includeTraffic?: boolean;
  includeLoud?: boolean;
  boostOnly?: boolean;
  trafficOnly?: boolean;
  loudOnly?: boolean;
}) {
  return (
    Number(Boolean(input.boostOnly || input.includeBoost)) +
    Number(Boolean(input.trafficOnly || input.includeTraffic)) +
    Number(Boolean(input.loudOnly || input.includeLoud))
  );
}

export function clientHasAdsTier(client: {
  localBoost?: boolean;
  trafficAds?: boolean;
  loudAds?: boolean;
}) {
  return Boolean(client.localBoost || client.trafficAds || client.loudAds);
}

export function adsTierLabel(tier: AdsTier) {
  if (tier === "boost") return "Local Boost";
  if (tier === "traffic") return "Traffic";
  if (tier === "loud") return "Loud";
  return "—";
}
