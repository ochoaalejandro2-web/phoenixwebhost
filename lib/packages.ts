import { requestPath } from "./i18n.ts";
import type { Locale } from "./types.ts";

export const PACKAGE_IDS = ["starter", "pro", "premium"] as const;
export type PackageId = (typeof PACKAGE_IDS)[number];

export const DEFAULT_PACKAGE_ID: PackageId = "pro";

export const EXTRA_EDIT_CENTS = 4_900;
export const EXTRA_EDIT_LABEL = "$49";

export const PACKAGE_BUY_URLS = {
  starter: "https://buy.stripe.com/3cI9AS0VjcYX4Tv6Pq6wE04",
  pro: "https://buy.stripe.com/9B600i7jHgb94Tv0r26wE02",
  premium: "https://buy.stripe.com/5kQ5kC7jHf752Lnc9K6wE05",
} as const;

/** @deprecated use PACKAGE_BUY_URLS.pro */
export const PRO_MONTHLY_CARE_URL = PACKAGE_BUY_URLS.pro;

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
  buyUrl: string;
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
    buyUrl: PACKAGE_BUY_URLS.starter,
    monthlyCareUrl: PACKAGE_BUY_URLS.starter,
    copy: {
      en: {
        name: "Starter",
        blurb:
          "Look nice. Call me. For barbers, handymen, and real estate agents — about $1 a day.",
        includes: [
          "Home (front) + contact — a simple shop card",
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
        blurb:
          "Se ve bien. Llame. Para barberos, manitas y agentes de bienes raíces — unos $1 al día.",
        includes: [
          "Inicio (portada) + contacto — una tarjeta sencilla del negocio",
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
    buyUrl: PACKAGE_BUY_URLS.pro,
    monthlyCareUrl: PACKAGE_BUY_URLS.pro,
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
    buyUrl: PACKAGE_BUY_URLS.premium,
    monthlyCareUrl: PACKAGE_BUY_URLS.premium,
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
