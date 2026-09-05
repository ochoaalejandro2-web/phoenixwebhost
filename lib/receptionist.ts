import { HOLA_TAX_SLUG } from "./client-themes.ts";
import { COMPANY, PRICING } from "./config.ts";
import { displayHours } from "./demo.ts";
import {
  holaTaxAbout,
  holaTaxBookkeepingPriceText,
  holaTaxServiceLabel,
  holaTaxTagline,
  withHolaTaxListedServices,
} from "./hola-tax-i18n.ts";
import { normalizeSearchText } from "./public-demos.ts";
import { serviceBlurb, serviceName } from "./shop-content.ts";
import { siteSupportsI18n } from "./site-locale.ts";
import type { Client, Locale } from "./types.ts";

export const STUDIO_SITE = "studio";
export const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
export const GATEWAY_MODEL = "minimax/minimax-m3-free";

export type ReceptionistKind = "studio" | "client";

export type ReceptionistFacts = {
  kind: ReceptionistKind;
  businessName: string;
  phone: string;
  hours: string;
  address: string;
  city: string;
  tagline: string;
  about: string;
  services: string[];
  /** English (or stored) names used for matching, even when the reply is Spanish. */
  serviceKeys: string[];
  listedPrices: string[];
  /** Extra match text for Hola Tax bookkeeping (QuickBooks Online, etc.). */
  serviceMatchExtra: string;
  locale: Locale;
  contactHint: string;
};

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type GatewayFetch = (
  url: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  },
) => Promise<{
  ok: boolean;
  status?: number;
  json: () => Promise<unknown>;
}>;

const STOP = new Set([
  "do",
  "you",
  "we",
  "the",
  "a",
  "an",
  "for",
  "and",
  "or",
  "are",
  "is",
  "can",
  "does",
  "did",
  "what",
  "when",
  "where",
  "how",
  "your",
  "our",
  "me",
  "my",
  "please",
  "about",
  "with",
  "from",
  "this",
  "that",
  "have",
  "has",
  "any",
  "will",
  "would",
  "could",
  "should",
  "they",
  "not",
  "dont",
  "want",
  "need",
  "looking",
  "get",
  "got",
  "also",
  "just",
  "kind",
  "type",
  "some",
  "offer",
  "offers",
  "offering",
  "provide",
  "provides",
  "service",
  "services",
  "work",
  "job",
  "jobs",
  "hello",
  "hi",
  "hey",
  "thanks",
  "thank",
  "hola",
  "gracias",
  "por",
  "para",
  "una",
  "uno",
  "los",
  "las",
  "del",
  "con",
  "sin",
  "haces",
  "hace",
  "hacen",
  "tienen",
  "tiene",
  "ustedes",
  "usted",
  "quiero",
  "ofrecen",
  "ofrece",
  "tambien",
  "algo",
]);

const PRICE_RE =
  /\$\d[\d,]*(?:\.\d+)?(?:\s*[–-]\s*\$?\d[\d,]*(?:\.\d+)?)?/g;

export function extractListedPrices(...parts: string[]): string[] {
  const found = parts.join(" ").match(PRICE_RE) ?? [];
  return [...new Set(found)];
}

function studioServices(locale: Locale): string[] {
  if (locale === "es") {
    return [
      `Sitios para negocios pequeños — ${PRICING.setupLabel} de lanzamiento + ${PRICING.monthlyLabel} al mes`,
      "Recepcionista de IA incluida en cada sitio (no es un extra)",
      "SEO local básico incluido — configuración y visibilidad, no anuncios de pago ni garantías de posición",
      "Hospedaje, SSL, copias de seguridad y vigilancia de actividad",
      `Hasta ${PRICING.includedEditMinutes} minutos de cambios pequeños al mes, o ${PRICING.includedEditRequests} solicitudes pequeñas`,
      "Un formulario de contacto",
    ];
  }
  return [
    `Small-business websites — ${PRICING.setupLabel} to launch + ${PRICING.monthlyLabel}/month`,
    "AI receptionist included on every site (not an extra)",
    "Basic local SEO included — setup and visibility, not paid ads or ranking guarantees",
    "Hosting, SSL, backups, and uptime watch",
    `Up to ${PRICING.includedEditMinutes} minutes of small edits per month, or ${PRICING.includedEditRequests} small requests`,
    "One contact form",
  ];
}

function studioPrices(locale: Locale): string[] {
  if (locale === "es") {
    return [
      `${PRICING.setupLabel} de lanzamiento`,
      `${PRICING.monthlyLabel} al mes para mantenerlo en línea`,
      `Local Boost opcional ${PRICING.boostSetupLabel} + ${PRICING.boostMonthlyLabel} al mes`,
      `Traffic opcional ${PRICING.trafficMonthlyLabel} al mes`,
      `Loud opcional ${PRICING.loudMonthlyLabel} al mes`,
      `Business Email opcional ${PRICING.emailSetupLabel} + ${PRICING.emailMonthlyLabel} al mes`,
      `Página extra $${PRICING.extraPageMin}–$${PRICING.extraPageMax}`,
      `Logotipo $${PRICING.logoMin}–$${PRICING.logoMax}`,
    ];
  }
  return [
    `${PRICING.setupLabel} to launch`,
    `${PRICING.monthlyLabel}/month to stay live`,
    `Optional Local Boost ${PRICING.boostSetupLabel} + ${PRICING.boostMonthlyLabel}/month`,
    `Optional Traffic ${PRICING.trafficMonthlyLabel}/month`,
    `Optional Loud ${PRICING.loudMonthlyLabel}/month`,
    `Optional Business Email ${PRICING.emailSetupLabel} + ${PRICING.emailMonthlyLabel}/month`,
    `Extra page $${PRICING.extraPageMin}–$${PRICING.extraPageMax}`,
    `Logo $${PRICING.logoMin}–$${PRICING.logoMax}`,
  ];
}

export function buildStudioFacts(locale: Locale = "en"): ReceptionistFacts {
  const services = studioServices(locale);
  return {
    kind: "studio",
    businessName: COMPANY.legalName,
    phone: COMPANY.phone,
    hours: "",
    address: "",
    city: COMPANY.city,
    tagline:
      locale === "es"
        ? "Sitios claros para negocios pequeños en Arizona."
        : "Straightforward websites for Arizona small businesses.",
    about:
      locale === "es"
        ? `${COMPANY.legalName} hace sitios para negocios pequeños en Arizona. ${PRICING.setupLabel} para lanzar, ${PRICING.monthlyLabel} al mes para mantenerlo en línea. Cada sitio incluye una recepcionista de IA y SEO local básico (configuración y visibilidad — no anuncios de pago ni garantías de posición). Local Boost, Traffic y Loud son anuncios de pago opcionales. Business Email es opcional. Llame al ${COMPANY.phone} o pida una demo en phoenixwebhost.com.`
        : `${COMPANY.legalName} builds websites for Arizona small businesses. ${PRICING.setupLabel} to launch, ${PRICING.monthlyLabel}/month to keep it live. Every site includes an AI receptionist and basic local SEO (setup and visibility — not paid ads or ranking guarantees). Local Boost, Traffic, and Loud are optional paid ads. Business Email is optional. Call ${COMPANY.phone} or request a demo at phoenixwebhost.com.`,
    services,
    serviceKeys: studioServices("en"),
    listedPrices: studioPrices(locale),
    serviceMatchExtra: "",
    locale,
    contactHint:
      locale === "es"
        ? `Pida una demo en phoenixwebhost.com o llame al ${COMPANY.phone}.`
        : `Request a demo at phoenixwebhost.com or call ${COMPANY.phone}.`,
  };
}

function clientServiceKeys(client: Client): string[] {
  const raw =
    client.slug === HOLA_TAX_SLUG
      ? withHolaTaxListedServices(client.services)
      : [...client.services];
  return raw.filter(Boolean);
}

function clientServiceLabels(client: Client, locale: Locale): string[] {
  const keys = clientServiceKeys(client);
  if (client.slug === HOLA_TAX_SLUG || client.template === "tax") {
    return keys.map((name) => holaTaxServiceLabel(name, locale));
  }
  return keys.map((name) => serviceName(name, locale));
}

export function buildClientFacts(
  client: Client,
  locale: Locale = "en",
): ReceptionistFacts {
  const bilingual = siteSupportsI18n(client.slug, client.template);
  const useLocale = bilingual ? locale : "en";
  const keys = clientServiceKeys(client);
  const services = clientServiceLabels(client, useLocale);
  const hours = displayHours(client.hours, client.template, useLocale);
  const tagline =
    client.slug === HOLA_TAX_SLUG
      ? holaTaxTagline(client.tagline, useLocale)
      : client.tagline;
  const about =
    client.slug === HOLA_TAX_SLUG
      ? holaTaxAbout(client.about, useLocale)
      : client.about;
  const phone = String(client.phone || "").trim();
  return {
    kind: "client",
    businessName: client.businessName,
    phone,
    hours,
    address: client.address.trim(),
    city: client.city.trim(),
    tagline,
    about,
    services,
    serviceKeys: keys,
    listedPrices: extractListedPrices(
      tagline,
      about,
      ...keys,
      ...services,
      ...(client.slug === HOLA_TAX_SLUG
        ? [holaTaxBookkeepingPriceText(useLocale)]
        : []),
    ),
    serviceMatchExtra:
      client.slug === HOLA_TAX_SLUG
        ? holaTaxBookkeepingPriceText(useLocale)
        : "",
    locale: useLocale,
    contactHint:
      useLocale === "es"
        ? phone
          ? `Use el formulario de contacto en este sitio o llame al ${phone}.`
          : "Use el formulario de contacto en este sitio."
        : phone
          ? `Use the contact form on this site or call ${phone}.`
          : "Use the contact form on this site.",
  };
}

function significantTokens(text: string): string[] {
  return normalizeSearchText(text)
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP.has(token));
}

function haystackHits(haystack: string, tokens: string[]): string[] {
  const hay = normalizeSearchText(haystack);
  const words = hay.split(/\s+/).filter(Boolean);
  return tokens.filter((token) => {
    if (hay.includes(token)) return true;
    return words.some(
      (word) =>
        word.startsWith(token) ||
        token.startsWith(word) ||
        (token.length >= 4 && word.includes(token)) ||
        (word.length >= 4 && token.includes(word)),
    );
  });
}

export function matchListedServices(
  facts: ReceptionistFacts,
  message: string,
): string[] {
  const tokens = significantTokens(message);
  if (tokens.length === 0) return [];
  const matched: string[] = [];
  facts.services.forEach((label, index) => {
    const key = facts.serviceKeys[index] || label;
    const extra = [
      serviceBlurb(key, "en"),
      serviceBlurb(key, "es"),
      /bookkeeping/i.test(key) ? facts.serviceMatchExtra : "",
    ]
      .filter(Boolean)
      .join(" ");
    const hay = [label, key, extra].join(" ");
    if (haystackHits(hay, tokens).length > 0) matched.push(label);
  });
  return [...new Set(matched)];
}

const ES_SIGNAL =
  /[áéíóúñ¿¡]|(\b(hola|gracias|horario|tel[eé]fono|ustedes|hacen|ofrecen|c[eé]sped|impuestos|sitio|cu[aá]nto|precio|cita)\b)/i;

export function replyLocale(facts: ReceptionistFacts, message: string): Locale {
  if (ES_SIGNAL.test(message)) return "es";
  if (
    /\b(hours|phone|call|lawn|lawns|llc|price|book|appointment|website)\b/i.test(
      message,
    )
  ) {
    return "en";
  }
  return facts.locale;
}

function looksLikeWebsiteBuy(message: string): boolean {
  return /phoenixwebhost|web ?design|dise[nñ]o web|sitio web|p[aá]gina web|buy (a )?website|build (me )?(a )?website|want a website|necesito (un )?sitio/i.test(
    message,
  );
}

function looksLikeHours(q: string, message: string): boolean {
  return (
    /\b(hours|horario|open|abierto|abren|cerrado|closed)\b/.test(q) ||
    /what time|a qu[eé] hora/i.test(message)
  );
}

function looksLikePhone(q: string): boolean {
  return /\b(phone|number|llamar|llame|telefono|tel[eé]fono|call)\b/.test(q);
}

function looksLikeArea(q: string): boolean {
  return /\b(where|address|area|city|ciudad|direccion|direcci[oó]n|ubicaci[oó]n|location|serve|phoenix|arizona)\b/.test(
    q,
  );
}

function looksLikePrice(q: string, message: string): boolean {
  return (
    /\b(price|prices|cost|quote|estimate|how much|cuanto|precio|precios|cotiz)\b/.test(
      q,
    ) || /cu[aá]nto/i.test(message)
  );
}

function looksLikeBook(q: string): boolean {
  return /\b(book|booking|appointment|schedule|contact|cita|agendar|reservar|mensaje|message)\b/.test(
    q,
  );
}

function looksLikeServiceQuestion(q: string, message: string): boolean {
  return (
    /\b(do you|does you|offer|have|hacen|hace|tienen|ofrecen|llc|lawn|lawns|cesped|c[eé]sped|bookkeeping|contabilidad|quickbooks)\b/.test(
      q,
    ) || /do you do|ustedes (hacen|ofrecen)/i.test(message)
  );
}

function looksLikeIncluded(q: string): boolean {
  return /\b(included|incluye|receptionist|recepcionista|what do i get|package|paquete|seo)\b/.test(
    q,
  );
}

function looksLikeUnavailable(text: string): boolean {
  return /unavailable|not available right now|i cannot (help|answer)|error occurred|algo sali[oó] mal|no disponib/i.test(
    text,
  );
}

function listPhrase(items: string[], locale: Locale): string {
  if (items.length === 0) return locale === "es" ? "nada listado" : "none listed";
  if (items.length === 1) return items[0];
  if (locale === "es") {
    return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
  }
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function websiteBuyReply(locale: Locale): string {
  return locale === "es"
    ? `${COMPANY.legalName} hace sitios para negocios pequeños: ${PRICING.setupLabel} de lanzamiento + ${PRICING.monthlyLabel} al mes, con recepcionista de IA incluida. Vea phoenixwebhost.com o llame al ${COMPANY.phone}.`
    : `${COMPANY.legalName} builds small-business websites for ${PRICING.setupLabel} to launch + ${PRICING.monthlyLabel}/month, with an AI receptionist included. See phoenixwebhost.com or call ${COMPANY.phone}.`;
}

export function fallbackAnswer(facts: ReceptionistFacts, raw: string): string {
  const message = raw.replace(/\s+/g, " ").trim();
  const locale = replyLocale(facts, message);
  const q = normalizeSearchText(message);

  if (!message) {
    return locale === "es"
      ? `Hola — soy la recepcionista de ${facts.businessName}. Puedo hablar de servicios, horario y cómo contactarnos.`
      : `Hi — I am the receptionist for ${facts.businessName}. I can help with services, hours, and how to get in touch.`;
  }

  if (facts.kind === "client" && looksLikeWebsiteBuy(message)) {
    return websiteBuyReply(locale);
  }

  if (facts.kind === "studio" && looksLikeIncluded(q)) {
    return locale === "es"
      ? `El sitio es ${PRICING.setupLabel} de lanzamiento + ${PRICING.monthlyLabel} al mes. La recepcionista de IA y el SEO local básico van incluidos — configuración y visibilidad, no anuncios de pago ni garantías de posición. Local Boost, Traffic y Loud son anuncios de pago opcionales. ${facts.contactHint}`
      : `The website is ${PRICING.setupLabel} to launch + ${PRICING.monthlyLabel}/month. The AI receptionist and basic local SEO are included — setup and visibility, not paid ads or ranking guarantees. Local Boost, Traffic, and Loud are optional paid ads. ${facts.contactHint}`;
  }

  if (looksLikeHours(q, message)) {
    if (facts.hours.trim()) {
      return locale === "es"
        ? `${facts.businessName} atiende ${facts.hours}. ${facts.contactHint}`
        : `${facts.businessName} hours are ${facts.hours}. ${facts.contactHint}`;
    }
    return locale === "es"
      ? `Este sitio no lista un horario. ${facts.contactHint}`
      : `This site does not list hours. ${facts.contactHint}`;
  }

  if (looksLikePhone(q)) {
    if (facts.phone) {
      return locale === "es"
        ? `El teléfono de ${facts.businessName} es ${facts.phone}.`
        : `The phone for ${facts.businessName} is ${facts.phone}.`;
    }
    return locale === "es"
      ? `Este sitio no lista un teléfono. Use el formulario de contacto.`
      : `This site does not list a phone number. Use the contact form.`;
  }

  if (looksLikePrice(q, message)) {
    if (facts.listedPrices.length > 0) {
      return locale === "es"
        ? `En este sitio aparecen estos precios: ${listPhrase(facts.listedPrices, "es")}. Si necesita una cotización, ${facts.contactHint}`
        : `Prices listed on this site: ${listPhrase(facts.listedPrices, "en")}. For a quote, ${facts.contactHint}`;
    }
    return locale === "es"
      ? `${facts.businessName} no lista un precio para eso en este sitio. No inventamos tarifas. ${facts.contactHint}`
      : `${facts.businessName} does not list a price for that on this site. We do not invent rates. ${facts.contactHint}`;
  }

  if (looksLikeArea(q)) {
    const place = [facts.address, facts.city].filter(Boolean).join(", ");
    if (place) {
      return locale === "es"
        ? `${facts.businessName} está en ${place}. ${facts.contactHint}`
        : `${facts.businessName} is in ${place}. ${facts.contactHint}`;
    }
    return locale === "es"
      ? `${facts.businessName} atiende negocios en Arizona. ${facts.contactHint}`
      : `${facts.businessName} serves Arizona small businesses. ${facts.contactHint}`;
  }

  if (looksLikeBook(q)) {
    return locale === "es"
      ? `Para reservar o escribir, ${facts.contactHint}`
      : `To book or get in touch, ${facts.contactHint}`;
  }

  const matched = matchListedServices(facts, message);
  if (matched.length > 0) {
    return locale === "es"
      ? `Sí — ${facts.businessName} lista ${listPhrase(matched, "es")}. ${facts.contactHint}`
      : `Yes — ${facts.businessName} lists ${listPhrase(matched, "en")}. ${facts.contactHint}`;
  }

  if (looksLikeServiceQuestion(q, message) || looksLikeIncluded(q)) {
    if (facts.services.length === 0) {
      return locale === "es"
        ? `Este sitio no lista ese servicio. ${facts.contactHint}`
        : `This site does not list that service. ${facts.contactHint}`;
    }
    return locale === "es"
      ? `Eso no aparece en la lista de este sitio. ${facts.businessName} ofrece ${listPhrase(facts.services, "es")}. ${facts.contactHint}`
      : `That is not on this site’s list. ${facts.businessName} offers ${listPhrase(facts.services, "en")}. ${facts.contactHint}`;
  }

  const serviceLine =
    facts.services.length > 0
      ? locale === "es"
        ? ` Servicios listados: ${listPhrase(facts.services, "es")}.`
        : ` Listed services: ${listPhrase(facts.services, "en")}.`
      : "";
  const hoursLine = facts.hours.trim()
    ? locale === "es"
      ? ` Horario: ${facts.hours}.`
      : ` Hours: ${facts.hours}.`
    : "";
  return locale === "es"
    ? `${facts.businessName}: ${facts.tagline || facts.about.slice(0, 160)}.${serviceLine}${hoursLine} ${facts.contactHint}`
    : `${facts.businessName}: ${facts.tagline || facts.about.slice(0, 160)}.${serviceLine}${hoursLine} ${facts.contactHint}`;
}

export function factsPrompt(facts: ReceptionistFacts): string {
  const prices =
    facts.listedPrices.length > 0
      ? facts.listedPrices.join("; ")
      : "None listed — do not invent a price.";
  const hours = facts.hours.trim() || "Not listed — do not invent hours.";
  const phone = facts.phone || "Not listed.";
  const place = [facts.address, facts.city].filter(Boolean).join(", ") || "Not listed.";
  const extras =
    facts.kind === "studio"
      ? [
          "You represent Phoenixwebhost Inc., the website studio.",
          "The AI receptionist is INCLUDED in the $200 launch + $69/month website. It is not a $49 add-on.",
          "Basic local SEO is INCLUDED: Google-friendly site structure, business info (name, address, phone), contact, mobile-ready pages, and help with Google Business Profile basics. Setup and visibility only — not paid ads and not a ranking guarantee.",
          "Never say customers get free Facebook ads or free Google ads with the base plan. Local Boost, Traffic, and Loud are optional paid ads.",
          "Optional paid extras are Local Boost, Traffic, Loud, and Business Email only.",
          "Public studio phone is (480) 953-2393. Do not give a personal owner name.",
        ]
      : [
          `You represent ${facts.businessName} only — stay in character as that shop’s receptionist.`,
          "Use this business’s phone, not Phoenixwebhost’s, unless they ask how to buy a website.",
          "If they ask to buy a website or mention Phoenixwebhost, you may point them to phoenixwebhost.com and (480) 953-2393.",
          "If they ask about this local business, stay in character.",
        ];
  return [
    `You are the on-site receptionist for ${facts.businessName}.`,
    `Reply in ${facts.locale === "es" ? "Spanish" : "English"} unless the visitor writes in the other language — then follow the visitor.`,
    "Answer only from the facts below. Do not invent services, prices, hours, or claims.",
    "If they want a quote and no price is listed, point to the contact form and the phone below.",
    "Keep replies short (2–5 sentences). Never say you are unavailable, offline, or that an error occurred.",
    ...extras,
    "",
    `Business: ${facts.businessName}`,
    `Tagline: ${facts.tagline}`,
    `About: ${facts.about}`,
    `Services: ${facts.services.join("; ") || "None listed."}`,
    facts.serviceMatchExtra
      ? `Bookkeeping (this shop only): ${facts.serviceMatchExtra}`
      : "",
    `Listed prices: ${prices}`,
    `Hours: ${hours}`,
    `Phone: ${phone}`,
    `Location: ${place}`,
    `How to contact: ${facts.contactHint}`,
  ].join("\n");
}

export function gatewayAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

export async function callGateway(input: {
  token: string;
  messages: { role: string; content: string }[];
  fetchImpl?: GatewayFetch;
}): Promise<string | null> {
  const token = input.token.trim();
  if (!token) return null;
  const fetchFn = input.fetchImpl ?? fetch;
  try {
    const res = await fetchFn(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: gatewayAuthHeader(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GATEWAY_MODEL,
        messages: input.messages,
        temperature: 0.2,
        max_tokens: 420,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim() || "";
    if (!text || looksLikeUnavailable(text)) return null;
    return text.slice(0, 1200);
  } catch {
    return null;
  }
}

export async function answerReceptionist(input: {
  facts: ReceptionistFacts;
  message: string;
  history?: ChatTurn[];
  oidcToken?: string | null;
  fetchImpl?: GatewayFetch;
}): Promise<{ reply: string; source: "gateway" | "facts" }> {
  const fallback = fallbackAnswer(input.facts, input.message);
  const token = (input.oidcToken ?? process.env.VERCEL_OIDC_TOKEN ?? "").trim();
  if (!token) {
    return { reply: fallback, source: "facts" };
  }
  const history = (input.history ?? [])
    .filter(
      (turn) =>
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.content === "string" &&
        turn.content.trim(),
    )
    .slice(-8)
    .map((turn) => ({
      role: turn.role,
      content: turn.content.trim().slice(0, 800),
    }));
  const gateway = await callGateway({
    token,
    fetchImpl: input.fetchImpl,
    messages: [
      { role: "system", content: factsPrompt(input.facts) },
      ...history,
      { role: "user", content: input.message.trim().slice(0, 500) },
    ],
  });
  if (gateway) {
    return { reply: gateway, source: "gateway" };
  }
  return { reply: fallback, source: "facts" };
}

export const receptionistUi = {
  en: {
    title: "Ask us",
    kicker: "Included receptionist",
    open: "Chat",
    close: "Close chat",
    send: "Send",
    placeholder: "Ask about services, hours, or how to book…",
    studioLead:
      "Questions about a Phoenixwebhost website? The AI receptionist is included in the $200 + $69 plan — not an extra.",
    clientLead: (name: string) =>
      `Questions about ${name}? I answer from this site — services, hours, and the phone listed here.`,
  },
  es: {
    title: "Pregúntenos",
    kicker: "Recepcionista incluida",
    open: "Chat",
    close: "Cerrar chat",
    send: "Enviar",
    placeholder: "Pregunte por servicios, horario o cómo contactarnos…",
    studioLead:
      "¿Preguntas sobre un sitio de Phoenixwebhost? La recepcionista de IA va incluida en el plan de $200 + $69 — no es un extra.",
    clientLead: (name: string) =>
      `¿Preguntas sobre ${name}? Respondo con lo que dice este sitio: servicios, horario y teléfono.`,
  },
} as const;
