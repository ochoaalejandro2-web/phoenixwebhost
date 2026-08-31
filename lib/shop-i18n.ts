import type { Locale, TemplateId } from "./types";

const shop = {
  en: {
    navServices: "Services",
    navAbout: "About",
    navPhotos: "Photos",
    navHours: "Hours",
    navReviews: "Reviews",
    navContact: "Contact",
    call: (phone: string) => `Call ${phone}`,
    callShort: "Call",
    message: "Send a message",
    servicesTitle: (template: TemplateId) => {
      if (template === "restaurant") return "From the kitchen";
      if (template === "landscaping") return "Yard work";
      if (template === "handyman") return "Around the house";
      if (template === "carpentry") return "From the shop";
      if (template === "salon") return "In the chair";
      if (template === "tax") return "How we help";
      return "Services";
    },
    aboutTitle: "About",
    photosTitle: "Recent work",
    hoursTitle: "Hours & location",
    reviewsTitle: "What neighbors say",
    contactTitle: (template: TemplateId) =>
      template === "carpentry" ? "Request a quote" : "Contact",
    formName: "Name",
    formEmail: "Email",
    formPhone: "Phone",
    formMessage: "How can we help?",
    formSubmit: "Send",
    previewContact:
      "This preview does not send messages. On the live site, this form emails the business.",
    previewHours: "Sample hours for this preview — we will set your real hours when you go live.",
    previewAddress:
      "Sample Phoenix-area address for this preview — we will put your real street when you go live.",
    previewPhone: "Sample phone for this preview — we will use the number you sent, or add one when you go live.",
    previewReviews:
      "Sample reviews for this preview, so the layout is full. They are not live customer quotes.",
    previewNav: "Preview",
    sampleSite: "Sample site — not a customer account",
  },
  es: {
    navServices: "Servicios",
    navAbout: "Nosotros",
    navPhotos: "Fotos",
    navHours: "Horario",
    navReviews: "Reseñas",
    navContact: "Contacto",
    call: (phone: string) => `Llame al ${phone}`,
    callShort: "Llamar",
    message: "Enviar un mensaje",
    servicesTitle: (template: TemplateId) => {
      if (template === "restaurant") return "De la cocina";
      if (template === "landscaping") return "Trabajo de jardín";
      if (template === "handyman") return "En la casa";
      if (template === "carpentry") return "Del taller";
      if (template === "salon") return "En el sillón";
      if (template === "tax") return "Cómo le ayudamos";
      return "Servicios";
    },
    aboutTitle: "Nosotros",
    photosTitle: "Trabajo reciente",
    hoursTitle: "Horario y ubicación",
    reviewsTitle: "Lo que dicen los vecinos",
    contactTitle: (template: TemplateId) =>
      template === "carpentry" ? "Pedir una cotización" : "Contacto",
    formName: "Nombre",
    formEmail: "Correo",
    formPhone: "Teléfono",
    formMessage: "¿En qué le podemos ayudar?",
    formSubmit: "Enviar",
    previewContact:
      "Esta vista no envía mensajes. En el sitio real, el formulario llega al correo del negocio.",
    previewHours:
      "Horario de muestra para esta vista — pondremos su horario real cuando publique.",
    previewAddress:
      "Dirección de muestra del área de Phoenix — pondremos su calle real cuando publique.",
    previewPhone:
      "Teléfono de muestra para esta vista — usaremos el número que envió, o lo agregaremos cuando publique.",
    previewReviews:
      "Reseñas de muestra para llenar el diseño. No son citas de clientes reales.",
    previewNav: "Vista previa",
    sampleSite: "Sitio de muestra — no es una cuenta de cliente",
  },
} as const;

export function tShop(locale: Locale) {
  return shop[locale];
}
