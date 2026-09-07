import type { Locale } from "@/lib/types";

/** Live paying Pro client. Not a public demo. */
export const PA_FINANCIAL_SLUG = "pa-financial";

export const PA_FINANCIAL_BRAND = "P&A Financial";
export const PA_FINANCIAL_LEGAL = "P&A Financial LLC";
export const PA_FINANCIAL_OWNER = "Patricia Escobedo";
export const PA_FINANCIAL_PHONE = "(720) 501-0501";
export const PA_FINANCIAL_EMAIL = "pafinancial19@gmail.com";
export const PA_FINANCIAL_INSTAGRAM = "https://instagram.com/pafin_ancial";
export const PA_FINANCIAL_WHATSAPP = "https://wa.me/17205010501";

/**
 * Drop the PNG at this path and set the string when the brand file arrives.
 * Leave null to keep the text wordmark.
 */
export const PA_FINANCIAL_LOGO_SRC: string | null = null;
export const PA_FINANCIAL_ICON: string | null = null;

export const PA_FINANCIAL_SERVICES = [
  "Income Tax Preparation",
  "ITIN Number Processing and Renewal",
  "Business Registration",
] as const;

const servicesEs: Record<string, string> = {
  "Income Tax Preparation": "Preparación de impuestos sobre la renta",
  "ITIN Number Processing and Renewal":
    "Trámite y renovación de número ITIN",
  "Business Registration": "Registro de negocios",
};

export const paFinancialCopy = {
  en: {
    langNav: "Language",
    navHome: "Home",
    navAbout: "About Us",
    navServices: "Services",
    navContact: "Contact",
    logoAlt: "P&A Financial",
    kicker: "Colorado · English & Spanish",
    tagline: "Personalized tax and financial help, in English and Spanish",
    heroLead:
      "Patricia Escobedo has prepared taxes for more than eight years. Call, text WhatsApp, or send a message to book an appointment.",
    about:
      "Patricia Escobedo has prepared taxes for more than eight years. Her journey began in Colorado. She works in English and Spanish and serves the Hispanic community with personalized financial and tax help.",
    aboutTitle: "About Us",
    aboutLead: "A bilingual tax office that takes time with each return.",
    aboutBody: [
      "Patricia Escobedo has prepared taxes for more than eight years. Her journey began in Colorado.",
      "She is bilingual in English and Spanish. P&A Financial LLC serves the Hispanic community with personalized financial and tax help — not a one-size packet.",
      "Hours and a public office address are still being confirmed. Until then, we work by appointment. Call, WhatsApp, or email to schedule.",
    ],
    servicesTitle: "Services",
    servicesLead: "Three services. Call if you are not sure which one you need.",
    serviceBlurbs: {
      "Income Tax Preparation":
        "Personal and family income-tax returns prepared with you, in English or Spanish.",
      "ITIN Number Processing and Renewal":
        "Help applying for a new ITIN or renewing one that has expired.",
      "Business Registration":
        "Help with business registration paperwork. We are not a law firm.",
    },
    reviewsTitle: "Reviews",
    reviewsSoon: "Client reviews coming soon.",
    hoursTitle: "Hours",
    hours: "By appointment — call to schedule",
    addressLabel: "Office",
    addressSoon: "Address coming soon. We work by appointment until then.",
    city: "Colorado",
    contactTitle: "Contact",
    contactLead:
      "Call, WhatsApp, or email to book an appointment. You can also send a message here.",
    ctaCall: (phone: string) => `Call ${phone}`,
    ctaWhatsApp: "WhatsApp",
    ctaEmail: "Email",
    ctaMessage: "Send a message",
    ctaAppointment: "Book an appointment",
    instagram: "Instagram",
    clientLogin: "Client login / Upload documents",
    portalHint:
      "A private folder for your W-2, 1099, and ID. Not tax-prep software.",
    staffLogin: "Tax preparer login",
    formName: "Name",
    formEmail: "Email",
    formPhone: "Phone",
    formMessage: "How can we help?",
    formSubmit: "Send",
    noticeSent: (business: string) =>
      `Your message was emailed to ${business}.`,
    noticeNoEmail: (phone: string) =>
      phone
        ? `This business has no email on file, so we could not send your message. Please call ${phone}.`
        : "This business has no email on file, so we could not send your message.",
    noticeMissing: "Name, a real email, and a message are required.",
    noticeFailed: (phone: string) =>
      phone
        ? `We could not send your message by email. Please call ${phone}.`
        : "We could not send your message by email. Please try again.",
  },
  es: {
    langNav: "Idioma",
    navHome: "Inicio",
    navAbout: "Nosotros",
    navServices: "Servicios",
    navContact: "Contacto",
    logoAlt: "P&A Financial",
    kicker: "Colorado · Inglés y español",
    tagline:
      "Ayuda personalizada de impuestos y finanzas, en inglés y español",
    heroLead:
      "Patricia Escobedo lleva más de ocho años preparando impuestos. Llame, escriba por WhatsApp o envíe un mensaje para agendar una cita.",
    about:
      "Patricia Escobedo lleva más de ocho años preparando impuestos. Su camino comenzó en Colorado. Trabaja en inglés y español y sirve a la comunidad hispana con ayuda financiera y de impuestos personalizada.",
    aboutTitle: "Nosotros",
    aboutLead: "Una oficina de impuestos bilingüe que se toma el tiempo con cada declaración.",
    aboutBody: [
      "Patricia Escobedo lleva más de ocho años preparando impuestos. Su camino comenzó en Colorado.",
      "Es bilingüe en inglés y español. P&A Financial LLC sirve a la comunidad hispana con ayuda financiera y de impuestos personalizada — no un paquete igual para todos.",
      "El horario y la dirección pública de la oficina aún se están confirmando. Hasta entonces, trabajamos con cita. Llame, escriba por WhatsApp o envíe un correo para agendar.",
    ],
    servicesTitle: "Servicios",
    servicesLead:
      "Tres servicios. Llame si no está seguro de cuál necesita.",
    serviceBlurbs: {
      "Income Tax Preparation":
        "Declaraciones de impuestos personales y familiares, preparadas con usted, en inglés o español.",
      "ITIN Number Processing and Renewal":
        "Ayuda para solicitar un ITIN nuevo o renovar uno que ya venció.",
      "Business Registration":
        "Ayuda con el papeleo de registro de un negocio. No somos un bufete de abogados.",
    },
    reviewsTitle: "Reseñas",
    reviewsSoon: "Las reseñas de clientes estarán disponibles pronto.",
    hoursTitle: "Horario",
    hours: "Con cita — llame para agendar",
    addressLabel: "Oficina",
    addressSoon:
      "La dirección estará disponible pronto. Hasta entonces, trabajamos con cita.",
    city: "Colorado",
    contactTitle: "Contacto",
    contactLead:
      "Llame, escriba por WhatsApp o envíe un correo para agendar una cita. También puede dejar un mensaje aquí.",
    ctaCall: (phone: string) => `Llame al ${phone}`,
    ctaWhatsApp: "WhatsApp",
    ctaEmail: "Correo",
    ctaMessage: "Enviar un mensaje",
    ctaAppointment: "Agendar una cita",
    instagram: "Instagram",
    clientLogin: "Iniciar sesión / Subir documentos",
    portalHint:
      "Una carpeta privada para su W-2, 1099 e identificación. No es un programa de impuestos.",
    staffLogin: "Acceso del preparador",
    formName: "Nombre",
    formEmail: "Correo",
    formPhone: "Teléfono",
    formMessage: "¿En qué le podemos ayudar?",
    formSubmit: "Enviar",
    noticeSent: (business: string) =>
      `Su mensaje se envió por correo a ${business}.`,
    noticeNoEmail: (phone: string) =>
      phone
        ? `Este negocio no tiene correo registrado, así que no pudimos enviar su mensaje. Llame al ${phone}.`
        : "Este negocio no tiene correo registrado, así que no pudimos enviar su mensaje.",
    noticeMissing: "Se requieren el nombre, un correo real y un mensaje.",
    noticeFailed: (phone: string) =>
      phone
        ? `No pudimos enviar su mensaje por correo. Llame al ${phone}.`
        : "No pudimos enviar su mensaje por correo. Intente de nuevo.",
  },
} as const;

export type PaFinancialPage = "home" | "about" | "services" | "contact";

export function tPaFinancial(locale: Locale) {
  return paFinancialCopy[locale];
}

export function paFinancialServiceLabel(service: string, locale: Locale) {
  if (locale === "en") return service;
  return servicesEs[service] ?? service;
}

export function paFinancialTagline(_english: string, locale: Locale) {
  return paFinancialCopy[locale].tagline;
}

export function paFinancialAbout(_english: string, locale: Locale) {
  return paFinancialCopy[locale].about;
}

export function paFinancialHours(locale: Locale) {
  return paFinancialCopy[locale].hours;
}

export function paFinancialServiceBlurb(service: string, locale: Locale) {
  const copy = paFinancialCopy[locale];
  return copy.serviceBlurbs[service as keyof typeof copy.serviceBlurbs] ?? "";
}

export function paFinancialSeo(locale: Locale) {
  const copy = paFinancialCopy[locale];
  return {
    brand: PA_FINANCIAL_LEGAL,
    title:
      locale === "es"
        ? `${PA_FINANCIAL_LEGAL} — Preparación de impuestos`
        : `${PA_FINANCIAL_LEGAL} — Tax preparation`,
    description: `${copy.about} ${copy.ctaCall(PA_FINANCIAL_PHONE)}.`,
    icon: PA_FINANCIAL_ICON,
  };
}

export function paFinancialPageTitle(page: PaFinancialPage, locale: Locale) {
  const copy = paFinancialCopy[locale];
  const seo = paFinancialSeo(locale);
  if (page === "about") return `${copy.aboutTitle} — ${PA_FINANCIAL_LEGAL}`;
  if (page === "services") return `${copy.servicesTitle} — ${PA_FINANCIAL_LEGAL}`;
  if (page === "contact") return `${copy.contactTitle} — ${PA_FINANCIAL_LEGAL}`;
  return seo.title;
}

export function isPaFinancialSlug(slug: string) {
  return slug === PA_FINANCIAL_SLUG;
}
