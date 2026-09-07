import type { Locale } from "@/lib/types";

export const PA_FINANCIAL_SLUG = "pa-financial";
export const PA_FINANCIAL_LEGAL = "P&A Financial LLC";
export const PA_FINANCIAL_PHONE = "(720) 501-0501";
export const PA_FINANCIAL_EMAIL = "pafinancial19@gmail.com";
export const PA_FINANCIAL_LOGO = "/clients/pa-financial/logo-circle.jpg";
export const PA_FINANCIAL_OWNER = "/clients/pa-financial/patricia.jpg";
export const PA_FINANCIAL_ICON = "/clients/pa-financial/icon.png";
export const PA_FINANCIAL_WHATSAPP = "https://wa.me/17205010501";
export const PA_FINANCIAL_INSTAGRAM = "https://www.instagram.com/pafin_ancial";
export const PA_FINANCIAL_FACEBOOK = "#";

const servicesEs: Record<string, string> = {
  "Income Tax Preparation": "Preparación de impuestos sobre la renta",
  "ITIN Number Processing and Renewal":
    "Trámite y renovación de número ITIN",
  "Business Registration": "Registro de negocios",
};

const copy = {
  en: {
    tagline: "Expert tax & financial services for the Hispanic community",
    heroLede:
      "Trusted, bilingual help for Latino families and small businesses — income taxes, ITIN processing, and business registration, by appointment.",
    about:
      "Patricia Escobedo has prepared taxes for more than eight years. Her journey began in Arizona. She works in English and Spanish and helps Hispanic and Latino families and small businesses with clear, personal tax and financial guidance.",
    hours: "By appointment — call to schedule",
    servicesTitle: "Our Services",
    servicesLead:
      "Tax and financial help for families and small businesses in our community.",
    contactUs: "Contact Us",
    aboutTitle: "About",
    aboutKicker: "For the Latino community",
    ownerName: "Patricia Escobedo",
    ownerRole: "Owner",
    scheduleTitle: "Schedule Your Appointment",
    scheduleBlurb:
      "Take the first step toward financial clarity with P&A Financial LLC. We help Latino families and small businesses with taxes and paperwork, in English and Spanish.",
    footerLinks: "Links",
    footerContact: "Contact",
    footerSocial: "Social Media",
    footerInstagram: "instagram.com/pafin_ancial",
    footerFacebook: "facebook.com/",
    navHome: "Home",
    navAbout: "About Us",
    navServices: "Services",
    navContact: "Contact",
    blurbs: {
      "Income Tax Preparation":
        "File on time and with care — guidance for households who work in English, Spanish, or both.",
      "ITIN Number Processing and Renewal":
        "Step-by-step help obtaining or renewing an ITIN, explained clearly.",
      "Business Registration":
        "Help setting up your small business and staying in step with the required paperwork.",
    },
  },
  es: {
    tagline: "Servicios fiscales y financieros para la comunidad latina",
    heroLede:
      "Ayuda de confianza, en inglés y español, para familias y negocios latinos — impuestos, trámites de ITIN y registro de negocios, con cita.",
    about:
      "Patricia Escobedo lleva más de ocho años preparando impuestos. Su camino comenzó en Arizona. Trabaja en inglés y español y ayuda a familias y negocios hispanos y latinos con orientación clara y personal de impuestos y finanzas.",
    hours: "Con cita — llame para agendar",
    servicesTitle: "Nuestros servicios",
    servicesLead:
      "Ayuda de impuestos y finanzas para familias y negocios de nuestra comunidad.",
    contactUs: "Contáctenos",
    aboutTitle: "Acerca de",
    aboutKicker: "Para la comunidad latina",
    ownerName: "Patricia Escobedo",
    ownerRole: "Propietaria",
    scheduleTitle: "Programe su cita",
    scheduleBlurb:
      "Dé el primer paso hacia claridad financiera con P&A Financial LLC. Ayudamos a familias y negocios latinos con impuestos y papeleo, en inglés y español.",
    footerLinks: "Enlaces",
    footerContact: "Contacto",
    footerSocial: "Redes sociales",
    footerInstagram: "instagram.com/pafin_ancial",
    footerFacebook: "facebook.com/",
    navHome: "Inicio",
    navAbout: "Nosotros",
    navServices: "Servicios",
    navContact: "Contacto",
    blurbs: {
      "Income Tax Preparation":
        "Presente a tiempo y con cuidado — guía para hogares que trabajan en inglés, español, o ambos.",
      "ITIN Number Processing and Renewal":
        "Ayuda paso a paso para obtener o renovar un ITIN, explicada con claridad.",
      "Business Registration":
        "Le ayudamos a registrar su negocio pequeño y a cumplir con el papeleo.",
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

export function paFinancialCopy(locale: Locale) {
  return copy[locale];
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
        ? `${PA_FINANCIAL_LEGAL} — Impuestos y finanzas para la comunidad latina`
        : `${PA_FINANCIAL_LEGAL} — Tax & financial help for the Hispanic community`,
    description: `${about} ${PA_FINANCIAL_PHONE}.`,
    icon: PA_FINANCIAL_ICON,
  };
}
