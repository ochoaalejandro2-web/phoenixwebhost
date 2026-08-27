import type { Client } from "@/lib/types";
import { isTaxOfficeTemplate } from "@/lib/client-themes";

export const TAX_TEMPLATE_ID = "tax" as const;

/** Live first example. Used only to migrate that record onto the tax template. */
export const HOLA_TAX_SLUG = "hola-tax-service";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export const TAX_DOC_LABELS = ["W-2", "1099", "ID", "Other"] as const;
export type TaxDocLabel = (typeof TAX_DOC_LABELS)[number];

export const TAX_LABEL_COPY: Record<
  TaxDocLabel,
  { en: string; es: string }
> = {
  "W-2": { en: "W-2", es: "W-2" },
  "1099": { en: "1099", es: "1099" },
  ID: { en: "ID", es: "Identificación" },
  Other: { en: "Other", es: "Otro" },
};

export function isTaxDocLabel(value: string): value is TaxDocLabel {
  return (TAX_DOC_LABELS as readonly string[]).includes(value);
}

export function isTaxOfficeClient(
  client: Pick<Client, "template"> | null | undefined,
): client is Client {
  return Boolean(client && isTaxOfficeTemplate(client.template));
}

export function portalPath(slug: string, suffix = "") {
  const base = `/s/${slug}/portal`;
  if (!suffix) return base;
  return `${base}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;
}

export function taxBlobPrefix(clientId: string, userId: string) {
  return `tax-portal/${clientId}/${userId}/`;
}

export function safeUploadFilename(name: string) {
  const trimmed = name.trim().replace(/[/\\]/g, "").slice(0, 120);
  return trimmed || "document.pdf";
}

export function isAllowedContentType(type: string) {
  return (ALLOWED_CONTENT_TYPES as readonly string[]).includes(type);
}

/** Staff bootstrap for Alex’s live Hola Tax shop only. Not a global staff password. */
export function holaTaxStaffBootstrap() {
  return {
    email: (
      process.env.HOLA_TAX_STAFF_EMAIL || "ochoa.alejandro2@gmail.com"
    )
      .trim()
      .toLowerCase(),
    password: process.env.HOLA_TAX_STAFF_PASSWORD || "",
  };
}
