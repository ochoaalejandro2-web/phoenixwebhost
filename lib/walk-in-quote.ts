import type { AdsTier } from "./ads.ts";
import { PRICING } from "./config.ts";
import type { WalkInTypeId } from "./walk-in-preview.ts";

export type WalkInQuoteFlags = {
  ads: AdsTier;
  book: boolean;
  missed: boolean;
  reviews: boolean;
  voice: boolean;
  email: boolean;
  domain: boolean;
  boost?: boolean;
  ordering: boolean;
  extraPage: boolean;
  photos: boolean;
  spanish: boolean;
};

export type QuoteLine = {
  id: string;
  setupCents?: number;
  setupMinCents?: number;
  setupMaxCents?: number;
  monthlyCents?: number;
  yearlyCents?: number;
  quoted?: boolean;
};

export function emptyWalkInFlags(): WalkInQuoteFlags {
  return {
    ads: "none",
    book: false,
    missed: false,
    reviews: false,
    voice: false,
    email: false,
    domain: false,
    ordering: false,
    extraPage: false,
    photos: false,
    spanish: false,
  };
}

export function formatUsd(cents: number) {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatUsdRange(minCents: number, maxCents: number) {
  if (minCents === maxCents) return formatUsd(minCents);
  return `${formatUsd(minCents)}–${formatUsd(maxCents)}`;
}

export function walkInQuote(flags: WalkInQuoteFlags) {
  const lines: QuoteLine[] = [
    {
      id: "base",
      setupCents: PRICING.setupCents,
      monthlyCents: PRICING.monthlyCents,
    },
  ];

  if (flags.ads === "boost") {
    lines.push({
      id: "boost",
      setupCents: PRICING.boostSetupCents,
      monthlyCents: PRICING.boostMonthlyCents,
    });
  } else if (flags.ads === "traffic") {
    lines.push({ id: "traffic", monthlyCents: PRICING.trafficMonthlyCents });
  } else if (flags.ads === "loud") {
    lines.push({ id: "loud", monthlyCents: PRICING.loudMonthlyCents });
  }

  if (flags.book) {
    lines.push({
      id: "book",
      setupCents: PRICING.bookSetupCents,
      monthlyCents: PRICING.bookMonthlyCents,
    });
  }
  if (flags.missed) {
    lines.push({
      id: "missed",
      setupCents: PRICING.missedSetupCents,
      monthlyCents: PRICING.missedMonthlyCents,
    });
  }
  if (flags.reviews) {
    lines.push({ id: "reviews", monthlyCents: PRICING.reviewMonthlyCents });
  }
  if (flags.voice) {
    lines.push({
      id: "voice",
      setupCents: PRICING.voiceSetupCents,
      monthlyCents: PRICING.voiceMonthlyCents,
    });
  }
  if (flags.email) {
    lines.push({
      id: "email",
      setupCents: PRICING.emailSetupCents,
      monthlyCents: PRICING.emailMonthlyCents,
    });
  }
  if (flags.domain) {
    lines.push({ id: "domain", yearlyCents: PRICING.domainYearlyCents });
  }
  if (flags.ordering) {
    lines.push({
      id: "ordering",
      setupMinCents: PRICING.orderSetupMinCents,
      setupMaxCents: PRICING.orderSetupMaxCents,
      monthlyCents: PRICING.orderMonthlyCents,
    });
  }
  if (flags.extraPage) lines.push({ id: "page", quoted: true });
  if (flags.photos) lines.push({ id: "photos", quoted: true });
  if (flags.spanish) lines.push({ id: "spanish", quoted: true });

  let setupMin = 0;
  let setupMax = 0;
  let monthly = 0;
  let yearly = 0;
  const quoted = lines.filter((line) => line.quoted).map((line) => line.id);

  for (const line of lines) {
    if (line.quoted) continue;
    if (line.setupMinCents != null && line.setupMaxCents != null) {
      setupMin += line.setupMinCents;
      setupMax += line.setupMaxCents;
    } else if (line.setupCents) {
      setupMin += line.setupCents;
      setupMax += line.setupCents;
    }
    monthly += line.monthlyCents || 0;
    yearly += line.yearlyCents || 0;
  }

  return {
    lines,
    setupMinCents: setupMin,
    setupMaxCents: setupMax,
    monthlyCents: monthly,
    yearlyCents: yearly,
    firstPayMinCents: setupMin + monthly,
    firstPayMaxCents: setupMax + monthly,
    quoted,
    setupLabel: formatUsdRange(setupMin, setupMax),
    monthlyLabel: formatUsd(monthly),
    yearlyLabel: yearly ? formatUsd(yearly) : "",
    firstPayLabel: formatUsdRange(setupMin + monthly, setupMax + monthly),
  };
}

export function walkInShowsOrdering(type: WalkInTypeId) {
  return type === "restaurant";
}

export function selectedExtraPicks(flags: WalkInQuoteFlags) {
  const extras: string[] = [];
  if (flags.domain) extras.push("domain");
  if (flags.email) extras.push("email");
  if (flags.book) extras.push("book");
  if (flags.missed) extras.push("missed");
  if (flags.reviews) extras.push("reviews");
  if (flags.voice) extras.push("voice");
  return extras;
}

export function selectedQuotedPicks(flags: WalkInQuoteFlags) {
  const quoted: Array<"ordering" | "page" | "photos" | "spanish"> = [];
  if (flags.ordering) quoted.push("ordering");
  if (flags.extraPage) quoted.push("page");
  if (flags.photos) quoted.push("photos");
  if (flags.spanish) quoted.push("spanish");
  return quoted;
}
