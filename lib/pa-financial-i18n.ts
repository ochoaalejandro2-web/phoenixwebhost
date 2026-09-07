import type { Locale } from "@/lib/types";

export const PA_FINANCIAL_SLUG = "pa-financial";
export const PA_FINANCIAL_LEGAL = "P&A Financial LLC";
export const PA_FINANCIAL_PHONE = "(720) 501-0501";
export const PA_FINANCIAL_LOGO = "/clients/pa-financial/logo.png";
export const PA_FINANCIAL_ICON = "/clients/pa-financial/icon.png";

const servicesEs: Record<string, string> = {
  "Income Tax Preparation": "Preparación de impuestos sobre la renta",
  "ITIN Number Processing and Renewal":
    "Trámite y renovación de número ITIN",
  "Business Registration": "Registro de negocios",
};

const copy = {
  en: {
    tagline: "Personalized tax and financial help, in English and Spanish",
    about:
      "Patricia Escobedo has prepared taxes for more than eight years. Her journey began in Arizona. She works in English and Spanish and serves the Hispanic community with personalized financial and tax help.",
    hours: "By appointment — call to schedule",
    servicesTitle: "Our Services",
    contactUs: "Contact Us",
    blurbs: {
      "Income Tax Preparation":
        "Ensure your taxes are filed accurately and on time with our expert guidance.",
      "ITIN Number Processing and Renewal":
        "Simplify the process of obtaining or renewing your ITIN number.",
      "Business Registration":
        "Let us assist you in setting up your business, ensuring compliance with regulations.",
    },
  },
  es: {
    tagline:
      "Ayuda personalizada de impuestos y finanzas, en inglés y español",
    about:
      "Patricia Escobedo lleva más de ocho años preparando impuestos. Su camino comenzó en Arizona. Trabaja en inglés y español y sirve a la comunidad hispana con ayuda financiera y de impuestos personalizada.",
    hours: "Con cita — llame para agendar",
    servicesTitle: "Nuestros servicios",
    contactUs: "Contáctenos",
    blurbs: {
      "Income Tax Preparation":
        "Asegúrese de que sus impuestos se presenten a tiempo y de forma correcta, con nuestra guía.",
      "ITIN Number Processing and Renewal":
        "Simplifique el trámite para obtener o renovar su número ITIN.",
      "Business Registration":
        "Le ayudamos a registrar su negocio y a cumplir con los requisitos.",
    },
  },
} as const;

export function paFinancialServiceLabel(service: string, locale: Locale) {
  if (locale === "en") return service;
  return servicesEs[service] ?? service;
}

export function paFinancialTagline(_english: string, locale: Locale) {
  return copy[locale].tagline;
}

export function paFinancialAbout(_english: string, locale: Locale) {
  return copy[locale].about;
}

export function paFinancialHours(locale: Locale) {
  return copy[locale].hours;
}

export function paFinancialServicesTitle(locale: Locale) {
  return copy[locale].servicesTitle;
}

export function paFinancialContactUs(locale: Locale) {
  return copy[locale].contactUs;
}

export function paFinancialServiceBlurb(service: string, locale: Locale) {
  const blurbs = copy[locale].blurbs;
  return blurbs[service as keyof typeof blurbs] ?? "";
}

export function paFinancialSeo(locale: Locale) {
  const about = copy[locale].about;
  return {
    brand: PA_FINANCIAL_LEGAL,
    title:
      locale === "es"
        ? `${PA_FINANCIAL_LEGAL} — Preparación de impuestos`
        : `${PA_FINANCIAL_LEGAL} — Tax preparation`,
    description: `${about} ${PA_FINANCIAL_PHONE}.`,
    icon: PA_FINANCIAL_ICON,
  };
}
