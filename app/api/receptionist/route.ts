import { NextResponse } from "next/server";
import {
  chatInboxClientId,
  chatLeadLabel,
  extractVisitorContact,
  formatChatTranscript,
  mergeContact,
  shouldNotifyChatLead,
} from "@/lib/chat-leads";
import { buildClientFromLead } from "@/lib/demo";
import { notifyChatLead } from "@/lib/notify";
import {
  STUDIO_SITE,
  answerReceptionist,
  buildClientFacts,
  buildStudioFacts,
  fallbackAnswer,
  type ReceptionistFacts,
} from "@/lib/receptionist";
import { STUDIO_INBOX } from "@/lib/site-addons";
import {
  getClientBySlug,
  getContactByConversation,
  getLead,
  upsertContactMessage,
} from "@/lib/store";
import type { Client, Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

function asLocale(value: unknown): Locale {
  return value === "es" ? "es" : "en";
}

function genericFacts(locale: Locale): ReceptionistFacts {
  const facts = buildStudioFacts(locale);
  return {
    ...facts,
    kind: "client",
    businessName: facts.locale === "es" ? "este sitio" : "this site",
    phone: "",
    listedPrices: [],
    services: [],
    serviceKeys: [],
    contactHint:
      locale === "es"
        ? "Use el formulario de contacto o el teléfono que aparece en esta página."
        : "Use the contact form or the phone number on this page.",
  };
}

async function recordChatLead(input: {
  site: string;
  leadId?: string;
  client: Client | null;
  locale: Locale;
  conversationId: string;
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
  reply: string;
}) {
  if (!input.message.trim()) return;
  const conversationId =
    input.conversationId.trim().slice(0, 80) ||
    `chat_${crypto.randomUUID()}`;
  const existing = await getContactByConversation(conversationId);
  const extracted = extractVisitorContact(
    [input.message, ...input.history.map((row) => row.content)].join("\n"),
  );
  const contact = mergeContact(existing, extracted);
  const transcript = formatChatTranscript(
    input.history,
    input.message,
    input.reply,
  );
  const inboxId = chatInboxClientId({
    site: input.site,
    leadId: input.leadId,
    client: input.client,
  });
  const now = new Date().toISOString();
  const notify = shouldNotifyChatLead(existing, contact);
  const saved = await upsertContactMessage({
    id: existing?.id || `msg_${crypto.randomUUID()}`,
    clientId: existing?.clientId || inboxId,
    name: contact.name || chatLeadLabel(input.locale),
    email: existing?.email || "",
    phone: contact.phone,
    message: transcript,
    createdAt: existing?.createdAt || now,
    source: "chat",
    conversationId,
    notifiedAt: notify ? now : existing?.notifiedAt || null,
  });
  if (notify) {
    await notifyChatLead({
      client: input.client,
      inboxId: saved.clientId || STUDIO_INBOX,
      message: saved,
      locale: input.locale,
    });
  }
}

export async function POST(request: Request) {
  let body: {
    site?: string;
    leadId?: string;
    locale?: Locale;
    message?: string;
    conversationId?: string;
    history?: { role?: string; content?: string }[];
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({
      reply: fallbackAnswer(buildStudioFacts("en"), ""),
      source: "facts",
    });
  }

  const locale = asLocale(body.locale);
  const message = String(body.message || "").trim().slice(0, 500);
  const site = String(body.site || "").trim();
  const leadId = String(body.leadId || "").trim();
  const conversationId = String(body.conversationId || "").trim();
  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (turn) =>
            (turn.role === "user" || turn.role === "assistant") &&
            typeof turn.content === "string",
        )
        .map((turn) => ({
          role: turn.role as "user" | "assistant",
          content: String(turn.content).slice(0, 800),
        }))
    : [];

  let facts: ReceptionistFacts = genericFacts(locale);
  let client: Client | null = null;
  if (leadId) {
    const lead = await getLead(leadId);
    if (lead) {
      client = buildClientFromLead(lead, [], { preview: true });
      facts = buildClientFacts(client, locale);
    }
  } else if (!site || site === STUDIO_SITE) {
    facts = buildStudioFacts(locale);
  } else {
    client = await getClientBySlug(site);
    if (client && client.siteStatus !== "taken_down") {
      facts = buildClientFacts(client, locale);
    }
  }

  const result = await answerReceptionist({
    facts,
    message,
    history,
    oidcToken: process.env.VERCEL_OIDC_TOKEN,
  });

  try {
    await recordChatLead({
      site,
      leadId,
      client,
      locale,
      conversationId,
      message,
      history,
      reply: result.reply,
    });
  } catch (error) {
    console.error("[receptionist] chat lead failed", error);
  }

  return NextResponse.json(result);
}
