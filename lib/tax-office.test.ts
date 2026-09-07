import assert from "node:assert/strict";
import test from "node:test";
import { PA_FINANCIAL_SLUG } from "./pa-financial-i18n.ts";
import {
  FILED_COPY_LABEL,
  isTaxIntakeLabel,
  paFinancialStaffBootstrap,
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
  const prevPa = process.env.PA_FINANCIAL_STAFF_PASSWORD;
  const prevHola = process.env.HOLA_TAX_STAFF_PASSWORD;
  process.env.PA_FINANCIAL_STAFF_PASSWORD = "pa-only-secret";
  process.env.HOLA_TAX_STAFF_PASSWORD = "hola-other-secret";
  try {
    const pa = paFinancialStaffBootstrap();
    assert.equal(pa.email, "pafinancial19@gmail.com");
    assert.equal(pa.password, "pa-only-secret");
    assert.equal(pa.password === process.env.HOLA_TAX_STAFF_PASSWORD, false);
    const boot = taxOfficeStaffBootstrap("pa-financial");
    assert.equal(boot.email, "pafinancial19@gmail.com");
    assert.equal(boot.password, "pa-only-secret");
    const hola = taxOfficeStaffBootstrap("hola-tax-service");
    assert.equal(hola.password, "hola-other-secret");
    assert.equal(taxOfficeStaffBootstrap("other-shop").password, "");
  } finally {
    if (prevPa == null) delete process.env.PA_FINANCIAL_STAFF_PASSWORD;
    else process.env.PA_FINANCIAL_STAFF_PASSWORD = prevPa;
    if (prevHola == null) delete process.env.HOLA_TAX_STAFF_PASSWORD;
    else process.env.HOLA_TAX_STAFF_PASSWORD = prevHola;
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
});
