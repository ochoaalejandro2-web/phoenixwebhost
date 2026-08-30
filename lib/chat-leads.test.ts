import assert from "node:assert/strict";
import test from "node:test";
import {
  chatInboxClientId,
  extractVisitorContact,
  formatChatTranscript,
  mergeContact,
  shouldNotifyChatLead,
} from "./chat-leads.ts";
import { STUDIO_INBOX } from "./site-addons.ts";
import type { ContactMessage } from "./types.ts";

test("extracts a US phone and a spoken name from chat text", () => {
  const found = extractVisitorContact("Hi, my name is Maria Lopez, call (602) 555-0199");
  assert.equal(found.name, "Maria Lopez");
  assert.match(found.phone, /602/);
});

test("notifies once unless a name or phone newly appears", () => {
  const existing: ContactMessage = {
    id: "msg_1",
    clientId: "cli_1",
    name: "Website visitor",
    email: "",
    phone: "",
    message: "do you do lawns?",
    createdAt: "2026-01-01T00:00:00.000Z",
    source: "chat",
    conversationId: "chat_1",
    notifiedAt: "2026-01-01T00:00:01.000Z",
  };
  assert.equal(shouldNotifyChatLead(null, { name: "", phone: "" }), true);
  assert.equal(
    shouldNotifyChatLead(existing, { name: "", phone: "" }),
    false,
  );
  assert.equal(
    shouldNotifyChatLead(existing, { name: "", phone: "(602) 555-0100" }),
    true,
  );
  const spanish: ContactMessage = {
    ...existing,
    name: "Visitante del chat",
  };
  assert.equal(
    shouldNotifyChatLead(spanish, { name: "Maria Lopez", phone: "" }),
    true,
  );
});

test("studio and preview chats go to the studio inbox, live clients keep their id", () => {
  assert.equal(chatInboxClientId({ site: "studio" }), STUDIO_INBOX);
  assert.equal(
    chatInboxClientId({ site: "palo-verde-yards", leadId: "lead_1" }),
    "demo_lead_1",
  );
  assert.equal(
    chatInboxClientId({
      site: "palo-verde-yards",
      client: { id: "cli_live" } as never,
    }),
    "cli_live",
  );
});

test("transcript includes the last visitor question and receptionist reply", () => {
  const text = formatChatTranscript(
    [{ role: "user", content: "hours?" }],
    "do you do lawns?",
    "Yes — Lawn care. Call (602) 555-0168.",
  );
  assert.match(text, /hours\?/);
  assert.match(text, /do you do lawns\?/);
  assert.match(text, /Lawn care/);
  const merged = mergeContact({ name: "Pat" }, { name: "", phone: "4805550100" });
  assert.equal(merged.name, "Pat");
  assert.equal(merged.phone, "4805550100");
});
