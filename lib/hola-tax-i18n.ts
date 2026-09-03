import type { Locale } from "@/lib/types";

/** English service name stored on the Hola Tax client record. */
export const HOLA_TAX_LLC_SERVICE = "Arizona LLC formation";

/** English service name stored on the Hola Tax client record. */
export const HOLA_TAX_BOOKKEEPING_SERVICE = "Bookkeeping";

/** Owner-locked public prices. Do not invent tiers or other monthly rates. */
export const HOLA_TAX_BOOKKEEPING_MONTHLY = "$199";
export const HOLA_TAX_BOOKKEEPING_CATCHUP = "$349";

const servicesEs: Record<string, string> = {
  "Personal tax preparation": "Preparación de impuestos personales",
  "Small-business tax preparation": "Preparación de impuestos para negocios pequeños",
  [HOLA_TAX_LLC_SERVICE]: "Formación de LLC en Arizona",
  "ITIN applications": "Solicitudes de ITIN",
  [HOLA_TAX_BOOKKEEPING_SERVICE]: "Contabilidad",
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

/** Keep Bookkeeping on the live Hola Tax site even if stored client.services is stale. */
export function withHolaTaxBookkeepingService(services: string[]): string[] {
  if (services.some((service) => /bookkeeping/i.test(service))) {
    return [...services];
  }
  const next = [...services];
  const before = next.findIndex((service) => /year-round tax/i.test(service));
  if (before >= 0) {
    next.splice(before, 0, HOLA_TAX_BOOKKEEPING_SERVICE);
    return next;
  }
  next.push(HOLA_TAX_BOOKKEEPING_SERVICE);
  return next;
}

export function withHolaTaxListedServices(services: string[]): string[] {
  return withHolaTaxBookkeepingService(withHolaTaxLlcService(services));
}

export function isHolaTaxBookkeepingService(service: string) {
  return /bookkeeping/i.test(service);
}

export const holaTaxCopy = {
  en: {
    servicesTitle: "How we help",
    llcPromoKicker: "LLC and website",
    llcPromoTitle: "Starting a business?",
    llcPromo:
      "We can file your Arizona LLC and get your website live together. We help with LLC paperwork — we are not a law firm. Call or send a message.",
    booksKicker: "Monthly bookkeeping",
    booksTitle: "One person, one small business",
    booksPrice: `${HOLA_TAX_BOOKKEEPING_MONTHLY}/month`,
    booksHeroCta: `Bookkeeping — ${HOLA_TAX_BOOKKEEPING_MONTHLY}/month`,
    booksLead:
      "For one person running one small business — a cleaner, a handyman, a food truck. Few transactions, one bank. Not a big company.",
    booksSteps: [
      `You pay monthly. ${HOLA_TAX_BOOKKEEPING_MONTHLY} covers the books for that one small business.`,
      "Hola Tax sends you a QuickBooks Online invite. You log into QuickBooks Online and connect your bank once. Transactions copy in automatically.",
      "Hola Tax categorizes and reconciles each month. At year-end you get the reports for your taxes.",
    ],
    booksTaxNote:
      "Tax preparation is not included. Your books stay ready for tax time. Taxes are billed separately, the way they already are.",
    booksCatchup: `Behind on old books? Catch-up / cleanup starts at ${HOLA_TAX_BOOKKEEPING_CATCHUP}, then we quote the rest.`,
    contactTitle: "Contact",
    formName: "Name",
    formEmail: "Email",
    formPhone: "Phone",
    formMessage: "How can we help?",
    formSubmit: "Send",
    langNav: "Language",
    logoAlt: "Hola Tax Service",
    ctaCall: (phone: string) => `Call ${phone}`,
    ctaCallOrText: (phone: string) => `Call or text ${phone}`,
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
      "Hola Tax Service prepares personal and small-business taxes in Phoenix, helps with Arizona LLC paperwork, and does monthly bookkeeping for one person running one small business. Visit us at 1327 E Northern Ave. Call (602) 545-3308.",
  },
  es: {
    servicesTitle: "Cómo le ayudamos",
    llcPromoKicker: "LLC y sitio web",
    llcPromoTitle: "¿Va a abrir un negocio?",
    llcPromo:
      "Podemos formar su LLC de Arizona y poner su sitio web en línea juntos. Ayudamos con el papeleo de la LLC — no somos un bufete de abogados. Llame o envíe un mensaje.",
    booksKicker: "Contabilidad mensual",
    booksTitle: "Una persona, un negocio pequeño",
    booksPrice: `${HOLA_TAX_BOOKKEEPING_MONTHLY} al mes`,
    booksHeroCta: `Contabilidad — ${HOLA_TAX_BOOKKEEPING_MONTHLY} al mes`,
    booksLead:
      "Para una persona que lleva un negocio pequeño — limpieza, manitas, food truck. Pocas transacciones, un banco. No es para una empresa grande.",
    booksSteps: [
      `Usted paga cada mes. ${HOLA_TAX_BOOKKEEPING_MONTHLY} cubre la contabilidad de ese negocio pequeño.`,
      "Hola Tax le envía una invitación a QuickBooks Online. Usted entra a QuickBooks Online y conecta su banco una vez. Las transacciones se copian solas.",
      "Hola Tax clasifica y concilia cada mes. Al cierre del año recibe los reportes para sus impuestos.",
    ],
    booksTaxNote:
      "La preparación de impuestos no está incluida. Sus libros quedan listos para la temporada de impuestos. Los impuestos se cobran aparte, como ya se hace.",
    booksCatchup: `¿Libros atrasados? La puesta al día / limpieza empieza en ${HOLA_TAX_BOOKKEEPING_CATCHUP}; el resto se cotiza.`,
    contactTitle: "Contacto",
    formName: "Nombre",
    formEmail: "Correo",
    formPhone: "Teléfono",
    formMessage: "¿En qué le podemos ayudar?",
    formSubmit: "Enviar",
    langNav: "Idioma",
    logoAlt: "Hola Tax Service",
    ctaCall: (phone: string) => `Llamar al ${phone}`,
    ctaCallOrText: (phone: string) => `Llame o envíe un texto al ${phone}`,
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
      "Hola Tax Service prepara impuestos personales y de negocios pequeños en Phoenix, ayuda con el papeleo de LLC en Arizona, y lleva la contabilidad mensual para una persona con un negocio pequeño. Visítenos en 1327 E Northern Ave. Llame al (602) 545-3308.",
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

/** Price-bearing bookkeeping copy for the Hola Tax site only — not Phoenixwebhost. */
export function holaTaxBookkeepingPriceText(locale: Locale) {
  const copy = holaTaxCopy[locale];
  return [
    copy.booksPrice,
    copy.booksHeroCta,
    copy.booksLead,
    ...copy.booksSteps,
    copy.booksTaxNote,
    copy.booksCatchup,
  ].join(" ");
}
