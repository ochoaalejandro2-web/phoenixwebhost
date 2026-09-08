import { isPreviewClient } from "./demo.ts";
import { STUDIO_INBOX } from "./site-addons.ts";
import type { Client } from "./types.ts";

const RESERVED_EMAIL_TLDS = new Set(["example", "invalid", "test", "localhost"]);

export type InquiryClient = Pick<
  Client,
  "id" | "businessName" | "email" | "phone"
> & { sample?: boolean };

export type InquiryNotifyPlan =
  | {
      kind: "owner";
      reason:
        | "studio"
        | "preview"
        | "sample"
        | "no-client"
        | "no-client-contact";
    }
  | {
      kind: "client";
      emailTo: string | null;
      smsTo: string | null;
    };

export function usableEmail(value: string | undefined | null) {
  const trimmed = (value || "").trim();
  if (!trimmed || trimmed.length > 200) return null;
  if (/\s/.test(trimmed)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  return trimmed;
}

/** Inbox we will actually send to on a live shop — not reserved .example demos. */
export function usableClientEmail(value: string | undefined | null) {
  const email = usableEmail(value);
  if (!email) return null;
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  const tld = domain.split(".").pop() || "";
  if (RESERVED_EMAIL_TLDS.has(tld)) return null;
  if (
    domain === "example.com" ||
    domain === "example.net" ||
    domain === "example.org"
  ) {
    return null;
  }
  return email;
}

/**
 * E.164 US number we can text. Drops empty, malformed, and NANPA 555-01xx
 * fictional sample numbers used on walk-in demo shops.
 */
export function usableSmsPhone(value: string | undefined | null) {
  const trimmed = (value || "").trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/\D/g, "");
  let national = "";
  if (digits.length === 10) national = digits;
  else if (digits.length === 11 && digits.startsWith("1")) {
    national = digits.slice(1);
  } else {
    return null;
  }
  const exchange = national.slice(3, 6);
  const subscriber = national.slice(6);
  if (exchange === "555" && subscriber >= "0100" && subscriber <= "0199") {
    return null;
  }
  return `+1${national}`;
}

export function isOwnerManagedSite(input: {
  client?: InquiryClient | null;
  inboxId?: string;
}) {
  const client = input.client;
  if (!client) return true;
  if (input.inboxId === STUDIO_INBOX || client.id === STUDIO_INBOX) {
    return true;
  }
  if (isPreviewClient(client) || client.sample) return true;
  return false;
}

export function siteInquiryNotifyPlan(input: {
  client?: InquiryClient | null;
  inboxId?: string;
}): InquiryNotifyPlan {
  const client = input.client ?? null;
  if (!client) return { kind: "owner", reason: "no-client" };
  if (input.inboxId === STUDIO_INBOX || client.id === STUDIO_INBOX) {
    return { kind: "owner", reason: "studio" };
  }
  if (isPreviewClient(client)) return { kind: "owner", reason: "preview" };
  if (client.sample) return { kind: "owner", reason: "sample" };

  const emailTo = usableClientEmail(client.email);
  const smsTo = usableSmsPhone(client.phone);
  if (!emailTo && !smsTo) {
    return { kind: "owner", reason: "no-client-contact" };
  }
  return { kind: "client", emailTo, smsTo };
}
