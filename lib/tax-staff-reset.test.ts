import assert from "node:assert/strict";
import test from "node:test";
import { PA_FINANCIAL_SLUG } from "./pa-financial-i18n.ts";
import { HOLA_TAX_SLUG } from "./client-themes.ts";
import { taxOfficeStaffBootstrap } from "./tax-office.ts";
import {
  createStaffResetToken,
  isStaffResetEligible,
  readStaffResetToken,
  staffResetAbsoluteUrl,
  staffResetEmailBodies,
  staffResetMatchesShop,
  staffResetMayCreateUser,
  STAFF_RESET_TTL_MS,
} from "./tax-staff-reset.ts";

const prevAuth = process.env.AUTH_SECRET;
const prevPaEmail = process.env.PA_FINANCIAL_STAFF_EMAIL;
const prevHolaEmail = process.env.HOLA_TAX_STAFF_EMAIL;

test("staff reset is only for that shop’s staff or its bootstrap email", () => {
  delete process.env.PA_FINANCIAL_STAFF_EMAIL;
  delete process.env.HOLA_TAX_STAFF_EMAIL;
  try {
    const paBoot = taxOfficeStaffBootstrap(PA_FINANCIAL_SLUG).email;
    const holaBoot = taxOfficeStaffBootstrap(HOLA_TAX_SLUG).email;
    assert.equal(paBoot, "pafinancial19@gmail.com");
    assert.equal(holaBoot, "ochoa.alejandro2@gmail.com");
    assert.equal(paBoot === holaBoot, false);

    assert.equal(
      isStaffResetEligible({
        email: paBoot,
        user: null,
        bootstrapEmail: paBoot,
      }),
      true,
    );
    assert.equal(
      staffResetMayCreateUser({
        email: paBoot,
        user: null,
        bootstrapEmail: paBoot,
      }),
      true,
    );
    assert.equal(
      isStaffResetEligible({
        email: holaBoot,
        user: null,
        bootstrapEmail: paBoot,
      }),
      false,
    );
    assert.equal(
      isStaffResetEligible({
        email: paBoot,
        user: null,
        bootstrapEmail: holaBoot,
      }),
      false,
    );
    assert.equal(
      isStaffResetEligible({
        email: "stranger@example.com",
        user: null,
        bootstrapEmail: paBoot,
      }),
      false,
    );
    assert.equal(
      isStaffResetEligible({
        email: paBoot,
        user: { role: "customer" },
        bootstrapEmail: paBoot,
      }),
      false,
    );
    assert.equal(
      staffResetMayCreateUser({
        email: paBoot,
        user: { role: "customer" },
        bootstrapEmail: paBoot,
      }),
      false,
    );
    assert.equal(
      isStaffResetEligible({
        email: "extra-staff@pa.example",
        user: { role: "staff" },
        bootstrapEmail: paBoot,
      }),
      true,
    );
    assert.equal(
      staffResetMayCreateUser({
        email: "extra-staff@pa.example",
        user: { role: "staff" },
        bootstrapEmail: paBoot,
      }),
      false,
    );
    assert.equal(
      isStaffResetEligible({
        email: paBoot,
        user: { role: "staff" },
        bootstrapEmail: "",
      }),
      true,
    );
    assert.equal(
      isStaffResetEligible({
        email: "anyone@example.com",
        user: null,
        bootstrapEmail: "",
      }),
      false,
    );
  } finally {
    if (prevPaEmail == null) delete process.env.PA_FINANCIAL_STAFF_EMAIL;
    else process.env.PA_FINANCIAL_STAFF_EMAIL = prevPaEmail;
    if (prevHolaEmail == null) delete process.env.HOLA_TAX_STAFF_EMAIL;
    else process.env.HOLA_TAX_STAFF_EMAIL = prevHolaEmail;
  }
});

test("a reset token for shop A cannot be used on shop B", () => {
  process.env.AUTH_SECRET = "staff-reset-test-secret";
  try {
    const { token, claims } = createStaffResetToken({
      clientId: "cli_pa",
      email: "pafinancial19@gmail.com",
      slug: "pa-financial",
    });
    const read = readStaffResetToken(token);
    assert.ok(read);
    assert.equal(read?.clientId, "cli_pa");
    assert.equal(read?.slug, "pa-financial");
    assert.equal(read?.jti, claims.jti);
    assert.equal(
      staffResetMatchesShop(claims, { clientId: "cli_pa", slug: "pa-financial" }),
      true,
    );
    assert.equal(
      staffResetMatchesShop(claims, {
        clientId: "cli_hola",
        slug: "hola-tax-service",
      }),
      false,
    );
    assert.equal(
      staffResetMatchesShop(claims, {
        clientId: "cli_pa",
        slug: "hola-tax-service",
      }),
      false,
    );
    const tampered = `${token.slice(0, -2)}aa`;
    assert.equal(readStaffResetToken(tampered), null);
    assert.equal(readStaffResetToken("not-a-token"), null);
    process.env.AUTH_SECRET = "some-other-secret";
    assert.equal(readStaffResetToken(token), null);
    process.env.AUTH_SECRET = "staff-reset-test-secret";
    assert.ok(readStaffResetToken(token));
    const other = createStaffResetToken({
      clientId: "cli_hola",
      email: "pafinancial19@gmail.com",
      slug: "hola-tax-service",
    });
    assert.equal(
      staffResetMatchesShop(other.claims, {
        clientId: "cli_pa",
        slug: "pa-financial",
      }),
      false,
    );
  } finally {
    if (prevAuth == null) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = prevAuth;
  }
});

test("staff reset tokens expire and the email includes a one-time link", () => {
  process.env.AUTH_SECRET = "staff-reset-test-secret";
  try {
    const now = Date.now();
    const { token } = createStaffResetToken(
      {
        clientId: "cli_pa",
        email: "Patricia@Gmail.Example",
        slug: "pa-financial",
      },
      now,
    );
    assert.ok(readStaffResetToken(token, now + 1_000));
    assert.equal(
      readStaffResetToken(token, now + STAFF_RESET_TTL_MS + 1),
      null,
    );
    const url = staffResetAbsoluteUrl(
      "https://phoenixwebhost.com",
      "pa-financial",
      token,
      "es",
    );
    assert.match(url, /\/s\/pa-financial\/portal\/staff\/reset\?/);
    assert.match(url, /lang=es/);
    assert.match(url, /token=/);
    const en = staffResetEmailBodies({
      businessName: "P&A Financial LLC",
      resetUrl: url,
      locale: "en",
    });
    const es = staffResetEmailBodies({
      businessName: "P&A Financial LLC",
      resetUrl: url,
      locale: "es",
    });
    assert.match(en.subject, /P&A Financial LLC/);
    assert.match(en.text, /30 minutes/);
    assert.match(en.text, url);
    assert.match(es.subject, /P&A Financial LLC/);
    assert.match(es.text, /30 minutos/);
    assert.match(es.text, url);
    assert.equal(en.html.includes("<script"), false);
  } finally {
    if (prevAuth == null) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = prevAuth;
  }
});
