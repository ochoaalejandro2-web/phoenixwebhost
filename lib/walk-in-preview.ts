import { COMPANY, PRICING } from "./config.ts";
import {
  DEMO_HOURS,
  DEMO_SAMPLE_PHONE,
  demoPhoneOrSample,
  demoServices,
  demoStreetAddress,
} from "./demo.ts";
import type { Client, Locale, TemplateId } from "./types.ts";

export const WALK_IN_TYPE_IDS = [
  "salon",
  "restaurant",
  "handyman",
  "contractor",
  "cleaning",
  "shop",
  "other",
] as const;

export type WalkInTypeId = (typeof WALK_IN_TYPE_IDS)[number];

export type WalkInType = {
  id: WalkInTypeId;
  template: TemplateId;
};

export const WALK_IN_TYPES: WalkInType[] = [
  { id: "salon", template: "salon" },
  { id: "restaurant", template: "restaurant" },
  { id: "handyman", template: "handyman" },
  { id: "contractor", template: "contractor" },
  { id: "cleaning", template: "handyman" },
  { id: "shop", template: "professional" },
  { id: "other", template: "professional" },
];

const CLEANING_SERVICES = [
  "House cleaning",
  "Office cleaning",
  "Move-out clean",
  "Weekly service",
  "Deep clean",
  "Windows",
];

const SHOP_SERVICES = [
  "Retail hours",
  "In-store pickup",
  "Local products",
  "Special orders",
  "Gift cards",
  "Customer help",
];

export function parseWalkInType(value: unknown): WalkInTypeId | null {
  const id = String(value || "")
    .trim()
    .toLowerCase();
  return WALK_IN_TYPE_IDS.includes(id as WalkInTypeId)
    ? (id as WalkInTypeId)
    : null;
}

export function walkInTypeSpec(id: WalkInTypeId): WalkInType {
  return WALK_IN_TYPES.find((row) => row.id === id) || WALK_IN_TYPES[0];
}

export function walkInTemplate(id: WalkInTypeId): TemplateId {
  return walkInTypeSpec(id).template;
}

export function walkInServices(id: WalkInTypeId): string[] {
  if (id === "cleaning") return [...CLEANING_SERVICES];
  if (id === "shop" || id === "other") return [...SHOP_SERVICES];
  return demoServices(walkInTemplate(id));
}

export function walkInAbout(
  businessName: string,
  id: WalkInTypeId,
  locale: Locale,
  otherKind = "",
) {
  const city = "Phoenix, AZ";
  const kind = sanitizeWalkInKind(otherKind);
  if (locale === "es") {
    if (id === "cleaning") {
      return `${businessName} es un negocio de limpieza en ${city}. Esta vista parte de una plantilla de Phoenixwebhost y lleva su nombre — no es un diseño a medida nuevo.`;
    }
    if (id === "shop") {
      return `${businessName} es una tienda local en ${city}. Esta vista parte de una plantilla de Phoenixwebhost y lleva su nombre — no es un diseño a medida nuevo.`;
    }
    if (id === "other") {
      const typed = kind || "negocio";
      return `${businessName} es un ${typed} local en ${city}. Esta vista parte de la plantilla de tienda general — no es un diseño a medida nuevo.`;
    }
    return `${businessName} es un negocio local en ${city}. Esta vista parte de una plantilla comprobada de Phoenixwebhost, llena con su nombre — no es un diseño a medida nuevo.`;
  }
  if (id === "cleaning") {
    return `${businessName} is a local cleaning business in ${city}. This preview starts from a Phoenixwebhost template and is filled with your name — not a brand-new custom design.`;
  }
  if (id === "shop") {
    return `${businessName} is a local shop in ${city}. This preview starts from a Phoenixwebhost template and is filled with your name — not a brand-new custom design.`;
  }
  if (id === "other") {
    const typed = kind || "business";
    return `${businessName} is a local ${typed} in ${city}. This preview starts from the general shop template and is filled with your name — not a brand-new custom design.`;
  }
  return `${businessName} is a local ${city} business. This preview starts from a proven Phoenixwebhost template and is filled with your name — not a brand-new custom design.`;
}

export function sanitizeWalkInName(value: unknown) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function sanitizeWalkInKind(value: unknown) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function previewPath(locale: Locale) {
  return locale === "es" ? "/es/preview" : "/preview";
}

export function seeYourSitePath(locale: Locale) {
  return locale === "es" ? "/es/see-your-site" : "/see-your-site";
}

export function previewHref(
  locale: Locale,
  input: { name: string; type: WalkInTypeId; kind?: string },
) {
  const params = new URLSearchParams();
  params.set("name", input.name);
  params.set("type", input.type);
  const kind = sanitizeWalkInKind(input.kind);
  if (input.type === "other" && kind) params.set("kind", kind);
  return `${previewPath(locale)}?${params.toString()}`;
}

export const QUOTED_PICKS = ["ordering", "page", "photos", "spanish"] as const;
export type QuotedPick = (typeof QUOTED_PICKS)[number];

export function parseQuotedPicks(
  value: string | string[] | undefined | null,
): QuotedPick[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  const parts = raw.flatMap((item) =>
    String(item)
      .split(",")
      .map((part) => part.trim().toLowerCase()),
  );
  return QUOTED_PICKS.filter((key) => parts.includes(key));
}

export function walkInRequestHref(
  locale: Locale,
  input: {
    businessName: string;
    type: WalkInTypeId;
    kind?: string;
    ads?: string;
    extras?: string[];
    quoted?: QuotedPick[];
  },
) {
  const params = new URLSearchParams();
  params.set("business", input.businessName);
  params.set("template", walkInTemplate(input.type));
  const kind = sanitizeWalkInKind(input.kind);
  if (input.type === "other" && kind) params.set("other", kind);
  if (input.ads && input.ads !== "none") params.set("ads", input.ads);
  if (input.extras?.length) params.set("extra", input.extras.join(","));
  if (input.quoted?.length) params.set("quoted", input.quoted.join(","));
  const path = locale === "es" ? "/es/request" : "/request";
  return `${path}?${params.toString()}`;
}

export function otherTypeNote(kind: string, locale: Locale) {
  const typed = sanitizeWalkInKind(kind);
  if (!typed) return "";
  return locale === "es"
    ? `Otro tipo de negocio (escrito): ${typed}. No es una de las plantillas de la lista — a medida.`
    : `Other business type (typed): ${typed}. Not one of the listed templates — custom.`;
}

export function quotedMessageNote(quoted: QuotedPick[], locale: Locale) {
  if (!quoted.length) return "";
  const labelsEn: Record<QuotedPick, string> = {
    ordering: `pickup ordering add-on (${PRICING.orderSetupLabel} setup + ${PRICING.orderMonthlyLabel}/month, card fees about ${PRICING.orderFeeNote})`,
    page: `extra page (${PRICING.extraPageLabel})`,
    photos: "custom photos (quoted)",
    spanish: "Spanish on the live site (quoted)",
  };
  const labelsEs: Record<QuotedPick, string> = {
    ordering: `complemento de pedidos para recoger (${PRICING.orderSetupLabel} de setup + ${PRICING.orderMonthlyLabel} al mes, comisiones de tarjeta unos ${PRICING.orderFeeNote})`,
    page: `página extra (${PRICING.extraPageLabel})`,
    photos: "fotos a medida (se cotiza)",
    spanish: "español en el sitio (se cotiza)",
  };
  const labels = locale === "es" ? labelsEs : labelsEn;
  const list = quoted.map((key) => labels[key]).join("; ");
  return locale === "es"
    ? `También preguntaron por: ${list}.`
    : `Also asked about: ${list}.`;
}

export function buildWalkInPreviewClient(input: {
  businessName: string;
  type: WalkInTypeId;
  locale: Locale;
  kind?: string;
}): Client {
  const name = sanitizeWalkInName(input.businessName) || "Your business";
  const spec = walkInTypeSpec(input.type);
  const about = walkInAbout(name, input.type, input.locale, input.kind);
  return {
    id: "demo_walkin",
    businessName: name,
    slug: "demo-walkin",
    contactName: name,
    email: "",
    phone: demoPhoneOrSample(""),
    address: demoStreetAddress(spec.template, "Phoenix, AZ"),
    city: "Phoenix, AZ",
    hours: DEMO_HOURS[spec.template],
    tagline:
      input.locale === "es"
        ? `${name} en Phoenix, AZ`
        : `${name} in Phoenix, AZ`,
    about,
    services: walkInServices(input.type),
    template: spec.template,
    customDomain: null,
    siteStatus: "live",
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
    bookAJob: true,
    missedCallTextback: false,
    reviewTexts: false,
    voiceReceptionist: false,
    domainRegister: false,
    closerCode: null,
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    notes: [],
    editRequests: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    logoText: name,
  };
}

export function walkInSamplePhone() {
  return DEMO_SAMPLE_PHONE;
}

export function walkInStudioPhone() {
  return COMPANY.phone;
}
