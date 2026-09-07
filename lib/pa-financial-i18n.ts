import type { Locale } from "@/lib/types";

export const PA_FINANCIAL_SLUG = "pa-financial";
export const PA_FINANCIAL_LEGAL = "P&A Financial LLC";
export const PA_FINANCIAL_PHONE = "(720) 501-0501";
export const PA_FINANCIAL_TEL = "tel:7205010501";
export const PA_FINANCIAL_EMAIL = "pafinancial19@gmail.com";
export const PA_FINANCIAL_LOGO = "/clients/pa-financial/logo-brand.svg";
export const PA_FINANCIAL_OWNER = "/clients/pa-financial/patricia.jpg";
export const PA_FINANCIAL_ICON = "/clients/pa-financial/icon.png";
export const PA_FINANCIAL_WHATSAPP = "https://wa.me/17205010501";
export const PA_FINANCIAL_INSTAGRAM = "https://www.instagram.com/pafin_ancial";
export const PA_FINANCIAL_FACEBOOK = "#";
export const PA_FINANCIAL_IRS_REFUND = "https://sa.www4.irs.gov/wmr/";
export const PA_FINANCIAL_AZ_REFUND = "https://aztaxes.gov/Home/CheckRefund";
export const PA_FINANCIAL_IRS_PAYMENTS = "https://www.irs.gov/payments";

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
    aboutLead:
      "Income tax preparation, ITIN processing and renewal, and business registration for Hispanic and Latino families and small businesses — in English and Spanish. Straightforward bookkeeping when the books need a simple, clear hand.",
    about:
      "Patricia Escobedo has prepared taxes for more than eight years. Her journey began in Arizona. She works in English and Spanish, with clear personal guidance.",
    hours: "By appointment — call or schedule",
    servicesTitle: "Our Services",
    servicesLead:
      "Tax and financial help for families and small businesses in our community.",
    contactUs: "Contact Us",
    aboutTitle: "What we do",
    aboutKicker: "For the Latino community",
    whatWeDo: [
      {
        title: "Income tax preparation",
        blurb: "Household returns filed on time, with care.",
      },
      {
        title: "ITIN processing and renewal",
        blurb: "Step-by-step help obtaining or renewing an ITIN.",
      },
      {
        title: "Business registration",
        blurb: "Paperwork to get a small business on the books.",
      },
    ],
    ownerName: "Patricia Escobedo",
    ownerRole: "Owner",
    readyCta: "Ready to call or schedule an appointment?",
    scheduleCta: "Schedule appointment",
    scheduleTitle: "Schedule Your Appointment",
    scheduleBlurb:
      "Call or schedule an appointment with P&A Financial LLC. We help Latino families and small businesses with taxes and paperwork, in English and Spanish.",
    footerLinks: "Links",
    footerContact: "Contact",
    footerSocial: "Social Media",
    refundTitle: "Check your refund",
    refundIrs: "IRS Where's My Refund",
    refundState: "Where is my state refund",
    refundPayments: "Payments | Internal Revenue Service",
    footerInstagram: "instagram.com/pafin_ancial",
    footerFacebook: "facebook.com/",
    navHome: "Home",
    navAbout: "What we do",
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
    aboutLead:
      "Preparación de impuestos, trámite y renovación de ITIN, y registro de negocios para familias y negocios hispanos y latinos — en inglés y español. Contabilidad sencilla cuando hay que tener los libros en orden.",
    about:
      "Patricia Escobedo lleva más de ocho años preparando impuestos. Su camino comenzó en Arizona. Trabaja en inglés y español, con orientación clara y personal.",
    hours: "Con cita — llame o programe",
    servicesTitle: "Nuestros servicios",
    servicesLead:
      "Ayuda de impuestos y finanzas para familias y negocios de nuestra comunidad.",
    contactUs: "Contáctenos",
    aboutTitle: "Qué hacemos",
    aboutKicker: "Para la comunidad latina",
    whatWeDo: [
      {
        title: "Preparación de impuestos sobre la renta",
        blurb: "Declaraciones del hogar, a tiempo y con cuidado.",
      },
      {
        title: "Trámite y renovación de ITIN",
        blurb: "Ayuda paso a paso para obtener o renovar un ITIN.",
      },
      {
        title: "Registro de negocios",
        blurb: "Le ayudamos a registrar un negocio pequeño.",
      },
    ],
    ownerName: "Patricia Escobedo",
    ownerRole: "Propietaria",
    readyCta: "¿Listo para llamar o programar una cita?",
    scheduleCta: "Programar una cita",
    scheduleTitle: "Programe su cita",
    scheduleBlurb:
      "Llame o programe una cita con P&A Financial LLC. Ayudamos a familias y negocios latinos con impuestos y papeleo, en inglés y español.",
    footerLinks: "Enlaces",
    footerContact: "Contacto",
    footerSocial: "Redes sociales",
    refundTitle: "Consulte su reembolso",
    refundIrs: "¿Dónde está mi reembolso? (IRS)",
    refundState: "¿Dónde está mi reembolso estatal?",
    refundPayments: "Pagos | Internal Revenue Service",
    footerInstagram: "instagram.com/pafin_ancial",
    footerFacebook: "facebook.com/",
    navHome: "Inicio",
    navAbout: "Qué hacemos",
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
  const c = copy[locale];
  return `${c.aboutLead} ${c.about}`;
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

export function paFinancialRefundLinks(locale: Locale) {
  const labels = copy[locale];
  return [
    { href: PA_FINANCIAL_IRS_REFUND, label: labels.refundIrs },
    { href: PA_FINANCIAL_AZ_REFUND, label: labels.refundState },
    { href: PA_FINANCIAL_IRS_PAYMENTS, label: labels.refundPayments },
  ] as const;
}

export function paFinancialServiceBlurb(service: string, locale: Locale) {
  const blurbs = copy[locale].blurbs;
  return blurbs[service as keyof typeof blurbs] ?? "";
}

export function paFinancialSeo(locale: Locale) {
  const about = paFinancialAbout("", locale);
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
