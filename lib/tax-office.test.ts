import assert from "node:assert/strict";
import test from "node:test";
import { PA_FINANCIAL_SLUG } from "./pa-financial-i18n.ts";
import {
  FILED_COPY_LABEL,
  isTaxIntakeLabel,
  isTaxReturnYear,
  paFinancialStaffBootstrap,
  resolveTaxFileKind,
  splitTaxFiles,
  taxOfficeStaffBootstrap,
  taxReturnYears,
} from "./tax-office.ts";

test("tax return years roll forward from the current calendar year", () => {
  assert.deepEqual(taxReturnYears(new Date("2026-09-07T12:00:00Z")), [
    2026, 2025, 2024, 2023,
  ]);
  assert.deepEqual(taxReturnYears(new Date("2027-01-15T12:00:00Z")), [
    2027, 2026, 2025, 2024,
  ]);
});

test("P&A Financial staff bootstrap is Patricia’s email and its own password env", () => {
  assert.equal(PA_FINANCIAL_SLUG, "pa-financial");
  const prevPaPass = process.env.PA_FINANCIAL_STAFF_PASSWORD;
  const prevPaEmail = process.env.PA_FINANCIAL_STAFF_EMAIL;
  const prevHolaPass = process.env.HOLA_TAX_STAFF_PASSWORD;
  const prevHolaEmail = process.env.HOLA_TAX_STAFF_EMAIL;
  delete process.env.PA_FINANCIAL_STAFF_EMAIL;
  delete process.env.HOLA_TAX_STAFF_EMAIL;
  process.env.PA_FINANCIAL_STAFF_PASSWORD = "pa-only-secret";
  process.env.HOLA_TAX_STAFF_PASSWORD = "hola-other-secret";
  try {
    const pa = paFinancialStaffBootstrap();
    const hola = taxOfficeStaffBootstrap("hola-tax-service");
    assert.equal(pa.email, "pafinancial19@gmail.com");
    assert.equal(pa.email.includes("ochoa.alejandro2"), false);
    assert.equal(hola.email, "ochoa.alejandro2@gmail.com");
    assert.equal(pa.email === hola.email, false);
    assert.equal(pa.password, "pa-only-secret");
    assert.equal(pa.password === hola.password, false);
    const boot = taxOfficeStaffBootstrap("pa-financial");
    assert.equal(boot.email, "pafinancial19@gmail.com");
    assert.equal(boot.password, "pa-only-secret");
    delete process.env.PA_FINANCIAL_STAFF_PASSWORD;
    assert.equal(taxOfficeStaffBootstrap("pa-financial").password, "");
    assert.equal(taxOfficeStaffBootstrap("hola-tax-service").password, "hola-other-secret");
    assert.equal(taxOfficeStaffBootstrap("other-shop").password, "");
  } finally {
    if (prevPaPass == null) delete process.env.PA_FINANCIAL_STAFF_PASSWORD;
    else process.env.PA_FINANCIAL_STAFF_PASSWORD = prevPaPass;
    if (prevPaEmail == null) delete process.env.PA_FINANCIAL_STAFF_EMAIL;
    else process.env.PA_FINANCIAL_STAFF_EMAIL = prevPaEmail;
    if (prevHolaPass == null) delete process.env.HOLA_TAX_STAFF_PASSWORD;
    else process.env.HOLA_TAX_STAFF_PASSWORD = prevHolaPass;
    if (prevHolaEmail == null) delete process.env.HOLA_TAX_STAFF_EMAIL;
    else process.env.HOLA_TAX_STAFF_EMAIL = prevHolaEmail;
  }
});

test("filed copies group by tax year and stay separate from intake", () => {
  const files = [
    { label: "W-2", kind: "intake" as const, taxYear: null },
    { label: FILED_COPY_LABEL, kind: "filed" as const, taxYear: 2025 },
    { label: FILED_COPY_LABEL, kind: "filed" as const, taxYear: 2024 },
    { label: "1099", kind: "intake" as const, taxYear: null },
  ];
  const grouped = splitTaxFiles(files, [2026, 2025, 2024, 2023]);
  assert.equal(grouped.intake.length, 2);
  assert.equal(grouped.byYear.find((row) => row.year === 2025)?.files.length, 1);
  assert.equal(grouped.byYear.find((row) => row.year === 2023)?.files.length, 0);
  assert.equal(isTaxIntakeLabel("W-2"), true);
  assert.equal(isTaxIntakeLabel("Filed copy"), false);
  assert.equal(resolveTaxFileKind(false, "filed"), "intake");
  assert.equal(resolveTaxFileKind(true, "filed"), "filed");
  const now = new Date("2026-09-07T12:00:00Z");
  assert.equal(isTaxReturnYear(2023, now), true);
  assert.equal(isTaxReturnYear(2022, now), false);
  assert.equal(isTaxReturnYear(2026, now), true);
});
