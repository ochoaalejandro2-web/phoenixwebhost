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
      "Patricia Escobedo has prepared taxes for more than eight years. Her journey began in Colorado. She works in English and Spanish and serves the Hispanic community with personalized financial and tax help.",
    hours: "By appointment — call to schedule",
  },
  es: {
    tagline:
      "Ayuda personalizada de impuestos y finanzas, en inglés y español",
    about:
      "Patricia Escobedo lleva más de ocho años preparando impuestos. Su camino comenzó en Colorado. Trabaja en inglés y español y sirve a la comunidad hispana con ayuda financiera y de impuestos personalizada.",
    hours: "Con cita — llame para agendar",
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
