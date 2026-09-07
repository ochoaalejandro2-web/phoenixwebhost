import { HOLA_TAX_SLUG, clientThemeClass } from "./client-themes.ts";
import {
  PA_FINANCIAL_EMAIL,
  PA_FINANCIAL_FACEBOOK,
  PA_FINANCIAL_INSTAGRAM,
  PA_FINANCIAL_IRS_REFUND,
  PA_FINANCIAL_LOGO,
  PA_FINANCIAL_OWNER,
  PA_FINANCIAL_SLUG,
  PA_FINANCIAL_WHATSAPP,
  paFinancialCopy,
  paFinancialHours,
  paFinancialRefundLinks,
  paFinancialServiceBlurb,
} from "./pa-financial-i18n.ts";
import type { Client, Locale } from "./types.ts";

/** Shared IRS refund checker. Extra state/payment links stay shop-specific. */
export const TAX_IRS_REFUND_URL = PA_FINANCIAL_IRS_REFUND;

export const TAX_PRO_THEME_CLASS = "theme-tax-pro";

const taxProUi = {
  en: {
    aboutTitle: "What we do",
    aboutKicker: "Tax & bookkeeping",
    servicesTitle: "Our Services",
    servicesLead: "Tax and financial help for families and small businesses.",
    contactUs: "Contact us",
    ownerRole: "Owner",
    readyCta: "Ready to call or schedule an appointment?",
    scheduleCta: "Schedule appointment",
    scheduleTitle: "Schedule Your Appointment",
    scheduleBlurb: (name: string) =>
      `Call or schedule an appointment with ${name}. We help with taxes and paperwork, in English and Spanish.`,
    footerLinks: "Links",
    footerContact: "Contact",
    footerSocial: "Social Media",
    refundTitle: "Check your refund",
    refundIrs: "IRS Where's My Refund",
    navHome: "Home",
    navAbout: "What we do",
    navServices: "Services",
    navContact: "Contact",
  },
  es: {
    aboutTitle: "Qué hacemos",
    aboutKicker: "Impuestos y contabilidad",
    servicesTitle: "Nuestros servicios",
    servicesLead:
      "Ayuda de impuestos y finanzas para familias y negocios pequeños.",
    contactUs: "Contáctenos",
    ownerRole: "Propietario",
    readyCta: "¿Listo para llamar o programar una cita?",
    scheduleCta: "Programar una cita",
    scheduleTitle: "Programe su cita",
    scheduleBlurb: (name: string) =>
      `Llame o programe una cita con ${name}. Ayudamos con impuestos y papeleo, en inglés y español.`,
    footerLinks: "Enlaces",
    footerContact: "Contacto",
    footerSocial: "Redes sociales",
    refundTitle: "Consulte su reembolso",
    refundIrs: "¿Dónde está mi reembolso? (IRS)",
    navHome: "Inicio",
    navAbout: "Qué hacemos",
    navServices: "Servicios",
    navContact: "Contacto",
  },
} as const;

export type TaxProWhatWeDo = { title: string; blurb: string };

export type TaxProCopy = {
  tagline: string;
  heroLede: string;
  aboutLead: string;
  about: string;
  hours: string;
  servicesTitle: string;
  servicesLead: string;
  contactUs: string;
  aboutTitle: string;
  aboutKicker: string;
  whatWeDo: readonly TaxProWhatWeDo[];
  ownerName: string;
  ownerRole: string;
  readyCta: string;
  scheduleCta: string;
  scheduleTitle: string;
  scheduleBlurb: string;
  footerLinks: string;
  footerContact: string;
  footerSocial: string;
  refundTitle: string;
  navHome: string;
  navAbout: string;
  navServices: string;
  navContact: string;
};

export type TaxProSocialLink = {
  kind: "whatsapp" | "email" | "facebook" | "instagram";
  href: string;
  label: string;
};

export type TaxProBrand = {
  logoSrc: string;
  ownerPhotoSrc: string;
  email: string;
  socials: TaxProSocialLink[];
  refundLinks: { href: string; label: string }[];
  googleReviewUrl: string;
};

export function isHolaTaxLayout(slug: string) {
  return slug === HOLA_TAX_SLUG;
}

/** Pro tax-office page: P&A look. Hola Tax keeps its photo-hero shop. */
export function isTaxProLayout(
  client: Pick<Client, "template" | "slug"> | null | undefined,
) {
  return Boolean(
    client && client.template === "tax" && !isHolaTaxLayout(client.slug),
  );
}

export function isPaFinancialSlug(slug: string) {
  return slug === PA_FINANCIAL_SLUG;
}

export function sanitizePublicAssetPath(value: string) {
  const raw = String(value || "").trim();
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("..")) {
    return "";
  }
  if (raw.includes("://")) return "";
  return raw.slice(0, 200);
}

export function sanitizeHttpUrl(value: string) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString().slice(0, 300);
  } catch {
    return "";
  }
}

export function telHref(phone: string) {
  return `tel:${String(phone).replace(/[^\d+]/g, "")}`;
}

export function whatsappHrefFromPhone(phone: string) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) return `https://wa.me/1${digits}`;
  if (digits.length >= 11) return `https://wa.me/${digits}`;
  return "";
}

function hostLabel(href: string, fallback: string) {
  try {
    const url = new URL(href);
    return `${url.host.replace(/^www\./, "")}${url.pathname === "/" ? "" : url.pathname}`.replace(
      /\/$/,
      "",
    );
  } catch {
    return fallback;
  }
}

export function taxOfficeLogoSrc(client: Pick<Client, "slug" | "logoSrc">) {
  const fromClient = sanitizePublicAssetPath(String(client.logoSrc || ""));
  if (fromClient) return fromClient;
  if (isPaFinancialSlug(client.slug)) return PA_FINANCIAL_LOGO;
  return "";
}

export function taxOfficeOwnerPhotoSrc(
  client: Pick<Client, "slug" | "ownerPhotoSrc">,
) {
  const fromClient = sanitizePublicAssetPath(String(client.ownerPhotoSrc || ""));
  if (fromClient) return fromClient;
  if (isPaFinancialSlug(client.slug)) return PA_FINANCIAL_OWNER;
  return "";
}

export function taxOfficeThemeClass(
  client: Pick<Client, "template" | "slug">,
) {
  const base = clientThemeClass(client.template);
  if (!isTaxProLayout(client)) return base;
  const slugClass = `theme-${client.slug}`;
  return [base, TAX_PRO_THEME_CLASS, slugClass].filter(Boolean).join(" ");
}

export function taxProServiceBlurb(
  client: Pick<Client, "slug">,
  service: string,
  locale: Locale,
) {
  if (isPaFinancialSlug(client.slug)) {
    return paFinancialServiceBlurb(service, locale);
  }
  return "";
}

export function taxProCopy(
  client: Pick<
    Client,
    | "slug"
    | "businessName"
    | "contactName"
    | "tagline"
    | "about"
    | "hours"
    | "services"
  >,
  locale: Locale,
): TaxProCopy {
  if (isPaFinancialSlug(client.slug)) {
    const pa = paFinancialCopy(locale);
    return {
      ...pa,
      hours: paFinancialHours(locale),
      scheduleBlurb: pa.scheduleBlurb,
    };
  }
  const ui = taxProUi[locale];
  const services = Array.isArray(client.services) ? client.services : [];
  const about = String(client.about || "").trim();
  const tagline = String(client.tagline || "").trim();
  return {
    tagline,
    heroLede: about || tagline,
    aboutLead: about,
    about: "",
    hours: String(client.hours || "").trim(),
    servicesTitle: ui.servicesTitle,
    servicesLead: ui.servicesLead,
    contactUs: ui.contactUs,
    aboutTitle: ui.aboutTitle,
    aboutKicker: ui.aboutKicker,
    whatWeDo: services.map((title) => ({ title, blurb: "" })),
    ownerName: String(client.contactName || "").trim(),
    ownerRole: ui.ownerRole,
    readyCta: ui.readyCta,
    scheduleCta: ui.scheduleCta,
    scheduleTitle: ui.scheduleTitle,
    scheduleBlurb: ui.scheduleBlurb(client.businessName),
    footerLinks: ui.footerLinks,
    footerContact: ui.footerContact,
    footerSocial: ui.footerSocial,
    refundTitle: ui.refundTitle,
    navHome: ui.navHome,
    navAbout: ui.navAbout,
    navServices: ui.navServices,
    navContact: ui.navContact,
  };
}

export function taxProRefundLinks(
  client: Pick<Client, "slug">,
  locale: Locale,
) {
  const ui = taxProUi[locale];
  if (isPaFinancialSlug(client.slug)) {
    return [...paFinancialRefundLinks(locale)];
  }
  return [{ href: TAX_IRS_REFUND_URL, label: ui.refundIrs }];
}

export function taxProBrand(client: Client, locale: Locale): TaxProBrand {
  const pa = isPaFinancialSlug(client.slug);
  const email = String(client.email || "").trim() || (pa ? PA_FINANCIAL_EMAIL : "");
  const whatsapp =
    sanitizeHttpUrl(String(client.whatsapp || "")) ||
    (pa ? PA_FINANCIAL_WHATSAPP : "") ||
    whatsappHrefFromPhone(client.phone);
  const facebook = pa
    ? sanitizeHttpUrl(String(client.facebook || "")) || PA_FINANCIAL_FACEBOOK
    : sanitizeHttpUrl(String(client.facebook || ""));
  const instagram = pa
    ? sanitizeHttpUrl(String(client.instagram || "")) || PA_FINANCIAL_INSTAGRAM
    : sanitizeHttpUrl(String(client.instagram || ""));
  const socials: TaxProSocialLink[] = [];
  if (whatsapp) {
    socials.push({ kind: "whatsapp", href: whatsapp, label: "WhatsApp" });
  }
  if (email) {
    socials.push({
      kind: "email",
      href: `mailto:${email}`,
      label: "Email",
    });
  }
  if (facebook) {
    socials.push({
      kind: "facebook",
      href: facebook,
      label: pa ? paFinancialCopy(locale).footerFacebook : hostLabel(facebook, "Facebook"),
    });
  }
  if (instagram) {
    socials.push({
      kind: "instagram",
      href: instagram,
      label: pa
        ? paFinancialCopy(locale).footerInstagram
        : hostLabel(instagram, "Instagram"),
    });
  }
  return {
    logoSrc: taxOfficeLogoSrc(client),
    ownerPhotoSrc: taxOfficeOwnerPhotoSrc(client),
    email,
    socials,
    refundLinks: taxProRefundLinks(client, locale),
    googleReviewUrl: taxOfficeGoogleReviewUrl(client),
  };
}

export type TaxBrandFields = Pick<
  Client,
  | "logoText"
  | "logoSrc"
  | "ownerPhotoSrc"
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "googleReviewUrl"
>;

/** Optional Vercel/env bootstrap for Patricia’s shop until Admin has a URL. */
export function paFinancialGoogleReviewUrlFromEnv() {
  return sanitizeHttpUrl(process.env.PA_FINANCIAL_GOOGLE_REVIEW_URL || "");
}

/** Client brand field first; P&A can fall back to env. Empty means hide the CTA. */
export function taxOfficeGoogleReviewUrl(
  client: Pick<Client, "slug" | "googleReviewUrl">,
) {
  const fromClient = sanitizeHttpUrl(String(client.googleReviewUrl || ""));
  if (fromClient) return fromClient;
  if (isPaFinancialSlug(client.slug)) return paFinancialGoogleReviewUrlFromEnv();
  return "";
}

/** Admin create/save: optional brand fields for the tax Pro layout. */
export function readTaxBrandFields(formData: FormData): TaxBrandFields {
  const logoText = String(formData.get("logoText") || "").trim().slice(0, 80);
  const logoSrc = sanitizePublicAssetPath(String(formData.get("logoSrc") || ""));
  const ownerPhotoSrc = sanitizePublicAssetPath(
    String(formData.get("ownerPhotoSrc") || ""),
  );
  const instagram = sanitizeHttpUrl(String(formData.get("instagram") || ""));
  const facebook = sanitizeHttpUrl(String(formData.get("facebook") || ""));
  const whatsapp = sanitizeHttpUrl(String(formData.get("whatsapp") || ""));
  const googleReviewUrl = sanitizeHttpUrl(
    String(formData.get("googleReviewUrl") || ""),
  );
  return {
    logoText: logoText || undefined,
    logoSrc: logoSrc || undefined,
    ownerPhotoSrc: ownerPhotoSrc || undefined,
    instagram: instagram || undefined,
    facebook: facebook || undefined,
    whatsapp: whatsapp || undefined,
    googleReviewUrl: googleReviewUrl || undefined,
  };
}
