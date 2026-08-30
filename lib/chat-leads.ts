import { isPreviewClient } from "./demo.ts";
import type { ChatTurn } from "./receptionist.ts";
import { STUDIO_INBOX } from "./site-addons.ts";
import type { Client, ContactMessage, Locale } from "./types.ts";

const PHONE_RE = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const NAME_RE =
  /(?:my name is|i am|i'm|this is|me llamo|soy|mi nombre es)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ' -]{1,60})/i;

export function extractVisitorContact(text: string): {
  name: string;
  phone: string;
} {
  const phone = text.match(PHONE_RE)?.[0]?.trim() || "";
  const name = (text.match(NAME_RE)?.[1] || "").replace(/[.,;:!?]+$/, "").trim();
  return { name: name.slice(0, 120), phone: phone.slice(0, 40) };
}

export function formatChatTranscript(
  history: ChatTurn[],
  lastUser: string,
  lastReply: string,
): string {
  const lines = [
    ...history.map((turn) =>
      `${turn.role === "user" ? "Visitor" : "Receptionist"}: ${turn.content.trim()}`,
    ),
    `Visitor: ${lastUser.trim()}`,
    `Receptionist: ${lastReply.trim()}`,
  ];
  return lines.join("\n").slice(0, 4000);
}

export function mergeContact(
  previous: { name?: string; phone?: string } | null,
  incoming: { name: string; phone: string },
) {
  return {
    name: incoming.name || previous?.name || "",
    phone: incoming.phone || previous?.phone || "",
  };
}

function isAnonymousChatName(name?: string) {
  const trimmed = (name || "").trim();
  return (
    !trimmed ||
    trimmed === "Website visitor" ||
    trimmed === "Visitante del chat"
  );
}

export function shouldNotifyChatLead(
  existing: ContactMessage | null,
  next: { name: string; phone: string },
) {
  if (!existing || !existing.notifiedAt) return true;
  const hadPhone = Boolean(existing.phone.trim());
  const hadName = !isAnonymousChatName(existing.name);
  const gainedPhone = Boolean(next.phone) && !hadPhone;
  const gainedName = !isAnonymousChatName(next.name) && !hadName;
  return gainedPhone || gainedName;
}

export function chatInboxClientId(input: {
  site: string;
  leadId?: string;
  client?: Client | null;
}) {
  if (input.client && !isPreviewClient(input.client)) return input.client.id;
  if (input.leadId) return `demo_${input.leadId}`;
  if (input.site && input.site !== "studio") return input.site;
  return STUDIO_INBOX;
}

export function chatLeadLabel(locale: Locale) {
  return locale === "es" ? "Visitante del chat" : "Website visitor";
}
