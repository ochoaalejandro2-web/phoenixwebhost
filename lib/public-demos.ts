import { walkInDisplayHost } from "./walk-in-hosts.ts";
import type { Locale, TemplateId } from "./types.ts";

export type PublicDemo = {
  slug: string;
  name: string;
  city: string;
  template: TemplateId;
  /** In-app route that already serves this live demo. */
  href: string;
  /** Public host shown in the result (subdomain or custom domain). */
  hostLabel: string;
  services: string[];
};

const TEMPLATE_IDS: TemplateId[] = [
  "contractor",
  "handyman",
  "salon",
  "restaurant",
  "professional",
  "landscaping",
  "tax",
];

const TEMPLATE_LABELS: Record<TemplateId, { en: string; es: string }> = {
  contractor: { en: "Contractor & trades", es: "Contratista y oficios" },
  handyman: { en: "Handyman", es: "Manitas y reparaciones" },
  salon: { en: "Salon & beauty", es: "Salón y belleza" },
  restaurant: { en: "Restaurant & cafe", es: "Restaurante y café" },
  professional: { en: "Professional services", es: "Servicios profesionales" },
  landscaping: { en: "Landscaping & yards", es: "Jardinería y patios" },
  tax: { en: "Tax office", es: "Oficina de impuestos" },
};

function demoHref(slug: string) {
  return `/s/${slug}`;
}

function demoHost(slug: string) {
  return walkInDisplayHost(slug, `${slug}.phoenixwebhost.com`);
}

/**
 * Marketing demo starting points that already exist in this repo.
 * Sample layouts (Palo Verde, Ironwood) are labeled as such on the live site.
 */
export const PUBLIC_DEMOS: PublicDemo[] = [
  {
    slug: "desert-peak-roofing",
    name: "Desert Peak Roofing",
    city: "Tempe, AZ",
    template: "contractor",
    href: demoHref("desert-peak-roofing"),
    hostLabel: demoHost("desert-peak-roofing"),
    services: [
      "Roof replacement",
      "Leak repair",
      "Tile and shingle",
      "Free inspections",
    ],
  },
  {
    slug: "ironwood-handyman",
    name: "Ironwood Handyman",
    city: "Avondale, AZ",
    template: "handyman",
    href: demoHref("ironwood-handyman"),
    hostLabel: demoHost("ironwood-handyman"),
    services: [
      "Home repairs",
      "Drywall",
      "Interior painting",
      "Fixture install",
      "Odd jobs",
    ],
  },
  {
    slug: "casa-luna-salon",
    name: "Casa Luna Salon",
    city: "Scottsdale, AZ",
    template: "salon",
    href: demoHref("casa-luna-salon"),
    hostLabel: demoHost("casa-luna-salon"),
    services: ["Color", "Cuts", "Blowouts", "Bridal styling"],
  },
  {
    slug: "mesa-street-kitchen",
    name: "Mesa Street Kitchen",
    city: "Mesa, AZ",
    template: "restaurant",
    href: demoHref("mesa-street-kitchen"),
    hostLabel: demoHost("mesa-street-kitchen"),
    services: ["Lunch plates", "Dinner", "Patio", "Catering trays"],
  },
  {
    slug: "palo-verde-yards",
    name: "Palo Verde Yards",
    city: "Phoenix, AZ",
    template: "landscaping",
    href: demoHref("palo-verde-yards"),
    hostLabel: demoHost("palo-verde-yards"),
    services: [
      "Desert landscaping",
      "Lawn care",
      "Drip irrigation",
      "Rock and gravel yards",
    ],
  },
  {
    slug: "hola-tax-service",
    name: "Hola Tax Service LLC",
    city: "Phoenix, AZ",
    template: "tax",
    href: demoHref("hola-tax-service"),
    hostLabel: "www.hola-tax-service.com",
    services: [
      "Personal tax preparation",
      "Small-business tax preparation",
      "Arizona LLC formation",
      "ITIN applications",
      "Bookkeeping",
      "Year-round tax support",
    ],
  },
];

/** Obvious trade synonyms so a phone search finds the matching demo. */
export const TEMPLATE_SYNONYMS: Record<TemplateId, string[]> = {
  contractor: [
    "contractor",
    "contractors",
    "trades",
    "trade",
    "roofing",
    "roof",
    "roofer",
    "roofs",
    "hvac",
    "plumbing",
    "plumber",
    "job site",
    "jobsite",
    "tile",
    "shingle",
    "leak",
    "contratista",
    "contratistas",
    "oficios",
    "techo",
    "techos",
    "techado",
    "techados",
    "plomeria",
    "plomería",
  ],
  handyman: [
    "handyman",
    "handymen",
    "handy man",
    "handy",
    "repair",
    "repairs",
    "home repair",
    "home repairs",
    "fixer",
    "fixers",
    "drywall",
    "painting",
    "painter",
    "paint",
    "odd jobs",
    "odd job",
    "fixtures",
    "fixture",
    "punch list",
    "manitas",
    "manita",
    "reparaciones",
    "reparacion",
    "reparación",
    "arreglos",
    "arreglo",
    "tablaroca",
    "yeso",
    "pintura",
    "pintor",
    "trabajos varios",
    "trabajo varios",
    "mantenimiento",
    "accesorios",
  ],
  salon: [
    "salon",
    "salón",
    "salons",
    "beauty",
    "hair",
    "hairs",
    "haircut",
    "haircuts",
    "nails",
    "nail",
    "spa",
    "color",
    "cuts",
    "blowout",
    "blowouts",
    "bridal",
    "belleza",
    "cabello",
    "pelo",
    "uñas",
    "unas",
    "manicure",
    "pedicure",
  ],
  restaurant: [
    "restaurant",
    "restaurants",
    "cafe",
    "café",
    "food",
    "taco",
    "tacos",
    "menu",
    "menú",
    "kitchen",
    "brunch",
    "dinner",
    "lunch",
    "plates",
    "catering",
    "restaurante",
    "restaurantes",
    "comida",
    "cocina",
  ],
  professional: [
    "professional",
    "professionals",
    "office",
    "offices",
    "consulting",
    "consultant",
    "insurance",
    "bookkeeping",
    "bookkeeper",
    "paperwork",
    "accounting",
    "profesional",
    "profesionales",
    "oficina",
    "oficinas",
    "contabilidad",
    "seguros",
    "consultoria",
    "consultoría",
  ],
  landscaping: [
    "landscaping",
    "landscape",
    "landscaper",
    "landscapers",
    "yard",
    "yards",
    "lawn",
    "lawns",
    "garden",
    "gardens",
    "irrigation",
    "drip",
    "desert",
    "cactus",
    "gravel",
    "plants",
    "jardineria",
    "jardinería",
    "jardinero",
    "jardín",
    "jardin",
    "patios",
    "patio",
    "cesped",
    "césped",
    "riego",
  ],
  tax: [
    "tax",
    "taxes",
    "taxoffice",
    "bookkeeping",
    "bookkeeper",
    "itin",
    "w2",
    "w-2",
    "1099",
    "accountant",
    "accounting",
    "impuestos",
    "impuesto",
    "contabilidad",
    "contador",
    "oficina",
  ],
};

export function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function searchTokens(query: string) {
  return normalizeSearchText(query).split(/\s+/).filter(Boolean);
}

export function demoSearchText(demo: PublicDemo) {
  const labels = TEMPLATE_LABELS[demo.template];
  return normalizeSearchText(
    [
      demo.name,
      demo.city,
      demo.slug,
      demo.hostLabel,
      demo.template,
      labels.en,
      labels.es,
      ...demo.services,
      ...TEMPLATE_SYNONYMS[demo.template],
    ].join(" "),
  );
}

export function templateSearchText(template: TemplateId) {
  const labels = TEMPLATE_LABELS[template];
  return normalizeSearchText(
    [template, labels.en, labels.es, ...TEMPLATE_SYNONYMS[template]].join(" "),
  );
}

function matchesTokens(haystack: string, tokens: string[]) {
  return tokens.every((token) => haystack.includes(token));
}

function synonymScore(demo: PublicDemo, tokens: string[]) {
  const synonyms = normalizeSearchText(TEMPLATE_SYNONYMS[demo.template].join(" "));
  return tokens.every((token) => synonyms.includes(token)) ? 0 : 1;
}

export function filterPublicDemos(query: string): PublicDemo[] {
  const tokens = searchTokens(query);
  if (tokens.length === 0) return PUBLIC_DEMOS;
  return PUBLIC_DEMOS.filter((demo) =>
    matchesTokens(demoSearchText(demo), tokens),
  ).sort((a, b) => synonymScore(a, tokens) - synonymScore(b, tokens));
}

export function filterTemplates(query: string): TemplateId[] {
  const tokens = searchTokens(query);
  const ids = TEMPLATE_IDS;
  if (tokens.length === 0) return ids;
  const matchedDemos = new Set(
    filterPublicDemos(query).map((demo) => demo.template),
  );
  return ids.filter(
    (id) => matchedDemos.has(id) || matchesTokens(templateSearchText(id), tokens),
  );
}

export function demoForTemplate(template: TemplateId): PublicDemo | undefined {
  return PUBLIC_DEMOS.find((demo) => demo.template === template);
}

export function templateLabelForDemo(demo: PublicDemo, locale: Locale) {
  return TEMPLATE_LABELS[demo.template][locale];
}
