import type { Locale } from "@/lib/types";

const servicesEs: Record<string, string> = {
  "Personal tax preparation": "Preparación de impuestos personales",
  "Small-business tax preparation": "Preparación de impuestos para negocios pequeños",
  "ITIN applications": "Solicitudes de ITIN",
  Bookkeeping: "Contabilidad",
  "Year-round tax support": "Apoyo con impuestos todo el año",
};

export const holaTaxCopy = {
  en: {
    servicesTitle: "How we help",
    contactTitle: "Contact",
    formName: "Name",
    formEmail: "Email",
    formPhone: "Phone",
    formMessage: "How can we help?",
    formSubmit: "Send",
    langNav: "Language",
    logoAlt: "Hola Tax Service",
    ctaCall: (phone: string) => `Call ${phone}`,
    ctaMessage: "Send a message",
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
    photos: {
      office:
        "A tax prep office desk with a laptop showing a spreadsheet, a notebook, and a cup of coffee, lit with a neon green accent.",
      calculator:
        "A smartphone calculator next to tax documents and a pen on a white wooden desk.",
      desk: "Close-up of paperwork being filled out at a tax prep desk.",
    },
    tagline: "Personal & small-business tax preparation in Phoenix",
    about:
      "Hola Tax Service prepares personal and small-business taxes in Phoenix. Visit us at 1327 E Northern Ave. Call (602) 545-3308.",
  },
  es: {
    servicesTitle: "Cómo le ayudamos",
    contactTitle: "Contacto",
    formName: "Nombre",
    formEmail: "Correo",
    formPhone: "Teléfono",
    formMessage: "¿En qué le podemos ayudar?",
    formSubmit: "Enviar",
    langNav: "Idioma",
    logoAlt: "Hola Tax Service",
    ctaCall: (phone: string) => `Llamar al ${phone}`,
    ctaMessage: "Enviar un mensaje",
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
    photos: {
      office:
        "Escritorio de una oficina de preparación de impuestos, con una laptop que muestra una hoja de cálculo, un cuaderno y una taza de café, con luz verde neón.",
      calculator:
        "Calculadora en un celular junto a documentos de impuestos y un bolígrafo, sobre un escritorio de madera blanca.",
      desk: "Primer plano de papeles que se están llenando en un escritorio de preparación de impuestos.",
    },
    tagline: "Preparación de impuestos personales y de negocios pequeños en Phoenix",
    about:
      "Hola Tax Service prepara impuestos personales y de negocios pequeños en Phoenix. Visítenos en 1327 E Northern Ave. Llame al (602) 545-3308.",
  },
} as const;

export const HOLA_TAX_BRAND = "Hola Tax Service";
export const HOLA_TAX_ICON = "/clients/hola-tax-service/icon.png";

export function holaTaxSeo(locale: Locale) {
  const copy = holaTaxCopy[locale];
  return {
    brand: HOLA_TAX_BRAND,
    title:
      locale === "es"
        ? `${HOLA_TAX_BRAND} — Preparación de impuestos en Phoenix`
        : `${HOLA_TAX_BRAND} — Tax preparation in Phoenix`,
    description: copy.about,
    icon: HOLA_TAX_ICON,
  };
}

export function tHolaTax(locale: Locale) {
  return holaTaxCopy[locale];
}

export function holaTaxServiceLabel(service: string, locale: Locale) {
  if (locale === "en") return service;
  return servicesEs[service] ?? service;
}

export function holaTaxTagline(english: string, locale: Locale) {
  return locale === "es" ? holaTaxCopy.es.tagline : english;
}

export function holaTaxAbout(english: string, locale: Locale) {
  return locale === "es" ? holaTaxCopy.es.about : english;
}
