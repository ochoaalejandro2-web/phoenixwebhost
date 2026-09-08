import assert from "node:assert/strict";
import test from "node:test";
import { STUDIO_INBOX } from "./site-addons.ts";
import {
  siteInquiryNotifyPlan,
  usableClientEmail,
  usableSmsPhone,
} from "./site-inquiry-notify.ts";
import { notifyBookingLead, notifyChatLead, notifySiteContact } from "./notify.ts";
import type { ContactMessage } from "./types.ts";

const OWNER_EMAIL = "ochoa.alejandro2@gmail.com";
const OWNER_PHONE = "+14809532393";
const PATRICIA_EMAIL = "pafinancial19@gmail.com";
const PATRICIA_PHONE = "(720) 501-0501";
const PATRICIA_E164 = "+17205010501";

const paFinancial = {
  id: "cli_pa_financial",
  businessName: "P&A Financial LLC",
  email: PATRICIA_EMAIL,
  phone: PATRICIA_PHONE,
};

const chatMessage = (overrides: Partial<ContactMessage> = {}): ContactMessage => ({
  id: "msg_chat_1",
  clientId: "cli_pa_financial",
  name: "Maria Lopez",
  email: "",
  phone: "(602) 555-0199",
  message: "Visitor: do you do personal taxes?\nReceptionist: Yes — call (720) 501-0501.",
  createdAt: "2026-09-08T12:00:00.000Z",
  source: "chat",
  conversationId: "chat_1",
  notifiedAt: "2026-09-08T12:00:01.000Z",
  ...overrides,
});

test("usable SMS phone keeps real US numbers and drops fictional 555-01xx demos", () => {
  assert.equal(usableSmsPhone(PATRICIA_PHONE), PATRICIA_E164);
  assert.equal(usableSmsPhone("7205010501"), PATRICIA_E164);
  assert.equal(usableSmsPhone("+1 720 501 0501"), PATRICIA_E164);
  assert.equal(usableSmsPhone("(602) 545-3308"), "+16025453308");
  assert.equal(usableSmsPhone("(480) 555-0142"), null);
  assert.equal(usableSmsPhone("(480) 555-0199"), null);
  assert.equal(usableSmsPhone(""), null);
  assert.equal(usableSmsPhone("call me"), null);
});

test("usable client email rejects reserved demo TLDs", () => {
  assert.equal(usableClientEmail(PATRICIA_EMAIL), PATRICIA_EMAIL);
  assert.equal(usableClientEmail("info@holataxservice.example"), null);
  assert.equal(usableClientEmail("marco@desertpeakroofing.example"), null);
  assert.equal(usableClientEmail("pat@example.com"), null);
  assert.equal(usableClientEmail(""), null);
});

test("live client chat plan is Patricia’s email and phone, never the owner", () => {
  const plan = siteInquiryNotifyPlan({
    client: paFinancial,
    inboxId: "cli_pa_financial",
  });
  assert.deepEqual(plan, {
    kind: "client",
    emailTo: PATRICIA_EMAIL,
    smsTo: PATRICIA_E164,
  });
});

test("studio chat plan still notifies the owner", () => {
  assert.deepEqual(siteInquiryNotifyPlan({ inboxId: STUDIO_INBOX }), {
    kind: "owner",
    reason: "no-client",
  });
  assert.deepEqual(
    siteInquiryNotifyPlan({
      client: {
        id: STUDIO_INBOX,
        businessName: "Phoenixwebhost Inc.",
        email: OWNER_EMAIL,
        phone: OWNER_PHONE,
      },
      inboxId: STUDIO_INBOX,
    }),
    { kind: "owner", reason: "studio" },
  );
});

test("preview and sample shops stay on the owner inbox", () => {
  assert.equal(
    siteInquiryNotifyPlan({
      client: {
        id: "demo_lead_1",
        businessName: "Rivera Roofing",
        email: "pat@example.com",
        phone: "(602) 555-0100",
      },
    }).kind,
    "owner",
  );
  assert.deepEqual(
    siteInquiryNotifyPlan({
      client: {
        id: "cli_desert_sparkle",
        businessName: "Desert Sparkle Cleaning",
        email: "maya@desertsparklecleaning.example",
        phone: "(623) 555-0177",
        sample: true,
      },
    }),
    { kind: "owner", reason: "sample" },
  );
});

test("walk-in demo with .example email and 555 phone falls back to owner", () => {
  assert.deepEqual(
    siteInquiryNotifyPlan({
      client: {
        id: "cli_desert_peak",
        businessName: "Desert Peak Roofing",
        email: "marco@desertpeakroofing.example",
        phone: "(480) 555-0142",
      },
    }),
    { kind: "owner", reason: "no-client-contact" },
  );
});

test("live client with only a phone still stays off the owner inbox", () => {
  const plan = siteInquiryNotifyPlan({
    client: {
      id: "cli_hola_tax",
      businessName: "Hola Tax Service LLC",
      email: "info@holataxservice.example",
      phone: "(602) 545-3308",
    },
  });
  assert.deepEqual(plan, {
    kind: "client",
    emailTo: null,
    smsTo: "+16025453308",
  });
});

test("live client with email but no phone is email-only, not owner", () => {
  const plan = siteInquiryNotifyPlan({
    client: {
      id: "cli_live",
      businessName: "A Live Shop",
      email: "owner@live-shop.com",
      phone: "",
    },
  });
  assert.deepEqual(plan, {
    kind: "client",
    emailTo: "owner@live-shop.com",
    smsTo: null,
  });
});

const ENV_KEYS = [
  "RESEND_API_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_FROM",
  "NOTIFY_EMAIL",
  "NOTIFY_PHONE",
  "RESEND_FROM",
] as const;

function withNotifyEnv<T>(run: () => Promise<T>) {
  const previous: Record<string, string | undefined> = {};
  for (const key of ENV_KEYS) previous[key] = process.env[key];
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.TWILIO_ACCOUNT_SID = "ACtest";
  process.env.TWILIO_AUTH_TOKEN = "twilio_token";
  process.env.TWILIO_FROM = "+18005550199";
  process.env.NOTIFY_EMAIL = OWNER_EMAIL;
  process.env.NOTIFY_PHONE = OWNER_PHONE;
  return run().finally(() => {
    for (const key of ENV_KEYS) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}

type FetchCall = { url: string; body: string };

function mockNotifyFetch() {
  const calls: FetchCall[] = [];
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({
      url: String(input),
      body: String(init?.body || ""),
    });
    return new Response("{}", { status: 200 });
  }) as typeof fetch;
  return {
    calls,
    restore() {
      globalThis.fetch = original;
    },
  };
}

function resendTo(calls: FetchCall[]) {
  return calls
    .filter((call) => call.url.includes("api.resend.com"))
    .map((call) => JSON.parse(call.body) as { to: string[] });
}

function twilioTo(calls: FetchCall[]) {
  return calls
    .filter((call) => call.url.includes("api.twilio.com"))
    .map((call) => new URLSearchParams(call.body).get("To"));
}

test("live client chat emails and texts the client only — not Alex", async () => {
  await withNotifyEnv(async () => {
    const mock = mockNotifyFetch();
    try {
      await notifyChatLead({
        client: paFinancial,
        inboxId: "cli_pa_financial",
        message: chatMessage(),
      });
      const emails = resendTo(mock.calls);
      const sms = twilioTo(mock.calls);
      assert.equal(emails.length, 1);
      assert.deepEqual(emails[0]?.to, [PATRICIA_EMAIL]);
      assert.equal(sms.length, 1);
      assert.equal(sms[0], PATRICIA_E164);
      assert.equal(
        emails.some((row) => row.to.includes(OWNER_EMAIL)),
        false,
      );
      assert.equal(sms.includes(OWNER_PHONE), false);
    } finally {
      mock.restore();
    }
  });
});

test("studio chat still emails and texts the owner", async () => {
  await withNotifyEnv(async () => {
    const mock = mockNotifyFetch();
    try {
      await notifyChatLead({
        inboxId: STUDIO_INBOX,
        message: chatMessage({
          clientId: STUDIO_INBOX,
          name: "Website visitor",
          message: "How much is the Pro site?",
        }),
      });
      const emails = resendTo(mock.calls);
      const sms = twilioTo(mock.calls);
      assert.equal(emails.length, 1);
      assert.deepEqual(emails[0]?.to, [OWNER_EMAIL]);
      assert.equal(sms.length, 1);
      assert.equal(sms[0], OWNER_PHONE);
    } finally {
      mock.restore();
    }
  });
});

test("live client contact form uses the same client-only path", async () => {
  await withNotifyEnv(async () => {
    const mock = mockNotifyFetch();
    try {
      const status = await notifySiteContact(
        paFinancial,
        chatMessage({
          source: "contact",
          email: "visitor@gmail.com",
          message: "Need a W-2 appointment",
        }),
      );
      assert.equal(status, "sent");
      assert.deepEqual(resendTo(mock.calls)[0]?.to, [PATRICIA_EMAIL]);
      assert.equal(twilioTo(mock.calls)[0], PATRICIA_E164);
      assert.equal(twilioTo(mock.calls).includes(OWNER_PHONE), false);
    } finally {
      mock.restore();
    }
  });
});

test("live client with no email or phone falls back to the owner inbox", async () => {
  await withNotifyEnv(async () => {
    const mock = mockNotifyFetch();
    try {
      const status = await notifySiteContact(
        {
          id: "cli_empty",
          businessName: "Empty Shop",
          email: "",
          phone: "",
        },
        chatMessage({ clientId: "cli_empty", source: "contact" }),
      );
      assert.equal(status, "no-email");
      assert.deepEqual(resendTo(mock.calls)[0]?.to, [OWNER_EMAIL]);
      assert.equal(twilioTo(mock.calls)[0], OWNER_PHONE);
    } finally {
      mock.restore();
    }
  });
});

test("live client book-a-job uses the same client-only path", async () => {
  await withNotifyEnv(async () => {
    const mock = mockNotifyFetch();
    try {
      await notifyBookingLead(
        paFinancial,
        chatMessage({
          source: "booking",
          name: "Maria Lopez",
          phone: "(602) 555-0199",
          message: "Day: Tuesday\nJob: W-2 drop-off",
        }),
      );
      assert.deepEqual(resendTo(mock.calls)[0]?.to, [PATRICIA_EMAIL]);
      assert.equal(twilioTo(mock.calls)[0], PATRICIA_E164);
      assert.equal(
        resendTo(mock.calls).some((row) => row.to.includes(OWNER_EMAIL)),
        false,
      );
      assert.equal(twilioTo(mock.calls).includes(OWNER_PHONE), false);
    } finally {
      mock.restore();
    }
  });
});
