import { requestPath } from "./i18n.ts";
import type { Locale } from "./types.ts";

export const PACKAGE_IDS = ["starter", "pro", "premium"] as const;
export type PackageId = (typeof PACKAGE_IDS)[number];

export const DEFAULT_PACKAGE_ID: PackageId = "pro";

export const EXTRA_EDIT_CENTS = 4_900;
export const EXTRA_EDIT_LABEL = "$49";

/** Pro monthly care Payment Link. Starter / Premium monthly links are not created yet. */
export const PRO_MONTHLY_CARE_URL =
  "https://buy.stripe.com/9B600i7jHgb94Tv0r26wE02";

type PackageCopy = {
  name: string;
  blurb: string;
  includes: string[];
  notIncluded: string[];
};

export type SitePackage = {
  id: PackageId;
  setupCents: number;
  monthlyCents: number;
  setupLabel: string;
  monthlyLabel: string;
  editsPerMonth: number;
  popular: boolean;
  monthlyCareUrl: string | null;
  copy: { en: PackageCopy; es: PackageCopy };
};

export const PACKAGES: Record<PackageId, SitePackage> = {
  starter: {
    id: "starter",
    setupCents: 9_900,
    monthlyCents: 2_995,
    setupLabel: "$99",
    monthlyLabel: "$29.95",
    editsPerMonth: 1,
    popular: false,
    monthlyCareUrl: null,
    copy: {
      en: {
        name: "Starter",
        blurb: "A small live site for phone, hours, and the map.",
        includes: [
          "1–3 pages",
          "Phone, hours, and map",
          "Live site, SSL, and basic SEO",
          "1 small edit per month",
        ],
        notIncluded: [
          "No AI receptionist",
          "No booking",
          "No ads",
        ],
      },
      es: {
        name: "Starter",
        blurb: "Un sitio pequeño en línea para teléfono, horario y el mapa.",
        includes: [
          "1–3 páginas",
          "Teléfono, horario y mapa",
          "Sitio en línea, SSL y SEO básico",
          "1 cambio pequeño al mes",
        ],
        notIncluded: [
          "Sin recepcionista de IA",
          "Sin reservas",
          "Sin anuncios",
        ],
      },
    },
  },
  pro: {
    id: "pro",
    setupCents: 20_000,
    monthlyCents: 6_900,
    setupLabel: "$200",
    monthlyLabel: "$69",
    editsPerMonth: 2,
    popular: true,
    monthlyCareUrl: PRO_MONTHLY_CARE_URL,
    copy: {
      en: {
        name: "Pro",
        blurb: "A multi-page custom look with an AI receptionist.",
        includes: [
          "Multi-page custom look",
          "SEO and Google Business help",
          "AI receptionist",
          "2 small edits per month",
          "Contact form and click-to-call",
        ],
        notIncluded: [
          "Booking, missed-call texts, and review texts are add-ons — not included",
        ],
      },
      es: {
        name: "Pro",
        blurb: "Varias páginas a la medida, con recepcionista de IA.",
        includes: [
          "Varias páginas, aspecto a la medida",
          "SEO y ayuda con Google Business",
          "Recepcionista de IA",
          "2 cambios pequeños al mes",
          "Formulario de contacto y clic para llamar",
        ],
        notIncluded: [
          "Reservas, textos de llamada perdida y textos de reseña son extras — no van incluidos",
        ],
      },
    },
  },
  premium: {
    id: "premium",
    setupCents: 34_900,
    monthlyCents: 9_995,
    setupLabel: "$349",
    monthlyLabel: "$99.95",
    editsPerMonth: 4,
    popular: false,
    monthlyCareUrl: null,
    copy: {
      en: {
        name: "Premium",
        blurb: "Everything in Pro, plus priority care and one included add-on.",
        includes: [
          "Everything in Pro",
          "4 priority edits per month",
          "Photo polish help",
          "One included add-on (you pick): booking, review texts, or missed-call text-back",
          "English + Spanish copy if you want it",
        ],
        notIncluded: [],
      },
      es: {
        name: "Premium",
        blurb: "Todo lo de Pro, más cuidado prioritario y un extra incluido.",
        includes: [
          "Todo lo de Pro",
          "4 cambios prioritarios al mes",
          "Ayuda para pulir fotos",
          "Un extra incluido (usted elige): reservas, textos de reseña o texto si no contestan",
          "Texto en inglés y español si lo desea",
        ],
        notIncluded: [],
      },
    },
  },
};

export function isPackageId(value: string | undefined | null): value is PackageId {
  return PACKAGE_IDS.includes(value as PackageId);
}

export function parsePackageId(
  value: string | string[] | undefined | null,
): PackageId {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = String(raw || "")
    .trim()
    .toLowerCase();
  return isPackageId(id) ? id : DEFAULT_PACKAGE_ID;
}

export function sitePackage(id: PackageId = DEFAULT_PACKAGE_ID): SitePackage {
  return PACKAGES[id];
}

export function packageCopy(id: PackageId, locale: Locale): PackageCopy {
  return PACKAGES[id].copy[locale];
}

export function requestWithPackage(locale: Locale, id: PackageId) {
  const params = new URLSearchParams();
  params.set("package", id);
  return `${requestPath(locale)}?${params.toString()}`;
}

export function formatMoney(cents: number) {
  const dollars = cents / 100;
  const fractionDigits = cents % 100 === 0 ? 0 : 2;
  return `$${dollars.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}
