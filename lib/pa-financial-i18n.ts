import type { Locale } from "@/lib/types";

export const PA_FINANCIAL_SLUG = "pa-financial";
export const PA_FINANCIAL_LEGAL = "P&A Financial LLC";
export const PA_FINANCIAL_PHONE = "(720) 501-0501";
export const PA_FINANCIAL_EMAIL = "pafinancial19@gmail.com";
export const PA_FINANCIAL_LOGO = "/clients/pa-financial/logo-circle.jpg";
export const PA_FINANCIAL_OWNER = "/clients/pa-financial/patricia-studio.jpg";
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
    tagline: "Personalized tax and financial help, in English and Spanish",
    heroLede:
      "Income tax preparation, ITIN processing, and business registration — by appointment, in English and Spanish.",
    about:
      "Patricia Escobedo has prepared taxes for more than eight years. Her journey began in Arizona. She works in English and Spanish and serves the Hispanic community with personalized financial and tax help.",
    hours: "By appointment — call to schedule",
    servicesTitle: "Our Services",
    contactUs: "Contact Us",
    aboutTitle: "About",
    aboutKicker: "Meet the owner",
    ownerName: "Patricia Escobedo",
    ownerRole: "Owner",
    scheduleTitle: "Schedule Your Appointment",
    scheduleBlurb:
      "Take the first step toward financial clarity by booking your appointment with P&A Financial LLC. Our expert services are designed to meet your needs with personalized attention.",
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
    heroLede:
      "Preparación de impuestos, trámites de ITIN y registro de negocios — con cita, en inglés y español.",
    about:
      "Patricia Escobedo lleva más de ocho años preparando impuestos. Su camino comenzó en Arizona. Trabaja en inglés y español y sirve a la comunidad hispana con ayuda financiera y de impuestos personalizada.",
    hours: "Con cita — llame para agendar",
    servicesTitle: "Nuestros servicios",
    contactUs: "Contáctenos",
    aboutTitle: "Acerca de",
    aboutKicker: "Conozca a la propietaria",
    ownerName: "Patricia Escobedo",
    ownerRole: "Propietaria",
    scheduleTitle: "Programe su cita",
    scheduleBlurb:
      "Dé el primer paso hacia claridad financiera reservando su cita con P&A Financial LLC. Nuestros servicios están pensados para atenderle de forma personalizada.",
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
        ? `${PA_FINANCIAL_LEGAL} — Preparación de impuestos`
        : `${PA_FINANCIAL_LEGAL} — Tax preparation`,
    description: `${about} ${PA_FINANCIAL_PHONE}.`,
    icon: PA_FINANCIAL_ICON,
  };
}
