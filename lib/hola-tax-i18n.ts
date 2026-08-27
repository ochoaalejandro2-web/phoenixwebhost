import type { Locale } from "@/lib/types";

/** English service name stored on the Hola Tax client record. */
export const HOLA_TAX_LLC_SERVICE = "Arizona LLC formation";

const servicesEs: Record<string, string> = {
  "Personal tax preparation": "Preparación de impuestos personales",
  "Small-business tax preparation": "Preparación de impuestos para negocios pequeños",
  [HOLA_TAX_LLC_SERVICE]: "Formación de LLC en Arizona",
  "ITIN applications": "Solicitudes de ITIN",
  Bookkeeping: "Contabilidad",
  "Year-round tax support": "Apoyo con impuestos todo el año",
};

/** Keep LLC on the live Hola Tax site even if stored client.services is stale. */
export function withHolaTaxLlcService(services: string[]): string[] {
  if (services.some((service) => /llc/i.test(service))) return [...services];
  const next = [...services];
  const after = next.findIndex((service) => /small-business tax/i.test(service));
  if (after >= 0) {
    next.splice(after + 1, 0, HOLA_TAX_LLC_SERVICE);
    return next;
  }
  next.push(HOLA_TAX_LLC_SERVICE);
  return next;
}

export const holaTaxCopy = {
  en: {
    servicesTitle: "How we help",
    llcPromoKicker: "LLC and website",
    llcPromoTitle: "Starting a business?",
    llcPromo:
      "We can file your Arizona LLC and get your website live together. We help with LLC paperwork — we are not a law firm. Call or send a message.",
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
      llcSigning: "Hands filling out business paperwork on a desk.",
      llcHandshake: "Two people shaking hands in an office.",
      llcStorefront: "Interior of a new small-business shop.",
    },
    tagline: "Personal & small-business tax preparation in Phoenix",
    about:
      "Hola Tax Service prepares personal and small-business taxes in Phoenix, and helps with Arizona LLC paperwork. Visit us at 1327 E Northern Ave. Call (602) 545-3308.",
  },
  es: {
    servicesTitle: "Cómo le ayudamos",
    llcPromoKicker: "LLC y sitio web",
    llcPromoTitle: "¿Va a abrir un negocio?",
    llcPromo:
      "Podemos formar su LLC de Arizona y poner su sitio web en línea juntos. Ayudamos con el papeleo de la LLC — no somos un bufete de abogados. Llame o envíe un mensaje.",
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
      llcSigning: "Manos llenando papeles de un negocio en un escritorio.",
      llcHandshake: "Dos personas dándose la mano en una oficina.",
      llcStorefront: "Interior de un negocio pequeño recién abierto.",
    },
    tagline: "Preparación de impuestos personales y de negocios pequeños en Phoenix",
    about:
      "Hola Tax Service prepara impuestos personales y de negocios pequeños en Phoenix, y ayuda con el papeleo de LLC en Arizona. Visítenos en 1327 E Northern Ave. Llame al (602) 545-3308.",
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

export function holaTaxAbout(_english: string, locale: Locale) {
  return holaTaxCopy[locale].about;
}
