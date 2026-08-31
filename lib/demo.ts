import type {
  Client,
  DemoAccent,
  DemoTweaks,
  Lead,
  Locale,
  TemplateId,
} from "./types";

const TEMPLATE_IDS: TemplateId[] = [
  "contractor",
  "handyman",
  "carpentry",
  "salon",
  "restaurant",
  "professional",
  "landscaping",
  "tax",
];

const TEMPLATE_LABELS: Record<TemplateId, { en: string; es: string }> = {
  contractor: { en: "Contractor & trades", es: "Contratista y oficios" },
  handyman: { en: "Handyman", es: "Manitas y reparaciones" },
  carpentry: { en: "Carpentry & millwork", es: "Carpintería y ebanistería" },
  salon: { en: "Salon & beauty", es: "Salón y belleza" },
  restaurant: { en: "Restaurant & cafe", es: "Restaurante y café" },
  professional: { en: "Professional services", es: "Servicios profesionales" },
  landscaping: { en: "Landscaping & yards", es: "Jardinería y patios" },
  tax: { en: "Tax office", es: "Oficina de impuestos" },
};

export const DEMO_SAMPLE_PHONE = "(480) 555-0199";

export const DEMO_HOURS: Record<TemplateId, string> = {
  contractor: "Mon–Fri 7:00am–5:00pm",
  handyman: "Mon–Sat 7:00am–6:00pm",
  carpentry: "Mon–Fri 8:00am–5:00pm",
  salon: "Tue–Sat 9:00am–7:00pm",
  restaurant: "Tue–Sun 11:00am–9:00pm",
  professional: "Mon–Fri 8:00am–5:00pm",
  landscaping: "Mon–Sat 7:00am–5:00pm",
  tax: "Mon–Fri 9:00am–6:00pm · Sat 9:00am–1:00pm",
};

const DEMO_HOURS_ES: Record<TemplateId, string> = {
  contractor: "Lun–Vie 7:00am–5:00pm",
  handyman: "Lun–Sáb 7:00am–6:00pm",
  carpentry: "Lun–Vie 8:00am–5:00pm",
  salon: "Mar–Sáb 9:00am–7:00pm",
  restaurant: "Mar–Dom 11:00am–9:00pm",
  professional: "Lun–Vie 8:00am–5:00pm",
  landscaping: "Lun–Sáb 7:00am–5:00pm",
  tax: "Lun–Vie 9:00am–6:00pm · Sáb 9:00am–1:00pm",
};

const DEMO_STREET: Record<TemplateId, string> = {
  contractor: "2140 E Broadway Rd",
  handyman: "1145 N Dysart Rd",
  carpentry: "2710 N 16th St",
  salon: "7349 E Shea Blvd",
  restaurant: "125 W Main St",
  professional: "201 E Washington St",
  landscaping: "4120 N 32nd St",
  tax: "4550 N Central Ave",
};

export function displayHours(
  hours: string,
  template: TemplateId,
  locale: Locale,
) {
  if (locale === "es" && hours === DEMO_HOURS[template]) {
    return DEMO_HOURS_ES[template];
  }
  return hours;
}

export function demoStreetAddress(template: TemplateId, city: string) {
  const street = DEMO_STREET[template];
  const raw = city.trim() || "Phoenix, AZ";
  const withState = /,\s*az\b/i.test(raw) || /\baz\b/i.test(raw)
    ? raw
    : `${raw}, AZ`;
  return `${street}, ${withState}`;
}

export function demoPhoneOrSample(phone: string) {
  return phone.trim() || DEMO_SAMPLE_PHONE;
}

export function isSamplePhone(phone: string) {
  return phone.trim() === DEMO_SAMPLE_PHONE;
}

function uniqueSlug(base: string, taken: string[]) {
  const root =
    base
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "site";
  if (!taken.includes(root)) return root;
  let i = 2;
  while (taken.includes(`${root}-${i}`)) i += 1;
  return `${root}-${i}`;
}

export const DEMO_ACCENTS: {
  id: DemoAccent;
  label: string;
  labelEs: string;
  hex: string | null;
}[] = [
  { id: "template", label: "Template colors", labelEs: "Colores de la plantilla", hex: null },
  { id: "lime", label: "Lime", labelEs: "Lima", hex: "#00c851" },
  { id: "clay", label: "Clay", labelEs: "Barro", hex: "#c45c26" },
  { id: "navy", label: "Navy", labelEs: "Azul marino", hex: "#1e3a5f" },
  { id: "rose", label: "Rose", labelEs: "Rosa", hex: "#9c4a6a" },
  { id: "forest", label: "Forest", labelEs: "Bosque", hex: "#2f4a38" },
];

export const TEMPLATE_STARTER_SERVICES: Record<TemplateId, string[]> = {
  contractor: [
    "Roof repair",
    "Roof replacement",
    "Tile and shingle",
    "Leak inspection",
    "Free estimates",
    "Emergency calls",
  ],
  handyman: [
    "Home repairs",
    "Drywall",
    "Interior painting",
    "Fixture install",
    "Odd jobs",
    "Punch-list fixes",
  ],
  carpentry: [
    "Custom cabinets",
    "Built-ins",
    "Furniture",
    "Trim and millwork",
    "Residential",
    "Commercial",
  ],
  salon: [
    "Haircuts",
    "Color",
    "Blowouts",
    "Bridal styling",
    "Treatments",
    "Appointments",
  ],
  restaurant: [
    "Lunch plates",
    "Dinner",
    "Patio",
    "Catering trays",
    "Weekend brunch",
    "Kids menu",
  ],
  professional: [
    "Consultations",
    "Planning",
    "Ongoing support",
    "Local service",
    "Bookkeeping",
    "Paperwork",
  ],
  landscaping: [
    "Desert landscaping",
    "Lawn care",
    "Drip irrigation",
    "Cleanup",
    "Rock and gravel yards",
    "Tree and cactus care",
  ],
  tax: [
    "Personal tax preparation",
    "Small-business tax preparation",
    "ITIN applications",
    "Bookkeeping",
    "Year-round tax support",
    "Tax planning",
  ],
};

const ACCENT_IDS: DemoAccent[] = DEMO_ACCENTS.map((row) => row.id);

export function emptyDemoTweaks(): DemoTweaks {
  return {
    logoText: "",
    accent: "template",
    extraSentence: "",
    extraPageTitle: "",
    extraPageBody: "",
  };
}

export function parseTemplateId(value: unknown): TemplateId | null {
  const id = String(value || "").trim();
  return TEMPLATE_IDS.includes(id as TemplateId) ? (id as TemplateId) : null;
}

export function parseDemoAccent(value: unknown): DemoAccent {
  const id = String(value || "").trim();
  return ACCENT_IDS.includes(id as DemoAccent) ? (id as DemoAccent) : "template";
}

export function demoPath(leadId: string) {
  return `/demo/${leadId}`;
}

export function extraDemoPath(leadId: string) {
  return `/demo/${leadId}/extra`;
}

export function demoUrl(leadId: string) {
  const root = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, "");
  return `${root}${demoPath(leadId)}`;
}

export function isPreviewClient(client: Pick<Client, "id">) {
  return client.id.startsWith("demo_");
}

export function previewLeadId(client: Pick<Client, "id">) {
  return isPreviewClient(client) ? client.id.slice("demo_".length) : null;
}

export function siteHomeHref(client: Pick<Client, "id" | "slug">) {
  const leadId = previewLeadId(client);
  return leadId ? demoPath(leadId) : `/s/${client.slug}`;
}

export function accentHex(accent: DemoAccent) {
  return DEMO_ACCENTS.find((row) => row.id === accent)?.hex ?? null;
}

export function templateLabel(template: TemplateId, locale: "en" | "es") {
  return TEMPLATE_LABELS[template][locale] || template;
}

function firstSentence(text: string) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^[^.!?]+[.!?]?/);
  const sentence = (match ? match[0] : trimmed).trim();
  return sentence.slice(0, 160);
}

export function demoTagline(lead: Pick<Lead, "businessName" | "city" | "message">) {
  return (
    firstSentence(lead.message) ||
    (lead.city.trim()
      ? `${lead.businessName} in ${lead.city.trim()}`
      : lead.businessName)
  );
}

export function demoAbout(lead: Pick<Lead, "businessName" | "city" | "message" | "locale">) {
  const story = lead.message.replace(/\s+/g, " ").trim();
  if (story) return story.slice(0, 800);
  const city = lead.city.trim() || "Arizona";
  if (lead.locale === "es") {
    return `${lead.businessName} es un negocio local en ${city}. Esta vista parte de una plantilla comprobada de Phoenixwebhost, llena con su nombre y ciudad — no es un diseño a medida nuevo.`;
  }
  return `${lead.businessName} is a local ${city} business. This preview starts from a proven Phoenixwebhost template and is filled with your name and city — not a brand-new custom design.`;
}

export function demoServices(template: TemplateId) {
  return [...TEMPLATE_STARTER_SERVICES[template]];
}

export function leadHasExtraPage(demo: DemoTweaks) {
  return Boolean(demo.extraPageTitle.trim() || demo.extraPageBody.trim());
}

export function applyDemoPatch(
  current: DemoTweaks,
  patch: Partial<DemoTweaks>,
): DemoTweaks {
  const next: DemoTweaks = { ...current };
  if (patch.logoText !== undefined) {
    next.logoText = String(patch.logoText).trim().slice(0, 80);
  }
  if (patch.accent !== undefined) {
    next.accent = parseDemoAccent(patch.accent);
  }
  if (patch.extraSentence !== undefined) {
    next.extraSentence = String(patch.extraSentence).trim().slice(0, 240);
  }
  if (patch.extraPageTitle !== undefined) {
    next.extraPageTitle = String(patch.extraPageTitle).trim().slice(0, 80);
  }
  if (patch.extraPageBody !== undefined) {
    next.extraPageBody = String(patch.extraPageBody).trim().slice(0, 800);
  }
  return next;
}

export type DemoChatIntent =
  | { kind: "logo"; logoText: string }
  | { kind: "color"; accent: DemoAccent }
  | { kind: "sentence"; extraSentence: string }
  | { kind: "page"; title: string; body: string }
  | { kind: "quote" }
  | { kind: "help" };

function quotedChunk(text: string) {
  const match = text.match(/["“']([^"”']+)["”']/);
  return match?.[1]?.trim() || "";
}

function afterKeyword(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  return (match?.[1] || "").trim();
}

export function interpretDemoChat(raw: string): DemoChatIntent {
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) return { kind: "help" };
  const lower = text.toLowerCase();

  const wantsMore =
    /redesign|rediseñ|unlimited|ilimitad|many pages|varias páginas|full custom|marca nueva|brand.new/i.test(
      lower,
    );
  if (wantsMore) return { kind: "quote" };

  if (
    /\b(logo|logotipo|brand name|nombre de marca|header)\b/i.test(lower)
  ) {
    const logoText =
      quotedChunk(text) ||
      afterKeyword(
        text,
        /(?:logo|logotipo|header|marca)\s*(?:to|a|as|como|:)?\s*(.+)$/i,
      );
    if (logoText && logoText.length <= 80) {
      return { kind: "logo", logoText: logoText.slice(0, 80) };
    }
    return { kind: "help" };
  }

  if (/\b(color|colours|colors|colores|accent)\b/i.test(lower)) {
    for (const row of DEMO_ACCENTS) {
      if (row.id === "template") continue;
      if (
        lower.includes(row.id) ||
        lower.includes(row.label.toLowerCase()) ||
        lower.includes(row.labelEs.toLowerCase())
      ) {
        return { kind: "color", accent: row.id };
      }
    }
    if (/original|template|plantilla|reset|default/.test(lower)) {
      return { kind: "color", accent: "template" };
    }
    return { kind: "help" };
  }

  if (
    /\b(sentence|frase|tagline|lema|add this|agrega esto)\b/i.test(lower)
  ) {
    const extraSentence =
      quotedChunk(text) ||
      afterKeyword(
        text,
        /(?:sentence|frase|tagline|lema|say|diga)\s*(?:to|:)?\s*(.+)$/i,
      );
    if (extraSentence) {
      return { kind: "sentence", extraSentence: extraSentence.slice(0, 240) };
    }
    return { kind: "help" };
  }

  if (/\b(page|página|pagina|about us|sobre nosotros)\b/i.test(lower)) {
    const title =
      quotedChunk(text) ||
      afterKeyword(text, /(?:page|página|pagina)\s+(?:called|titled|named|de|:)\s*(.+)$/i) ||
      "About";
    const extractedBody = afterKeyword(
      text,
      /(?:about|sobre|body|texto)\s*[:—-]\s*(.+)$/i,
    );
    const body =
      extractedBody ||
      `This extra “${title.slice(0, 80)}” page is an idea for the live site. A real extra page is quoted at $75–$150.`;
    return {
      kind: "page",
      title: title.slice(0, 80),
      body: body.slice(0, 800),
    };
  }

  return { kind: "help" };
}

export function buildClientFromLead(
  lead: Lead,
  takenSlugs: string[],
  options: { preview?: boolean; clientId?: string; live?: boolean } = {},
): Client {
  const preview = Boolean(options.preview);
  const logo = lead.demo.logoText.trim();
  const extra = lead.demo.extraSentence.trim();
  const about = [demoAbout(lead), extra].filter(Boolean).join(" ");
  const notes: Client["notes"] = [];
  if (lead.wantsLocalBoost) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: "Asked for optional Local Boost at signup (not paid until checkout completes).",
      createdAt: new Date().toISOString(),
    });
  }
  if (lead.wantsTraffic) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: "Asked for optional Traffic ($199/month) at signup (not paid until checkout completes).",
      createdAt: new Date().toISOString(),
    });
  }
  if (lead.wantsLoud) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: "Asked for optional Loud ($349/month) at signup (not paid until checkout completes).",
      createdAt: new Date().toISOString(),
    });
  }
  if (lead.wantsBusinessEmail) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: "Asked for optional Business Email at signup (not paid until checkout completes).",
      createdAt: new Date().toISOString(),
    });
  }
  if (lead.wantsBookAJob) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: "Asked for optional Book a job at signup (not paid until checkout completes).",
      createdAt: new Date().toISOString(),
    });
  }
  if (lead.wantsMissedCall) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: "Asked for optional missed-call text-back at signup (not paid until checkout completes).",
      createdAt: new Date().toISOString(),
    });
  }
  if (lead.wantsReviewTexts) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: "Asked for optional review texts at signup (not paid until checkout completes).",
      createdAt: new Date().toISOString(),
    });
  }
  if (lead.wantsVoice) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: "Asked for optional voice receptionist at signup (not paid until checkout completes).",
      createdAt: new Date().toISOString(),
    });
  }
  if (!preview) {
    notes.push({
      id: `note_${crypto.randomUUID()}`,
      body: `Created from demo ${demoPath(lead.id)} (${lead.locale}, ${lead.template} template). Preview only until paid.`,
      createdAt: new Date().toISOString(),
    });
  }
  return {
    id: preview
      ? `demo_${lead.id}`
      : options.clientId || `cli_${crypto.randomUUID()}`,
    businessName: lead.businessName,
    slug: preview
      ? `demo-${lead.id.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}`
      : uniqueSlug(lead.businessName, takenSlugs),
    contactName: lead.name,
    email: lead.email,
    phone: demoPhoneOrSample(lead.phone),
    address: demoStreetAddress(lead.template, lead.city),
    city: lead.city || "Phoenix, AZ",
    hours: DEMO_HOURS[lead.template],
    tagline: demoTagline(lead),
    about,
    services: demoServices(lead.template),
    template: lead.template,
    customDomain: null,
    siteStatus: preview || options.live ? "live" : "paused",
    paymentStatus: "unpaid",
    lastPaymentAt: null,
    nextInvoiceAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeBoostSubscriptionId: null,
    localBoost: false,
    stripeTrafficSubscriptionId: null,
    trafficAds: false,
    stripeLoudSubscriptionId: null,
    loudAds: false,
    stripeEmailSubscriptionId: null,
    businessEmail: false,
    bookAJob: Boolean(preview || lead.wantsBookAJob),
    missedCallTextback: false,
    reviewTexts: false,
    voiceReceptionist: false,
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    notes,
    editRequests: [],
    createdAt: lead.createdAt,
    logoText: logo || undefined,
  };
}
