/** Per-template look. Tax office uses white / black / neon green. */

/** Live first example. Shared with the Hola Tax i18n PR for the EN/ES toggle. */
export const HOLA_TAX_SLUG = "hola-tax-service";

export function isTaxOfficeTemplate(template: string) {
  return template === "tax";
}

export function clientThemeClass(template: string) {
  return isTaxOfficeTemplate(template) ? "theme-tax-office" : "";
}
