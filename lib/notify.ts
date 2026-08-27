import { publicSiteUrl } from "@/lib/config";
import type { ContactMessage, Lead, Review } from "@/lib/types";

const DEFAULT_NOTIFY_EMAIL = "ochoa.alejandro2@gmail.com";
const DEFAULT_NOTIFY_PHONE = "+14809532393";
const DEFAULT_FROM = "Phoenixwebhost Inc. <onboarding@resend.dev>";
const FETCH_MS = 10_000;

type Alert = {
  subject: string;
  intro: string;
  name: string;
  phone?: string;
  email?: string;
  business: string;
  city?: string;
  message: string;
  extra?: string;
  extraLabel?: string;
  createdAt: string;
  adminPath: string;
  adminLabel: string;
};

function notifyEmail() {
  return (process.env.NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL).trim();
}

function notifyPhone() {
  return (process.env.NOTIFY_PHONE || DEFAULT_NOTIFY_PHONE).trim();
}

function resendFrom() {
  return (process.env.RESEND_FROM || DEFAULT_FROM).trim();
}

function arizonaTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function display(value: string | undefined, fallback = "—") {
  const trimmed = (value || "").trim();
  return trimmed || fallback;
}

export function telHref(phone: string) {
  const trimmed = phone.trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  if (trimmed.startsWith("+") && digits.length >= 8) return `tel:+${digits}`;
  if (digits.length >= 7) return `tel:${digits}`;
  return null;
}

function oneLine(message: string, max = 80) {
  const collapsed = message.replace(/\s+/g, " ").trim();
  if (!collapsed) return "";
  if (collapsed.length <= max) return collapsed;
  return `${collapsed.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function adminUrl(path: string) {
  return `${publicSiteUrl().replace(/\/$/, "")}${path}`;
}

function emailBodies(alert: Alert) {
  const when = arizonaTime(alert.createdAt);
  const phone = display(alert.phone, "Not given");
  const href = telHref(alert.phone || "");
  const phoneHtml = href
    ? `<a href="${escapeHtml(href)}">${escapeHtml(phone)}</a>`
    : escapeHtml(phone);
  const link = adminUrl(alert.adminPath);
  const rows: [string, string][] = [
    ["Name", escapeHtml(display(alert.name))],
  ];
  if (alert.phone?.trim()) rows.push(["Phone", phoneHtml]);
  if (alert.email?.trim()) {
    rows.push(["Email", escapeHtml(display(alert.email))]);
  }
  rows.push(["Business", escapeHtml(display(alert.business))]);
  if (alert.city) rows.push(["City", escapeHtml(display(alert.city))]);
  if (alert.extra) {
    rows.push([
      escapeHtml(alert.extraLabel || "Details"),
      escapeHtml(alert.extra),
    ]);
  }
  rows.push(["Message", escapeHtml(display(alert.message, "(none)"))]);
  rows.push(["Received", escapeHtml(when)]);

  const html = `<!doctype html>
<html><body style="font-family:Georgia,serif;background:#fff;color:#111;padding:24px">
  <p style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#00C851;margin:0">Phoenixwebhost Inc.</p>
  <h1 style="font-size:24px;margin:8px 0 16px">${escapeHtml(alert.subject)}</h1>
  <p>${escapeHtml(alert.intro)}</p>
  <table style="border-collapse:collapse;width:100%;max-width:560px">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:8px 12px 8px 0;vertical-align:top;color:#555;white-space:nowrap">${label}</td><td style="padding:8px 0;vertical-align:top">${value}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="margin-top:24px"><a href="${escapeHtml(link)}">${escapeHtml(alert.adminLabel)}</a></p>
</body></html>`;

  const textLines = [alert.subject, "", alert.intro, "", `Name: ${display(alert.name)}`];
  if (alert.phone?.trim()) textLines.push(`Phone: ${phone}`);
  if (alert.email?.trim()) textLines.push(`Email: ${display(alert.email)}`);
  textLines.push(`Business: ${display(alert.business)}`);
  if (alert.city) textLines.push(`City: ${display(alert.city)}`);
  if (alert.extra) {
    textLines.push(`${alert.extraLabel || "Details"}: ${alert.extra}`);
  }
  textLines.push(`Message: ${display(alert.message, "(none)")}`);
  textLines.push(`Received: ${when}`);
  textLines.push("", `Admin: ${link}`);

  return { html, text: textLines.join("\n") };
}

function smsBody(alert: Alert) {
  const ask = oneLine(alert.message);
  const who = alert.business
    ? `${display(alert.name)} (${alert.business.trim()})`
    : display(alert.name);
  const parts = [`${alert.subject}: ${who}.`];
  if (alert.phone?.trim()) parts.push(`Call ${alert.phone.trim()}.`);
  if (alert.extra) parts.push(alert.extra);
  if (ask) parts.push(ask);
  parts.push(adminUrl(alert.adminPath));
  const text = parts.join(" ");
  return text.length <= 320 ? text : `${text.slice(0, 319).trimEnd()}…`;
}

async function deliverEmail(subject: string, html: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[notify] skipping email: RESEND_API_KEY is not set");
    return;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom(),
      to: [notifyEmail()],
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(FETCH_MS),
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error(
      "[notify] Resend error",
      response.status,
      detail.slice(0, 500),
    );
  }
}

async function deliverSms(body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM?.trim();
  if (!sid || !token || !from) {
    console.warn(
      "[notify] skipping SMS: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_FROM is not set",
    );
    return;
  }
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: notifyPhone(),
        From: from,
        Body: body,
      }),
      signal: AbortSignal.timeout(FETCH_MS),
    },
  );
  if (!response.ok) {
    const detail = await response.text();
    console.error(
      "[notify] Twilio error",
      response.status,
      detail.slice(0, 500),
    );
  }
}

async function sendEmail(alert: Alert) {
  const { html, text } = emailBodies(alert);
  await deliverEmail(alert.subject, html, text);
}

async function sendSms(alert: Alert) {
  await deliverSms(smsBody(alert));
}

async function sendBoth(alert: Alert) {
  const results = await Promise.allSettled([sendEmail(alert), sendSms(alert)]);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[notify] channel failed", result.reason);
    }
  }
}

export async function notifyNewLead(lead: Lead) {
  try {
    await sendBoth({
      subject: "New Phoenixwebhost site request",
      intro: "Someone just asked for a site. Call them now if you can.",
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      business: lead.businessName,
      city: lead.city,
      message: lead.message,
      extra: lead.locale === "es" ? "Spanish" : "English",
      extraLabel: "Language",
      createdAt: lead.createdAt,
      adminPath: "/admin/leads",
      adminLabel: "Open in Admin → Requests",
    });
  } catch (error) {
    console.error("[notify] unexpected error (lead)", error);
  }
}

export async function notifySiteContact(
  businessName: string,
  message: ContactMessage,
  clientId: string,
) {
  try {
    await sendBoth({
      subject: `New contact on ${businessName} site`,
      intro: "Someone wrote in on a client site.",
      name: message.name,
      phone: message.phone,
      email: message.email,
      business: businessName,
      message: message.message,
      createdAt: message.createdAt,
      adminPath: `/admin/clients/${clientId}`,
      adminLabel: "Open in Admin → Client",
    });
  } catch (error) {
    console.error("[notify] unexpected error (contact)", error);
  }
}

export async function notifyNewReview(review: Review) {
  try {
    await sendBoth({
      subject: "New Phoenixwebhost review",
      intro:
        "A company left a review. Approve it in Admin before it goes live.",
      name: review.reviewerName,
      business: review.companyName,
      city: review.city,
      message: review.body,
      extra: `${review.rating} / 5`,
      extraLabel: "Rating",
      createdAt: review.createdAt,
      adminPath: "/admin/reviews",
      adminLabel: "Open in Admin → Reviews",
    });
  } catch (error) {
    console.error("[notify] unexpected error (review)", error);
  }
}

export async function notifyOwnerAuthCode(code: string) {
  const text = `Your Phoenixwebhost owner login code is ${code}. It expires in 10 minutes. If you did not try to sign in, ignore this message.`;
  const html = `<!doctype html>
<html><body style="font-family:Georgia,serif;background:#fff;color:#111;padding:24px">
  <p style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#00C851;margin:0">Phoenixwebhost Inc.</p>
  <h1 style="font-size:24px;margin:8px 0 16px">Owner login code</h1>
  <p>Use this code to finish signing in. It expires in 10 minutes.</p>
  <p style="font-size:28px;letter-spacing:.18em;font-weight:700">${code}</p>
  <p>If you did not try to sign in, ignore this email.</p>
</body></html>`;
  try {
    const results = await Promise.allSettled([
      deliverEmail("Phoenixwebhost login code", html, text),
      deliverSms(
        `Phoenixwebhost login code: ${code}. Expires in 10 minutes. Ignore if this was not you.`,
      ),
    ]);
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("[notify] auth code channel failed");
      }
    }
  } catch {
    console.error("[notify] unexpected error (auth code)");
  }
}
