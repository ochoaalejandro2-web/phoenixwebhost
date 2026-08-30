import { publicSiteUrl } from "@/lib/config";
import { demoUrl, templateLabel } from "@/lib/demo";
import { isPreviewClient } from "@/lib/demo";
import { STUDIO_INBOX } from "@/lib/site-addons";
import type { Client, ContactMessage, Lead, Review } from "@/lib/types";

export type SiteContactStatus = "sent" | "no-email" | "send-failed";

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
  adminPath?: string;
  adminLabel?: string;
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
  const link = alert.adminPath ? adminUrl(alert.adminPath) : "";
  const showAdmin = Boolean(link && alert.adminLabel);
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
  ${
    showAdmin
      ? `<p style="margin-top:24px"><a href="${escapeHtml(link)}">${escapeHtml(alert.adminLabel || "")}</a></p>`
      : ""
  }
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
  if (showAdmin) {
    textLines.push("", `Admin: ${link}`);
  }

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
  if (alert.adminPath) parts.push(adminUrl(alert.adminPath));
  const text = parts.join(" ");
  return text.length <= 320 ? text : `${text.slice(0, 319).trimEnd()}…`;
}

export function usableEmail(value: string | undefined | null) {
  const trimmed = (value || "").trim();
  if (!trimmed || trimmed.length > 200) return null;
  if (/\s/.test(trimmed)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  return trimmed;
}

function clientInquiryBodies(businessName: string, message: ContactMessage) {
  const subject = `New website message for ${businessName}`;
  const intro =
    "Someone wrote in from your website. Reply to this email to reach them.";
  const { html, text } = emailBodies({
    subject,
    intro,
    name: message.name,
    phone: message.phone,
    email: message.email,
    business: businessName,
    message: message.message,
    createdAt: message.createdAt,
  });
  return { subject, html, text };
}

async function deliverEmail(
  subject: string,
  html: string,
  text: string,
  options?: { to?: string[]; replyTo?: string },
) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[notify] skipping email: RESEND_API_KEY is not set");
    return false;
  }
  const to = (options?.to?.length ? options.to : [notifyEmail()])
    .map((value) => value.trim())
    .filter(Boolean);
  if (to.length === 0) {
    console.warn("[notify] skipping email: no recipient");
    return false;
  }
  try {
    const payload: Record<string, unknown> = {
      from: resendFrom(),
      to,
      subject,
      html,
      text,
    };
    if (options?.replyTo) payload.reply_to = options.replyTo;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(FETCH_MS),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error(
        "[notify] Resend error",
        response.status,
        detail.slice(0, 500),
      );
      return false;
    }
    return true;
  } catch {
    console.error("[notify] Resend request failed");
    return false;
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
    return false;
  }
  try {
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
      return false;
    }
    return true;
  } catch {
    console.error("[notify] Twilio request failed");
    return false;
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
    const preview = demoUrl(lead.id);
    await sendBoth({
      subject: "New Phoenixwebhost demo request",
      intro:
        "Someone just asked for a live demo. Call them in the morning if they do not buy — they already saw a mockup of their shop.",
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      business: lead.businessName,
      city: lead.city,
      message: lead.message,
      extra: [
        lead.locale === "es" ? "Spanish" : "English",
        templateLabel(lead.template, "en"),
        lead.wantsLoud
          ? "Wants Loud ($349/mo)"
          : lead.wantsTraffic
            ? "Wants Traffic ($199/mo)"
            : lead.wantsLocalBoost
              ? "Wants Local Boost ($99 + $79/mo)"
              : "No ads add-on",
        lead.wantsBusinessEmail
          ? "Wants Business Email ($49 + $19/mo)"
          : "No Business Email",
        lead.wantsBookAJob ? "Wants Book a job ($49 + $19/mo)" : "",
        lead.wantsMissedCall ? "Wants missed-call text-back" : "",
        lead.wantsReviewTexts ? "Wants review texts" : "",
        lead.wantsVoice ? "Wants voice receptionist" : "",
        preview,
      ]
        .filter(Boolean)
        .join(" · "),
      extraLabel: "Notes",
      createdAt: lead.createdAt,
      adminPath: "/admin/leads",
      adminLabel: "Open in Admin → Requests",
    });
  } catch (error) {
    console.error("[notify] unexpected error (lead)", error);
  }
}

function customerDemoBodies(lead: Lead) {
  const preview = demoUrl(lead.id);
  const es = lead.locale === "es";
  const trade = templateLabel(lead.template, lead.locale);
  const subject = es
    ? `Su demo de Phoenixwebhost para ${lead.businessName}`
    : `Here’s your Phoenixwebhost demo for ${lead.businessName}`;
  const intro = es
    ? `Preparamos una idea de cómo podría verse el sitio de ${lead.businessName}, partiendo de nuestra plantilla de ${trade}. No es un diseño a medida nuevo: es una plantilla profesional llena con sus datos.`
    : `Here is an idea of how ${lead.businessName} could look online, starting from our ${trade} template. This is not a brand-new custom design — it is a proven layout filled with your answers.`;
  const pay = es
    ? "Para publicarlo de verdad: $200 de lanzamiento + $69 al mes para mantenerlo en línea. El primer pago es $269 si paga el lanzamiento y el primer mes juntos."
    : "To go live: $200 to launch + $69/month to keep it live. The first payment is $269 if you pay launch and the first month together.";
  const extras = es
    ? "Local Boost, Traffic o Loud (un solo nivel de anuncios) y Business Email son opcionales y se pueden agregar en el mismo pago. Una página extra cuesta $75–$150. Un logotipo, $100–$300. No vendemos diseño ilimitado con IA."
    : "Local Boost, Traffic, or Loud (one ads level) and Business Email are optional and can be added in the same checkout. An extra page is $75–$150. A logo is $100–$300. We do not sell unlimited AI design.";
  const { html, text } = emailBodies({
    subject,
    intro,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    business: lead.businessName,
    city: lead.city,
    message: lead.message,
    extra: `${pay} ${extras}`,
    extraLabel: es ? "Precio" : "Price",
    createdAt: lead.createdAt,
    adminPath: `/demo/${lead.id}`,
    adminLabel: es ? "Ver su demo" : "Open your demo",
  });
  const button = `<p style="margin-top:24px"><a href="${escapeHtml(preview)}" style="display:inline-block;background:#00C851;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700">${es ? "Ver la demo / Comprar" : "View demo / Go live"}</a></p>`;
  const htmlWithCta = html.replace("</body></html>", `${button}</body></html>`);
  const textWithLink = `${text}\n\n${es ? "Demo" : "Demo"}: ${preview}\n`;
  return { subject, html: htmlWithCta, text: textWithLink };
}

export async function notifyCustomerDemo(lead: Lead) {
  const to = usableEmail(lead.email);
  if (!to) {
    console.warn("[notify] skipping customer demo email: invalid address");
    return false;
  }
  try {
    const { subject, html, text } = customerDemoBodies(lead);
    return await deliverEmail(subject, html, text, {
      to: [to],
      replyTo: notifyEmail(),
    });
  } catch (error) {
    console.error("[notify] unexpected error (customer demo)", error);
    return false;
  }
}

function ownerContactAlert(
  client: Pick<Client, "id" | "businessName">,
  message: ContactMessage,
): Alert {
  return {
    subject: `New contact on ${client.businessName} site`,
    intro: "Someone wrote in on a client site.",
    name: message.name,
    phone: message.phone,
    email: message.email,
    business: client.businessName,
    message: message.message,
    createdAt: message.createdAt,
    adminPath: `/admin/clients/${client.id}`,
    adminLabel: "Open in Admin → Client",
  };
}

async function notifyOwnerSiteContact(
  client: Pick<Client, "id" | "businessName">,
  message: ContactMessage,
) {
  try {
    await sendBoth(ownerContactAlert(client, message));
  } catch (error) {
    console.error("[notify] unexpected error (contact owner copy)", error);
  }
}

export async function notifySiteContact(
  client: Pick<Client, "id" | "businessName" | "email">,
  message: ContactMessage,
): Promise<SiteContactStatus> {
  const clientEmail = usableEmail(client.email);
  if (!clientEmail) {
    await notifyOwnerSiteContact(client, message);
    return "no-email";
  }
  try {
    const inquiry = clientInquiryBodies(client.businessName, message);
    const replyTo = usableEmail(message.email) ?? undefined;
    const [clientResult] = await Promise.allSettled([
      deliverEmail(inquiry.subject, inquiry.html, inquiry.text, {
        to: [clientEmail],
        replyTo,
      }),
      notifyOwnerSiteContact(client, message),
    ]);
    if (clientResult.status === "fulfilled" && clientResult.value) {
      return "sent";
    }
    return "send-failed";
  } catch (error) {
    console.error("[notify] unexpected error (contact)", error);
    try {
      await notifyOwnerSiteContact(client, message);
    } catch (copyError) {
      console.error("[notify] unexpected error (contact owner copy)", copyError);
    }
    return "send-failed";
  }
}

export async function notifyChatLead(input: {
  client?: Pick<Client, "id" | "businessName" | "email"> | null;
  inboxId: string;
  message: ContactMessage;
  locale?: "en" | "es";
}) {
  const client = input.client;
  const studio =
    input.inboxId === STUDIO_INBOX || !client || isPreviewClient(client);
  if (studio) {
    try {
      await sendBoth({
        subject: "New Phoenixwebhost chat lead",
        intro:
          "Someone used the included AI receptionist. Call or email them if they left a number.",
        name: input.message.name || "Website visitor",
        phone: input.message.phone,
        email: input.message.email,
        business: client?.businessName || "Phoenixwebhost Inc.",
        message: input.message.message,
        createdAt: input.message.createdAt,
        adminPath: "/admin/leads",
        adminLabel: "Open in Admin → Requests",
      });
    } catch (error) {
      console.error("[notify] unexpected error (studio chat)", error);
    }
    return;
  }
  await notifySiteContact(client, input.message);
}

export async function notifyBookingLead(
  client: Pick<Client, "id" | "businessName" | "email">,
  message: ContactMessage,
) {
  if (isPreviewClient(client) || client.id === STUDIO_INBOX) {
    try {
      await sendBoth({
        subject: `Book-a-job request for ${client.businessName}`,
        intro: "Someone asked to book a job from a site preview.",
        name: message.name,
        phone: message.phone,
        email: message.email,
        business: client.businessName,
        message: message.message,
        createdAt: message.createdAt,
        adminPath: "/admin/leads",
        adminLabel: "Open in Admin → Requests",
      });
    } catch (error) {
      console.error("[notify] unexpected error (preview booking)", error);
    }
    return;
  }
  await notifySiteContact(client, message);
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
    const [email, sms] = await Promise.all([
      deliverEmail("Phoenixwebhost login code", html, text).catch(() => false),
      deliverSms(
        `Phoenixwebhost login code: ${code}. Expires in 10 minutes. Ignore if this was not you.`,
      ).catch(() => false),
    ]);
    return { email: Boolean(email), sms: Boolean(sms) };
  } catch {
    console.error("[notify] unexpected error (auth code)");
    return { email: false, sms: false };
  }
}

export function twoFactorProvidersReady() {
  const email = Boolean(process.env.RESEND_API_KEY?.trim());
  const sms = Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      process.env.TWILIO_FROM?.trim(),
  );
  return email || sms;
}
