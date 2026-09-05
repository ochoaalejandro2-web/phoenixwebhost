import type { Locale } from "@/lib/types";

export const copy = {
  en: {
    langName: "English",
    otherLang: "Español",
    otherHref: "/es",
    nav: {
      pricing: "Pricing",
      extras: "Extras",
      included: "What’s included",
      work: "How it works",
      request: "Request a demo",
      seeSite: "See your site",
      reviews: "Reviews",
      affiliates: "Sell with us",
      owner: "Owner login",
    },
    heroKicker: "Phoenix, Arizona · Phoenixwebhost Inc.",
    heroTitle: "A straightforward website for your Arizona small business.",
    heroAccent: "straightforward",
    proofLine: "Arizona small-business websites · $200 launch",
    heroLead:
      "One price to launch. One price to keep it live. No unlimited-change packages, no surprise retainers — just a clean site, hosting, and small monthly care.",
    ctaPrimary: "Request a demo",
    ctaSecondary: "See pricing",
    ownerLine: "Owner-operated by Alex Ochoa in Phoenix.",
    callPrompt: "Prefer to talk? Call",
    priceLaunch: "$200",
    priceLaunchHint: "one-time, to launch",
    priceMonth: "$69",
    priceMonthHint: "per month, to stay live",
    launchTitle: "Launch — $200 once",
    launchBody:
      "A simple small-business website from a professional template: your name, phone, hours, address, a short story, and a photo-ready layout. An AI receptionist is included — visitors can ask about your services, hours, and phone. Built for contractors, handymen, carpenters, salons, restaurants, landscapers, tax offices, and local offices.",
    monthTitle: "Stay live — $69 / month",
    monthBody:
      "Keeps the site online, covers small care, includes an AI receptionist, and includes basic local SEO (setup and visibility — not paid ads). This is not unlimited work.",
    includedTitle: "What $69/month covers",
    includedLead: "Limited monthly care. Basic local SEO is included. Never unlimited changes.",
    included: [
      "Basic local SEO included — setup and visibility basics (Google-friendly pages, business info, contact, mobile, Google Business Profile help). Not paid ads or ranking guarantees.",
      "An AI receptionist on your site — answers from your services, hours, and phone. Included, not an extra.",
      "The site stays live, with SSL",
      "Up to 30 minutes of small edits per month — or 2 small requests",
      "Hours, phone, address, prices, a sentence or two, or swapping a photo you send",
      "One contact form",
      "Backups, uptime watch, and basic security",
      "A short monthly note from us",
      "Support about your site only",
    ],
    notIncludedTitle: "Not included — quoted separately",
    notIncluded: [
      "A new page or live Instagram feed: $75–$150",
      "Many photos: quoted",
      "A shop: quoted",
      "A logo: $100–$300",
      "Magic SEO or guaranteed rankings — we do not sell that. Free basic SEO on the plan is setup and visibility, not paid ads or ranking promises.",
      "Unlimited changes — we do not sell that",
    ],
    unpaidTitle: "If a month goes unpaid",
    unpaidSteps: [
      "We send a reminder.",
      "The site shows a “temporarily offline” page.",
      "We keep your files for 30 days.",
      "Then the site comes down.",
    ],
    templatesTitle: "Nine professional starting points",
    templatesLead:
      "We do not invent a brand-new design for $200. We start from a proven layout and fill it with your business.",
    searchLabel: "Search live demos",
    searchPlaceholder: "Carpentry, handyman, cleaning…",
    searchHint: "Tap a result to open that live demo site.",
    searchEmpty: "No matching demos.",
    searchOpenDemo: "View live demo",
    howTitle: "How a launch works",
    howSteps: [
      {
        n: "1",
        t: "You request a demo",
        d: "Name, email, business, city, a short story, and which trade template to start from. Phone is optional but useful.",
      },
      {
        n: "2",
        t: "See a live mockup of your shop",
        d: "We fill a proven template with your answers. It is an idea of how the site will look — not a brand-new custom design, and not something you build yourself.",
      },
      {
        n: "3",
        t: "Pay $200 to launch, then $69/month",
        d: "First payment is $269 if you pay launch and the first month together. Optional Local Boost, Traffic, or Loud (pick one ads level) and Business Email can be added in the same checkout.",
      },
    ],
    aboutTitle: "A Phoenix company, not a faceless host",
    aboutBody:
      "Phoenixwebhost Inc. is owned by Alex Ochoa in Phoenix, Arizona. We build websites for Arizona small businesses and then keep those sites live. If you write in, a person who knows your site answers.",
    requestTitle: "Request a demo",
    requestLead:
      "Tell us about the business. We fill a proven template and show you a live demo — an idea of how the site will look. We do not invent a brand-new custom design for $200. If you like it, pay $200 to launch and $69/month to keep it live. First payment is $269 if you pay launch and the first month together.",
    formName: "Your name",
    formBusiness: "Business name",
    formEmail: "Email",
    formPhone: "Phone (optional)",
    formPhoneHint: "Useful if we need to call. Not required for the demo.",
    formCity: "City in Arizona",
    formMessage: "What should the site say?",
    formTemplate: "What kind of business?",
    formSubmit: "See my demo",
    formPay: "Purchase / Go live — $200 + $69/month",
    formPayBoost: "Go live with Local Boost",
    formPayTraffic: "Go live with Traffic",
    formPayLoud: "Go live with Loud",
    formPayEmail: "Go live with Business Email",
    formPayBoostEmail: "Go live with Local Boost and Business Email",
    formPayTrafficEmail: "Go live with Traffic and Business Email",
    formPayLoudEmail: "Go live with Loud and Business Email",
    formThanks: "Your demo is ready.",
    demoKicker: "This is a preview, not live yet",
    demoBanner:
      "A proven template filled with your business — not a brand-new custom design.",
    demoPrice:
      "$200 to launch + $69/month to keep it live. First payment is $269 if you pay launch and the first month together.",
    demoQuoted:
      "Extra pages ($75–$150) and logos ($100–$300) stay quoted. We do not sell unlimited AI design.",
    demoChatTitle: "Try a few tweaks",
    demoChatLead:
      "Four small changes on this preview: logo text, colors, one extra sentence, or one extra page. That is the cap.",
    demoChatPlaceholder: "Ask for a logo, a color, a sentence, or one extra page…",
    demoChatSend: "Send",
    demoChatHelp:
      "Try: logo to “Desert Peak”, color navy, add sentence “Licensed in Arizona”, or add a page called Warranty.",
    demoChatCapped:
      "This preview already has one extra page. More pages and a full redesign are quoted — $75–$150 per page, $100–$300 for a logo.",
    demoChatQuote:
      "That stays quoted. Extra pages are $75–$150, logos $100–$300. We start from this template; we do not invent a brand-new design for $200.",
    demoChatSaved: "Updated this preview. Extra pages and logos on the live site are still quoted.",
    demoPurchaseTitle: "Like it? Go live",
    demoEmailNote: "We also emailed you this preview link.",
    demoExtraNav: "Extra page",
    demoPreviewContact:
      "This preview does not send messages. On the live site, the form emails your inbox.",
    demoPurchased: "Payment received — Alex will put the real site live.",
    boostKicker: "Optional add-on",
    boostTitle: "Local Boost — $99 once + $79/month extra",
    boostBody:
      "Local Google visibility for Phoenix small businesses: we set up your Google Business Profile and a small local ad that points to your own site. The monthly extra keeps that listing and ad in care. The website plan already includes free basic SEO. Local Boost is optional paid ads — not magic SEO, and it does not promise rankings.",
    boostSeoNote:
      "The $200 + $69 plan includes free basic SEO. Local Boost is optional paid ads for faster local visibility.",
    boostSetupHint: "one-time, Google profile + small ad",
    boostMonthHint: "per month extra, listing and ad care",
    boostCheckbox: "Add Local Boost — $99 now + $79/month extra",
    boostCheckboxHelp:
      "Optional paid ads, separate from the website. The base plan already includes free basic SEO. Leave this unchecked to buy only the $200 launch and $69/month hosting-and-care plan.",
    boostMissing:
      "Local Boost checkout is not connected yet. Uncheck the add-on to pay for the website, or wait until Alex connects it.",
    adsPickOne: "Pick one ads level — or none.",
    adsLadderHelp:
      "$79 is the small ad. $199 is the one that actually brings jobs. $349 if they want it loud.",
    trafficKicker: "Optional add-on",
    trafficTitle: "Traffic — $199/month extra",
    trafficBody:
      "A bigger Google ad than Local Boost, so more people can see the business and call. More ad money means more people see it. This is a managed ads package — not a ranking promise, and not a guaranteed first-page spot.",
    trafficMonthHint: "per month extra, bigger ad",
    trafficCheckbox: "Add Traffic — $199/month extra",
    trafficCheckboxHelp:
      "The middle ads level. More ad than Local Boost. Pick only one ads level. Optional and on top of the $200 launch and $69/month website plan.",
    trafficMissing:
      "Traffic checkout is not connected yet. Pick Local Boost or the website only, or wait until Alex connects it.",
    loudKicker: "Optional add-on",
    loudTitle: "Loud — $349/month extra",
    loudBody:
      "The aggressive ads package. Louder ads, more people seeing the business. This is a managed ads package — not a ranking promise.",
    loudMonthHint: "per month extra, louder ads",
    loudCheckbox: "Add Loud — $349/month extra",
    loudCheckboxHelp:
      "The loud ads level. Pick only one ads level. Optional and on top of the $200 launch and $69/month website plan.",
    loudMissing:
      "Loud checkout is not connected yet. Pick Local Boost or Traffic, or wait until Alex connects it.",
    emailKicker: "Optional add-on",
    emailTitle: "Business Email — $49 once + $19/month extra",
    emailBody:
      "A real business inbox on your domain, such as info@yourshop.com, so customers take you seriously. We create one professional mailbox. The monthly extra keeps that inbox working. This is not magic, and it is not unlimited mailboxes.",
    emailSetupHint: "one-time, one professional inbox",
    emailMonthHint: "per month extra, keep the inbox working",
    emailCheckbox: "Add Business Email — $49 now + $19/month extra",
    emailCheckboxHelp:
      "Optional and separate. Leave this unchecked to buy only the $200 launch and $69/month hosting-and-care plan.",
    emailMissing:
      "Business Email checkout is not connected yet. Uncheck the add-on to pay for the website, or wait until Alex connects it.",
    includedSplit: "Included in the website",
    includedSplitHelp:
      "Custom site, AI receptionist chat, and basic local SEO. The owner gets the lead by email.",
    extrasSplit: "Optional extras — not in the $200 + $69 website",
    bookKicker: "Optional add-on",
    bookTitle: "Book a job — $49 once + $19/month extra",
    bookBody:
      "Customers pick a day, leave a name, phone, and a short job note. You get the request by email. This is a paid add-on, not the included receptionist.",
    bookSetupHint: "one-time, booking form on the site",
    bookMonthHint: "per month extra, keep the booking form live",
    bookCheckbox: "Add Book a job — $49 now + $19/month extra",
    bookCheckboxHelp:
      "Optional. Leave unchecked to buy only the website (which already includes the AI receptionist).",
    bookMissing:
      "Book a job checkout is not connected yet. Uncheck it to pay for the website, or wait until it is connected.",
    missedKicker: "Optional add-on",
    missedTitle: "Missed-call text-back — $49 once + $29/month extra",
    missedBody:
      "When a call is missed, a text goes back so they can reply. We set this up when you buy. It is not live on the demo sites yet.",
    missedSetupHint: "one-time setup",
    missedMonthHint: "per month extra",
    missedCheckbox: "Add missed-call text-back — $49 now + $29/month extra",
    missedCheckboxHelp: "Optional. We turn it on after you buy. Not on the demos yet.",
    missedMissing:
      "Missed-call text-back checkout is not connected yet. Uncheck it to pay for the website.",
    reviewTextsKicker: "Optional add-on",
    reviewTextsTitle: "Review texts after the job — $29/month extra",
    reviewTextsBody:
      "A short text after the job asking for a review. Sits next to Local Boost — it does not replace Boost. We set this up when you buy. Not live on the demos.",
    reviewTextsMonthHint: "per month extra",
    reviewTextsCheckbox: "Add review texts — $29/month extra",
    reviewTextsCheckboxHelp: "Optional. We set this up when you buy.",
    reviewTextsMissing:
      "Review texts checkout is not connected yet. Uncheck it to pay for the website.",
    voiceKicker: "Optional add-on",
    voiceTitle: "Voice receptionist — $99 once + $79/month extra",
    voiceBody:
      "Not included in the website. Forward your number or we issue one. AI picks up, then texts and emails you the call. 150 minutes included; extra minutes $0.50. We set this up when you buy. Not live on the demos.",
    voiceSetupHint: "one-time, number forward or a new number",
    voiceMonthHint: "per month extra, 150 minutes included",
    voiceCheckbox: "Add voice receptionist — $99 now + $79/month extra",
    voiceCheckboxHelp:
      "Optional paid voice line. The on-site chat receptionist stays included in $200 + $69.",
    voiceMissing:
      "Voice receptionist checkout is not connected yet. Uncheck it to pay for the website.",
    domainKicker: "Optional add-on",
    domainTitle: "Register a domain — about $20/year for a .com (first year)",
    domainBody:
      "We register a .com for you. The domain stays in your name. You keep the login. If you already have a domain, skip this. Phoenixwebhost only points DNS after that.",
    domainYearHint: "first year, .com",
    domainCheckbox: "Register a .com for me — about $20 for the first year",
    domainCheckboxHelp:
      "Optional. Skip if you already have a domain. Not required for the $200 launch and $69/month website.",
    domainMissing:
      "Domain checkout is not connected yet. Uncheck it to pay for the website, or wait until it is connected.",
    extrasMenuTitle: "Optional extras you can pick",
    extrasMenuLead:
      "The $200 launch and $69/month site stand alone. Pick only what you need.",
    extrasPick: "Pick this extra",
    affiliatesTitle: "Sell Phoenixwebhost",
    affiliatesLead:
      "If you send a customer who pays, Alex pays you the $200 launch. He keeps the $69/month and any add-ons.",
    affiliatesPayTitle: "How it pays",
    affiliatesPayBody:
      "You get the $200 launch fee only after Stripe payment succeeds. There is no automatic payout from Stripe. Alex records who sold it and pays you. Monthly hosting and extras stay with Phoenixwebhost.",
    affiliatesLinkTitle: "How to get a link",
    affiliatesLinkBody:
      "Call or email Alex. He adds you in the owner panel and gives you a unique URL. Anyone who opens that link is tied to you for the demo request and the paid checkout.",
    affiliatesCta: "Call Alex for a sell link",
    reviewsTitle: "Reviews from Arizona companies",
    reviewsLead:
      "Notes from businesses we built for. New reviews are checked before they appear here — no fake counts, no filler quotes.",
    reviewsEmpty: "No public reviews yet. Be the first.",
    reviewsFormTitle: "Leave a review",
    reviewsFormLead:
      "Company name, your name, a star rating, and a short note. It stays private until Alex approves it.",
    reviewsCompany: "Company name",
    reviewsReviewer: "Your name",
    reviewsCity: "City in Arizona (optional)",
    reviewsRating: "Rating",
    reviewsBody: "Short review",
    reviewsSubmit: "Submit review",
    reviewsThanks:
      "Thank you. Alex will read it before it appears on the site.",
    reviewsCta: "Leave a review",
    reviewsSeeAll: "See all reviews",
    footerLegal: "Phoenixwebhost Inc. · Phoenix, AZ",
    bilingual: "English & Español",
    seeSiteKicker: "Walk-in preview",
    seeSiteTitle: "See your site with your name on it.",
    seeSiteLead:
      "Type your business name, pick a type, and we fill a real Phoenixwebhost template. No email needed for this preview.",
    seeSiteNameLabel: "Your business name",
    seeSiteNamePlaceholder: "Reggie’s Barber Shop",
    seeSiteTypeLabel: "What kind of business?",
    seeSiteNext: "See my site",
    seeSiteChange: "Try another name",
    seeSiteNameNeeded: "Type a business name first.",
    seeSiteTypeNeeded: "Pick a business type.",
    seeSitePreviewKicker: "Preview — not live yet",
    seeSitePreviewNote:
      "A proven template with your name on it. The phone is a placeholder until you give us yours.",
    seeSitePriceTitle: "Clear pricing — no hidden fees",
    seeSiteBaseLabel: "Website",
    seeSiteBaseHelp: "$200 to launch + $69/month. Basic local SEO included. Always on this quote.",
    seeSiteDueNow: "Due to launch",
    seeSitePerMonth: "Then every month",
    seeSiteFirstPay: "First payment if you pay launch + first month together",
    seeSiteYearly: "Domain, first year",
    seeSiteQuotedTitle: "Quoted separately — not in the number above",
    seeSiteCustomNote:
      "Need something custom? Upon request we can customize it to what you want — that costs more (quoted).",
    seeSiteCtaCall: "Call",
    seeSiteCtaText: "Text",
    seeSiteCtaRequest: "Request a demo",
    seeSiteNoFees: "No hidden fees. The $200 launch and $69/month stay on screen.",
    seeSiteTypeSalon: "Barber / salon",
    seeSiteTypeRestaurant: "Restaurant",
    seeSiteTypeHandyman: "Handyman",
    seeSiteTypeContractor: "Contractor",
    seeSiteTypeCleaning: "Cleaning",
    seeSiteTypeShop: "General shop",
    seeSiteTypeOther: "Other",
    seeSiteOtherLabel: "What kind of business is it?",
    seeSiteOtherPlaceholder: "Yoga studio, daycare, auto shop…",
    seeSiteOtherNeeded: "Type what kind of business it is.",
    seeSiteOtherPreviewNote:
      "This preview uses the general shop template. You typed “{kind}” — Alex will see that on the demo request.",
    seeSiteOrderTitle: "Pickup ordering (Stripe)",
    seeSiteOrderHelp:
      "Restaurant pickup add-on. Setup $299–$499 + $149/month. Card fees about 3%. Not delivery, not a full online shop.",
    seeSiteExtraPage: "Extra page",
    seeSiteExtraPageHelp: "$75–$150 per page. Quoted — not in the running total.",
    seeSitePhotos: "Custom photos",
    seeSitePhotosHelp: "Quoted. We use photos you send, or we quote a shoot.",
    seeSiteSpanish: "Spanish on the site",
    seeSiteSpanishHelp:
      "Quoted. This marketing site already toggles English / Español.",
    seeSiteAdsNone: "No ads package",
  },
  es: {
    langName: "Español",
    otherLang: "English",
    otherHref: "/",
    nav: {
      pricing: "Precios",
      extras: "Extras",
      included: "Qué incluye",
      work: "Cómo funciona",
      request: "Pedir una demo",
      seeSite: "Vea su sitio",
      reviews: "Reseñas",
      affiliates: "Venda con nosotros",
      owner: "Acceso del dueño",
    },
    heroKicker: "Phoenix, Arizona · Phoenixwebhost Inc.",
    heroTitle: "Un sitio web claro para su negocio pequeño en Arizona.",
    heroAccent: "claro",
    proofLine: "Sitios para negocios pequeños en Arizona · lanzamiento $200",
    heroLead:
      "Un precio para lanzarlo. Un precio para mantenerlo en línea. Sin paquetes de cambios ilimitados ni retenedores sorpresa — un sitio limpio, hospedaje y cuidado mensual pequeño.",
    ctaPrimary: "Pedir una demo",
    ctaSecondary: "Ver precios",
    ownerLine: "Operado por Alex Ochoa en Phoenix.",
    callPrompt: "¿Prefiere hablar? Llame al",
    priceLaunch: "$200",
    priceLaunchHint: "un solo pago, para lanzar",
    priceMonth: "$69",
    priceMonthHint: "al mes, para mantenerlo en línea",
    launchTitle: "Lanzamiento — $200 una vez",
    launchBody:
      "Un sitio sencillo para un negocio pequeño, desde una plantilla profesional: nombre, teléfono, horario, dirección, una historia corta y un diseño listo para fotos. Incluye una recepcionista de IA — los visitantes pueden preguntar por servicios, horario y teléfono. Para contratistas, manitas, carpinteros, salones, restaurantes, jardineros, oficinas de impuestos y oficinas locales.",
    monthTitle: "Mantenerlo en línea — $69 / mes",
    monthBody:
      "Mantiene el sitio publicado, cubre el cuidado pequeño, incluye una recepcionista de IA y SEO local básico (configuración y visibilidad — no anuncios de pago). Esto no es trabajo ilimitado.",
    includedTitle: "Qué cubre el plan de $69 al mes",
    includedLead: "Cuidado mensual limitado. El SEO local básico va incluido. Nunca cambios ilimitados.",
    included: [
      "SEO local básico incluido — configuración y visibilidad (páginas claras para Google, datos del negocio, contacto, móvil, ayuda con el Perfil de Empresa en Google). No son anuncios de pago ni garantías de posición.",
      "Una recepcionista de IA en su sitio — responde con sus servicios, horario y teléfono. Incluida, no es un extra.",
      "El sitio permanece en línea, con SSL",
      "Hasta 30 minutos de cambios pequeños al mes — o 2 solicitudes pequeñas",
      "Horario, teléfono, dirección, precios, una o dos frases, o cambiar una foto que usted envíe",
      "Un formulario de contacto",
      "Copias de seguridad, vigilancia de actividad y seguridad básica",
      "Una nota corta cada mes",
      "Soporte solo sobre SU sitio",
    ],
    notIncludedTitle: "No incluido — se cotiza aparte",
    notIncluded: [
      "Una página nueva o un feed de Instagram: $75–$150",
      "Muchas fotos: se cotiza",
      "Una tienda: se cotiza",
      "Un logotipo: $100–$300",
      "SEO mágico o posiciones garantizadas — no vendemos eso. El SEO local básico del plan es configuración y visibilidad, no anuncios de pago ni promesas de posiciones.",
      "Cambios ilimitados — no vendemos eso",
    ],
    unpaidTitle: "Si un mes no se paga",
    unpaidSteps: [
      "Enviamos un recordatorio.",
      "El sitio muestra una página de “temporalmente fuera de línea”.",
      "Guardamos sus archivos 30 días.",
      "Después se da de baja el sitio.",
    ],
    templatesTitle: "Nueve puntos de partida profesionales",
    templatesLead:
      "Con $200 no inventamos una marca nueva. Partimos de un diseño comprobado y lo llenamos con su negocio.",
    searchLabel: "Buscar demos en vivo",
    searchPlaceholder: "Carpintería, manitas, limpieza…",
    searchHint: "Toque un resultado para abrir esa demo en vivo.",
    searchEmpty: "No hay demos que coincidan.",
    searchOpenDemo: "Ver demo en vivo",
    howTitle: "Cómo es un lanzamiento",
    howSteps: [
      {
        n: "1",
        t: "Pide una demo",
        d: "Nombre, correo, negocio, ciudad, una historia corta y de qué oficio partir. El teléfono es opcional pero útil.",
      },
      {
        n: "2",
        t: "Vea un mockup en vivo de su negocio",
        d: "Llenamos una plantilla comprobada con sus datos. Es una idea de cómo se verá el sitio — no un diseño a medida nuevo, ni algo que usted construye solo.",
      },
      {
        n: "3",
        t: "Paga $200 para lanzar, luego $69 al mes",
        d: "El primer pago es $269 si paga el lanzamiento y el primer mes juntos. Local Boost, Traffic o Loud (un solo nivel de anuncios) y Business Email son opcionales y se pueden agregar en el mismo pago.",
      },
    ],
    aboutTitle: "Una empresa en Phoenix, no un host sin cara",
    aboutBody:
      "Phoenixwebhost Inc. es de Alex Ochoa en Phoenix, Arizona. Hacemos sitios para negocios pequeños de Arizona y los mantenemos en línea. Si escribe, responde alguien que conoce su sitio.",
    requestTitle: "Pedir una demo",
    requestLead:
      "Cuéntenos del negocio. Llenamos una plantilla comprobada y le mostramos una demo en vivo — una idea de cómo se verá el sitio. Con $200 no inventamos un diseño a medida nuevo. Si le gusta, paga $200 para lanzar y $69 al mes para mantenerlo en línea. El primer pago es $269 si paga el lanzamiento y el primer mes juntos.",
    formName: "Su nombre",
    formBusiness: "Nombre del negocio",
    formEmail: "Correo",
    formPhone: "Teléfono (opcional)",
    formPhoneHint: "Útil si hay que llamar. No es obligatorio para la demo.",
    formCity: "Ciudad en Arizona",
    formMessage: "¿Qué debe decir el sitio?",
    formTemplate: "¿Qué tipo de negocio?",
    formSubmit: "Ver mi demo",
    formPay: "Comprar / Publicar — $200 + $69 al mes",
    formPayBoost: "Publicar con Local Boost",
    formPayTraffic: "Publicar con Traffic",
    formPayLoud: "Publicar con Loud",
    formPayEmail: "Publicar con Business Email",
    formPayBoostEmail: "Publicar con Local Boost y Business Email",
    formPayTrafficEmail: "Publicar con Traffic y Business Email",
    formPayLoudEmail: "Publicar con Loud y Business Email",
    formThanks: "Su demo está lista.",
    demoKicker: "Esta es una vista previa, aún no está en línea",
    demoBanner:
      "Una plantilla comprobada llena con su negocio — no un diseño a medida nuevo.",
    demoPrice:
      "$200 para lanzar + $69 al mes para mantenerlo en línea. El primer pago es $269 si paga el lanzamiento y el primer mes juntos.",
    demoQuoted:
      "Páginas extra ($75–$150) y logotipos ($100–$300) se cotizan. No vendemos diseño ilimitado con IA.",
    demoChatTitle: "Pruebe unos cambios",
    demoChatLead:
      "Cuatro cambios pequeños en esta vista: texto del logo, colores, una frase extra o una página extra. Ese es el límite.",
    demoChatPlaceholder: "Pida un logo, un color, una frase o una página extra…",
    demoChatSend: "Enviar",
    demoChatHelp:
      "Ejemplo: logo a “Desert Peak”, color navy, frase “Con licencia en Arizona”, o una página llamada Garantía.",
    demoChatCapped:
      "Esta vista ya tiene una página extra. Más páginas y un rediseño se cotizan — $75–$150 por página, $100–$300 por un logo.",
    demoChatQuote:
      "Eso se cotiza. Páginas extra $75–$150, logotipos $100–$300. Partimos de esta plantilla; no inventamos un diseño nuevo por $200.",
    demoChatSaved: "Actualizamos esta vista. En el sitio real, páginas extra y logotipos se cotizan.",
    demoPurchaseTitle: "¿Le gusta? Publíquelo",
    demoEmailNote: "También le enviamos este enlace por correo.",
    demoExtraNav: "Página extra",
    demoPreviewContact:
      "Esta vista no envía mensajes. En el sitio real, el formulario llega a su correo.",
    demoPurchased: "Pago recibido — Alex publicará el sitio de verdad.",
    boostKicker: "Complemento opcional",
    boostTitle: "Local Boost — $99 una vez + $79 al mes extra",
    boostBody:
      "Visibilidad local en Google para negocios pequeños de Phoenix: configuramos su Perfil de Empresa en Google y un anuncio local pequeño que apunta a su propio sitio. El cargo mensual extra cuida ese listado y anuncio. El plan del sitio ya incluye SEO local básico gratis. Local Boost es un anuncio de pago opcional — no es SEO mágico y no promete posiciones.",
    boostSeoNote:
      "El plan de $200 + $69 incluye SEO local básico gratis. Local Boost es un anuncio de pago opcional para más visibilidad local.",
    boostSetupHint: "un solo pago, perfil de Google + anuncio pequeño",
    boostMonthHint: "al mes extra, cuidado del listado y anuncio",
    boostCheckbox: "Agregar Local Boost — $99 ahora + $79 al mes extra",
    boostCheckboxHelp:
      "Anuncios de pago opcionales, aparte del sitio. El plan base ya incluye SEO local básico gratis. Si no lo marca, solo compra el lanzamiento de $200 y el plan de $69 al mes.",
    boostMissing:
      "El pago de Local Boost aún no está conectado. Desmarque el complemento para pagar el sitio, o espere a que Alex lo active.",
    adsPickOne: "Elija un nivel de anuncios — o ninguno.",
    adsLadderHelp:
      "$79 es el anuncio pequeño. $199 es el que de verdad trae trabajos. $349 si lo quieren fuerte.",
    trafficKicker: "Complemento opcional",
    trafficTitle: "Traffic — $199 al mes extra",
    trafficBody:
      "Un anuncio de Google más grande que Local Boost, para que más gente vea el negocio y llamen. Más dinero de anuncio significa que más personas lo ven. Es un paquete de anuncios administrado — no promete posiciones ni la primera página.",
    trafficMonthHint: "al mes extra, anuncio más grande",
    trafficCheckbox: "Agregar Traffic — $199 al mes extra",
    trafficCheckboxHelp:
      "El nivel de en medio. Más anuncio que Local Boost. Elija solo un nivel de anuncios. Opcional y aparte del lanzamiento de $200 y el plan de $69 al mes.",
    trafficMissing:
      "El pago de Traffic aún no está conectado. Elija Local Boost o el sitio solo, o espere a que Alex lo active.",
    loudKicker: "Complemento opcional",
    loudTitle: "Loud — $349 al mes extra",
    loudBody:
      "El paquete agresivo de anuncios. Anuncios más fuertes, más gente viendo el negocio. Es un paquete de anuncios administrado — no promete posiciones.",
    loudMonthHint: "al mes extra, anuncios fuertes",
    loudCheckbox: "Agregar Loud — $349 al mes extra",
    loudCheckboxHelp:
      "El nivel más fuerte. Elija solo un nivel de anuncios. Opcional y aparte del lanzamiento de $200 y el plan de $69 al mes.",
    loudMissing:
      "El pago de Loud aún no está conectado. Elija Local Boost o Traffic, o espere a que Alex lo active.",
    emailKicker: "Complemento opcional",
    emailTitle: "Business Email — $49 una vez + $19 al mes extra",
    emailBody:
      "Un correo de negocio real en su dominio, como info@sunegocio.com, para que los clientes lo tomen en serio. Creamos un buzón profesional. El cargo mensual extra mantiene ese buzón funcionando. No es magia y no son buzones ilimitados.",
    emailSetupHint: "un solo pago, un buzón profesional",
    emailMonthHint: "al mes extra, para mantener el buzón",
    emailCheckbox: "Agregar Business Email — $49 ahora + $19 al mes extra",
    emailCheckboxHelp:
      "Opcional y aparte. Si no lo marca, solo compra el lanzamiento de $200 y el plan de $69 al mes.",
    emailMissing:
      "El pago de Business Email aún no está conectado. Desmarque el complemento para pagar el sitio, o espere a que Alex lo active.",
    includedSplit: "Incluido en el sitio",
    includedSplitHelp:
      "Sitio a la medida, recepcionista de IA en el chat y SEO local básico. El dueño recibe el lead por correo.",
    extrasSplit: "Extras opcionales — no van en el sitio de $200 + $69",
    bookKicker: "Complemento opcional",
    bookTitle: "Reservar un trabajo — $49 una vez + $19 al mes extra",
    bookBody:
      "El cliente elige un día, deja nombre, teléfono y una nota. Usted recibe la solicitud por correo. Es un complemento de pago, no la recepcionista incluida.",
    bookSetupHint: "un solo pago, formulario de reserva en el sitio",
    bookMonthHint: "al mes extra, para mantener el formulario",
    bookCheckbox: "Agregar Reservar un trabajo — $49 ahora + $19 al mes extra",
    bookCheckboxHelp:
      "Opcional. Si no lo marca, solo compra el sitio (que ya incluye la recepcionista de IA).",
    bookMissing:
      "El pago de Reservar un trabajo aún no está conectado. Desmárquelo para pagar el sitio.",
    missedKicker: "Complemento opcional",
    missedTitle: "Texto si no contestan — $49 una vez + $29 al mes extra",
    missedBody:
      "Si se pierde una llamada, sale un texto para que contesten. Lo activamos cuando lo compra. Aún no está en las demos.",
    missedSetupHint: "un solo pago, configuración",
    missedMonthHint: "al mes extra",
    missedCheckbox: "Agregar texto si no contestan — $49 ahora + $29 al mes extra",
    missedCheckboxHelp: "Opcional. Lo activamos después de la compra. Aún no está en las demos.",
    missedMissing:
      "El pago de texto si no contestan aún no está conectado. Desmárquelo para pagar el sitio.",
    reviewTextsKicker: "Complemento opcional",
    reviewTextsTitle: "Textos de reseña después del trabajo — $29 al mes extra",
    reviewTextsBody:
      "Un texto corto después del trabajo pidiendo una reseña. Va junto a Local Boost — no lo reemplaza. Lo activamos cuando lo compra. No está en las demos.",
    reviewTextsMonthHint: "al mes extra",
    reviewTextsCheckbox: "Agregar textos de reseña — $29 al mes extra",
    reviewTextsCheckboxHelp: "Opcional. Lo activamos cuando lo compra.",
    reviewTextsMissing:
      "El pago de textos de reseña aún no está conectado. Desmárquelo para pagar el sitio.",
    voiceKicker: "Complemento opcional",
    voiceTitle: "Recepcionista de voz — $99 una vez + $79 al mes extra",
    voiceBody:
      "No está incluida en el sitio. Desvíe su número o le damos uno. La IA contesta, luego le manda texto y correo de la llamada. 150 minutos incluidos; minutos extra $0.50. Lo activamos cuando lo compra. No está en las demos.",
    voiceSetupHint: "un solo pago, desvío o número nuevo",
    voiceMonthHint: "al mes extra, 150 minutos incluidos",
    voiceCheckbox: "Agregar recepcionista de voz — $99 ahora + $79 al mes extra",
    voiceCheckboxHelp:
      "Línea de voz de pago. El chat del sitio sigue incluido en $200 + $69.",
    voiceMissing:
      "El pago de recepcionista de voz aún no está conectado. Desmárquelo para pagar el sitio.",
    domainKicker: "Complemento opcional",
    domainTitle: "Registrar un dominio — unos $20 al año por un .com (primer año)",
    domainBody:
      "Registramos un .com por usted. El dominio queda a su nombre. Usted guarda el acceso. Si ya tiene un dominio, omita esto. Phoenixwebhost solo apunta el DNS después.",
    domainYearHint: "primer año, .com",
    domainCheckbox: "Regístrenme un .com — unos $20 el primer año",
    domainCheckboxHelp:
      "Opcional. Omítalo si ya tiene un dominio. No es obligatorio para el lanzamiento de $200 y el sitio de $69 al mes.",
    domainMissing:
      "El pago del dominio aún no está conectado. Desmárquelo para pagar el sitio.",
    extrasMenuTitle: "Extras opcionales que puede elegir",
    extrasMenuLead:
      "El lanzamiento de $200 y el sitio de $69 al mes van solos. Elija solo lo que necesite.",
    extrasPick: "Elegir este extra",
    affiliatesTitle: "Venda Phoenixwebhost",
    affiliatesLead:
      "Si manda un cliente que paga, Alex le paga el lanzamiento de $200. Él se queda con los $69 al mes y los extras.",
    affiliatesPayTitle: "Cómo se paga",
    affiliatesPayBody:
      "Recibe los $200 del lanzamiento solo después de que Stripe cobre. No hay pago automático desde Stripe. Alex anota quién lo vendió y le paga. El hospedaje mensual y los extras se quedan con Phoenixwebhost.",
    affiliatesLinkTitle: "Cómo obtener un enlace",
    affiliatesLinkBody:
      "Llame o escriba a Alex. Él lo agrega en el panel y le da una URL única. Quien abra ese enlace queda ligado a usted en la demo y en el pago.",
    affiliatesCta: "Llame a Alex por un enlace",
    reviewsTitle: "Reseñas de empresas de Arizona",
    reviewsLead:
      "Notas de negocios para los que hicimos un sitio. Las reseñas nuevas se revisan antes de publicarse — sin cifras inventadas ni citas de relleno.",
    reviewsEmpty: "Aún no hay reseñas públicas. Sea el primero.",
    reviewsFormTitle: "Dejar una reseña",
    reviewsFormLead:
      "Nombre de la empresa, su nombre, estrellas y una nota corta. Queda en privado hasta que Alex la apruebe.",
    reviewsCompany: "Nombre de la empresa",
    reviewsReviewer: "Su nombre",
    reviewsCity: "Ciudad en Arizona (opcional)",
    reviewsRating: "Calificación",
    reviewsBody: "Reseña corta",
    reviewsSubmit: "Enviar reseña",
    reviewsThanks:
      "Gracias. Alex la leerá antes de que aparezca en el sitio.",
    reviewsCta: "Dejar una reseña",
    reviewsSeeAll: "Ver todas las reseñas",
    footerLegal: "Phoenixwebhost Inc. · Phoenix, AZ",
    bilingual: "English & Español",
    seeSiteKicker: "Vista para ventas",
    seeSiteTitle: "Vea su sitio con su nombre.",
    seeSiteLead:
      "Escriba el nombre del negocio, elija el tipo y llenamos una plantilla real de Phoenixwebhost. No hace falta correo para esta vista.",
    seeSiteNameLabel: "Nombre de su negocio",
    seeSiteNamePlaceholder: "Reggie’s Barber Shop",
    seeSiteTypeLabel: "¿Qué tipo de negocio?",
    seeSiteNext: "Ver mi sitio",
    seeSiteChange: "Probar otro nombre",
    seeSiteNameNeeded: "Escriba primero el nombre del negocio.",
    seeSiteTypeNeeded: "Elija un tipo de negocio.",
    seeSiteTypeOther: "Otro",
    seeSiteOtherLabel: "¿Qué tipo de negocio es?",
    seeSiteOtherPlaceholder: "Estudio de yoga, guardería, taller…",
    seeSiteOtherNeeded: "Escriba qué tipo de negocio es.",
    seeSiteOtherPreviewNote:
      "Esta vista usa la plantilla de tienda general. Usted escribió “{kind}” — Alex lo verá en la solicitud de demo.",
    seeSitePreviewKicker: "Vista previa — aún no está en línea",
    seeSitePreviewNote:
      "Una plantilla comprobada con su nombre. El teléfono es de muestra hasta que nos dé el suyo.",
    seeSitePriceTitle: "Precios claros — sin cargos ocultos",
    seeSiteBaseLabel: "Sitio web",
    seeSiteBaseHelp: "$200 para lanzar + $69 al mes. SEO local básico incluido. Siempre en esta cotización.",
    seeSiteDueNow: "Para lanzar",
    seeSitePerMonth: "Luego cada mes",
    seeSiteFirstPay: "Primer pago si paga el lanzamiento y el primer mes juntos",
    seeSiteYearly: "Dominio, primer año",
    seeSiteQuotedTitle: "Se cotiza aparte — no va en el número de arriba",
    seeSiteCustomNote:
      "¿Necesita algo a medida? Si lo pide, lo podemos personalizar — eso cuesta más (se cotiza).",
    seeSiteCtaCall: "Llamar",
    seeSiteCtaText: "Texto",
    seeSiteCtaRequest: "Pedir una demo",
    seeSiteNoFees: "Sin cargos ocultos. El lanzamiento de $200 y los $69 al mes se quedan en pantalla.",
    seeSiteTypeSalon: "Barbería / salón",
    seeSiteTypeRestaurant: "Restaurante",
    seeSiteTypeHandyman: "Manitas",
    seeSiteTypeContractor: "Contratista",
    seeSiteTypeCleaning: "Limpieza",
    seeSiteTypeShop: "Tienda general",
    seeSiteOrderTitle: "Pedidos para recoger (Stripe)",
    seeSiteOrderHelp:
      "Complemento de pedidos para recoger. Setup $299–$499 + $149 al mes. Comisiones de tarjeta unos 3%. No es delivery ni una tienda en línea completa.",
    seeSiteExtraPage: "Página extra",
    seeSiteExtraPageHelp: "$75–$150 por página. Se cotiza — no va en el total de arriba.",
    seeSitePhotos: "Fotos a medida",
    seeSitePhotosHelp: "Se cotiza. Usamos las fotos que envíe, o cotizamos una sesión.",
    seeSiteSpanish: "Español en el sitio",
    seeSiteSpanishHelp:
      "Se cotiza. Este sitio de marketing ya cambia entre English / Español.",
    seeSiteAdsNone: "Sin paquete de anuncios",
  },
} as const;

export function t(locale: Locale) {
  return copy[locale];
}

export function requestPath(locale: Locale) {
  return locale === "es" ? "/es/request" : "/request";
}

export function homePath(locale: Locale) {
  return locale === "es" ? "/es" : "/";
}

export function reviewsPath(locale: Locale) {
  return locale === "es" ? "/es/reviews" : "/reviews";
}

export function affiliatesPath(locale: Locale) {
  return locale === "es" ? "/es/affiliates" : "/affiliates";
}

export function previewPath(locale: Locale) {
  return locale === "es" ? "/es/preview" : "/preview";
}
