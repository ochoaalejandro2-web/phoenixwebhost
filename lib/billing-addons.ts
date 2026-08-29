import type { Client } from "./types";

export function applyLocalBoostPurchased(
  client: Client,
  at = new Date().toISOString(),
): Client {
  if (client.localBoost) return client;
  return {
    ...client,
    localBoost: true,
    notes: [
      {
        id: `note_${crypto.randomUUID()}`,
        body: "Local Boost purchased: $99 Google Business Profile setup and a small local ad for their own site, plus $79/month listing and ad care.",
        createdAt: at,
      },
      ...client.notes,
    ],
  };
}

export function applyTrafficPurchased(
  client: Client,
  at = new Date().toISOString(),
): Client {
  if (client.trafficAds) return client;
  return {
    ...client,
    trafficAds: true,
    notes: [
      {
        id: `note_${crypto.randomUUID()}`,
        body: "Traffic purchased: $199/month managed ads package. Bigger Google ad than Local Boost so more people can see the business. Not a ranking promise.",
        createdAt: at,
      },
      ...client.notes,
    ],
  };
}

export function applyLoudPurchased(
  client: Client,
  at = new Date().toISOString(),
): Client {
  if (client.loudAds) return client;
  return {
    ...client,
    loudAds: true,
    notes: [
      {
        id: `note_${crypto.randomUUID()}`,
        body: "Loud purchased: $349/month managed ads package. The aggressive ads level — louder ads so more people see the business. Not a ranking promise.",
        createdAt: at,
      },
      ...client.notes,
    ],
  };
}

export function applyBusinessEmailPurchased(
  client: Client,
  at = new Date().toISOString(),
): Client {
  if (client.businessEmail) return client;
  return {
    ...client,
    businessEmail: true,
    notes: [
      {
        id: `note_${crypto.randomUUID()}`,
        body: "Business Email purchased: $49 setup for one professional inbox such as info@their domain, plus $19/month to keep that inbox working. Not magic, not unlimited mailboxes.",
        createdAt: at,
      },
      ...client.notes,
    ],
  };
}
