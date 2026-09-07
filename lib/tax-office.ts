import type { Client } from "@/lib/types";
import { HOLA_TAX_SLUG, isTaxOfficeTemplate } from "./client-themes.ts";
import { PA_FINANCIAL_SLUG } from "./pa-financial-i18n.ts";

export const TAX_TEMPLATE_ID = "tax" as const;

/** Live first example. Used only to migrate that record onto the tax template. */
export { HOLA_TAX_SLUG };

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_SCAN_PAGES = 5;
export const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export const TAX_INTAKE_LABELS = ["W-2", "1099", "ID", "Other"] as const;
export const FILED_COPY_LABEL = "Filed copy" as const;
export const TAX_DOC_LABELS = [...TAX_INTAKE_LABELS, FILED_COPY_LABEL] as const;
export type TaxIntakeLabel = (typeof TAX_INTAKE_LABELS)[number];
export type TaxDocLabel = (typeof TAX_DOC_LABELS)[number];
export type TaxFileKind = "intake" | "filed";

export const TAX_LABEL_COPY: Record<
  TaxDocLabel,
  { en: string; es: string }
> = {
  "W-2": { en: "W-2", es: "W-2" },
  "1099": { en: "1099", es: "1099" },
  ID: { en: "ID", es: "Identificación" },
  Other: { en: "Other", es: "Otro" },
  "Filed copy": { en: "Filed copy", es: "Copia presentada" },
};

export function isTaxDocLabel(value: string): value is TaxDocLabel {
  return (TAX_DOC_LABELS as readonly string[]).includes(value);
}

export function isTaxIntakeLabel(value: string): value is TaxIntakeLabel {
  return (TAX_INTAKE_LABELS as readonly string[]).includes(value);
}

export function resolveTaxFileKind(
  staff: boolean,
  requested?: string | null,
): TaxFileKind {
  return staff && requested === "filed" ? "filed" : "intake";
}

export function resolveTaxIntakeLabel(value: string): TaxIntakeLabel | null {
  return isTaxIntakeLabel(value) ? value : null;
}

/** Current calendar year plus the previous three tax years (rolls forward). */
export function taxReturnYears(now = new Date()) {
  const year = now.getFullYear();
  return [year, year - 1, year - 2, year - 3];
}

/** Years staff can upload into — matches the folders on the portal. */
export function isTaxReturnYear(value: unknown, now = new Date()) {
  const year = Number(value);
  return Number.isInteger(year) && taxReturnYears(now).includes(year);
}

export function splitTaxFiles<
  T extends { kind?: string; taxYear?: number | null; label?: string },
>(files: T[], years: number[]) {
  const filed = files.filter(
    (file) => file.kind === "filed" || file.label === FILED_COPY_LABEL,
  );
  const intake = files.filter((file) => !filed.includes(file));
  const byYear = years.map((year) => ({
    year,
    files: filed.filter((file) => file.taxYear === year),
  }));
  const otherYears = filed.filter(
    (file) => !years.includes(Number(file.taxYear || 0)),
  );
  return { intake, byYear, otherYears };
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

export function scanPdfFilename(label: string) {
  const slug =
    label.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "document";
  return `${slug}-scan.pdf`;
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

/** Patricia’s P&A Financial staff login only. Never reuse Hola or owner passwords. */
export function paFinancialStaffBootstrap() {
  return {
    email: (
      process.env.PA_FINANCIAL_STAFF_EMAIL || "pafinancial19@gmail.com"
    )
      .trim()
      .toLowerCase(),
    password: process.env.PA_FINANCIAL_STAFF_PASSWORD || "",
  };
}

export function taxOfficeStaffBootstrap(slug: string) {
  if (slug === HOLA_TAX_SLUG) return holaTaxStaffBootstrap();
  if (slug === PA_FINANCIAL_SLUG) return paFinancialStaffBootstrap();
  return { email: "", password: "" };
}
