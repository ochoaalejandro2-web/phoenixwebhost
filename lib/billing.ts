import { PRICING } from "./config.ts";
import { isAlwaysLiveWalkInDemo } from "./public-demos.ts";
import type { Client } from "./types.ts";

export {
  applyBusinessEmailPurchased,
  applyLocalBoostPurchased,
  applyLoudPurchased,
  applyTrafficPurchased,
} from "./billing-addons.ts";

function addDays(iso: string | null, days: number) {
  const base = iso ? new Date(iso) : new Date();
  return new Date(base.getTime() + days * 86_400_000).toISOString();
}

export function applyPaymentSucceeded(
  client: Client,
  paidAt = new Date().toISOString(),
  nextInvoiceAt?: string | null,
): Client {
  return {
    ...client,
    paymentStatus: "paid",
    lastPaymentAt: paidAt,
    nextInvoiceAt: nextInvoiceAt ?? addDays(paidAt, 30),
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    siteStatus:
      client.siteStatus === "offline" || client.siteStatus === "taken_down"
        ? "live"
        : client.siteStatus,
  };
}

export function applyPaymentFailed(
  client: Client,
  at = new Date().toISOString(),
): Client {
  return {
    ...client,
    paymentStatus: "overdue",
    overdueSince: client.overdueSince ?? at,
    reminderSentAt: client.reminderSentAt ?? at,
    notes: [
      {
        id: `note_${crypto.randomUUID()}`,
        body: "Payment failed. Reminder recorded. Site stays live through a short grace period, then shows temporarily offline.",
        createdAt: at,
      },
      ...client.notes,
    ],
  };
}

export function applyUnpaidPolicy(client: Client, now = new Date()): Client {
  if (isAlwaysLiveWalkInDemo(client.slug) || client.sample) {
    return client;
  }
  if (client.paymentStatus === "paid" || client.paymentStatus === "none") {
    return client;
  }
  if (client.siteStatus === "paused") return client;

  const overdueFrom = client.overdueSince
    ? new Date(client.overdueSince)
    : now;
  const graceEnds = new Date(
    overdueFrom.getTime() + PRICING.unpaidGraceDays * 86_400_000,
  );
  const next = { ...client };

  if (!next.reminderSentAt) {
    next.reminderSentAt = now.toISOString();
  }

  if (now >= graceEnds && next.siteStatus === "live") {
    next.siteStatus = "offline";
    next.offlineAt = now.toISOString();
    next.filesKeptUntil =
      next.filesKeptUntil ?? addDays(now.toISOString(), PRICING.filesKeptDays);
    next.notes = [
      {
        id: `note_${crypto.randomUUID()}`,
        body: "Unpaid after reminder. Site set to temporarily offline. Files kept for 30 days.",
        createdAt: now.toISOString(),
      },
      ...next.notes,
    ];
  }

  if (next.siteStatus === "offline" && !next.filesKeptUntil) {
    next.filesKeptUntil = addDays(
      next.offlineAt ?? now.toISOString(),
      PRICING.filesKeptDays,
    );
  }

  if (
    next.filesKeptUntil &&
    now >= new Date(next.filesKeptUntil) &&
    next.siteStatus !== "taken_down"
  ) {
    next.siteStatus = "taken_down";
    next.takenDownAt = now.toISOString();
    next.notes = [
      {
        id: `note_${crypto.randomUUID()}`,
        body: "30-day file hold ended. Site taken down.",
        createdAt: now.toISOString(),
      },
      ...next.notes,
    ];
  }

  return next;
}

export function markReminder(client: Client, at = new Date().toISOString()): Client {
  return {
    ...client,
    reminderSentAt: at,
    notes: [
      {
        id: `note_${crypto.randomUUID()}`,
        body: "Payment reminder sent.",
        createdAt: at,
      },
      ...client.notes,
    ],
  };
}

export function editsThisMonth(client: Client, month: string) {
  const rows = client.editRequests.filter((e) => e.month === month);
  const requests = rows.length;
  const minutes = rows.reduce((sum, row) => sum + row.minutes, 0);
  const remainingRequests = Math.max(0, PRICING.includedEditRequests - requests);
  const remainingMinutes = Math.max(0, PRICING.includedEditMinutes - minutes);
  const overage = requests >= PRICING.includedEditRequests || minutes >= PRICING.includedEditMinutes;
  return { requests, minutes, remainingRequests, remainingMinutes, overage };
}
