/** Per-client look overrides. Do not change template defaults. */
export const HOLA_TAX_SLUG = "hola-tax-service";

export function clientThemeClass(slug: string) {
  if (slug === HOLA_TAX_SLUG) return "theme-hola-tax";
  return "";
}
