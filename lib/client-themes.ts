/** Per-template look. Tax office uses white / black / neon green. */

export function isTaxOfficeTemplate(template: string) {
  return template === "tax";
}

export function clientThemeClass(template: string) {
  return isTaxOfficeTemplate(template) ? "theme-tax-office" : "";
}
