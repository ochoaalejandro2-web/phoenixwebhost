import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  PA_FINANCIAL_INSTAGRAM,
  PA_FINANCIAL_IRS_REFUND,
  PA_FINANCIAL_LOGO,
  PA_FINANCIAL_OWNER,
  PA_FINANCIAL_WHATSAPP,
} from "./pa-financial-i18n.ts";
import {
  isHolaTaxLayout,
  isTaxProLayout,
  paFinancialGoogleReviewUrlFromEnv,
  readTaxBrandFields,
  sanitizeHttpUrl,
  sanitizePublicAssetPath,
  taxOfficeGoogleReviewUrl,
  taxOfficeLogoSrc,
  taxOfficeThemeClass,
  taxProBrand,
  taxProCopy,
  taxProRefundLinks,
  whatsappHrefFromPhone,
} from "./tax-office-layout.ts";
import type { Client } from "./types.ts";

function taxClient(patch: Partial<Client> = {}): Client {
  return {
    id: "cli_next",
    businessName: "Next Tax LLC",
    slug: "next-tax-llc",
    contactName: "Jordan Owner",
    email: "office@nexttax.example",
    phone: "(480) 555-0100",
    address: "100 Main St",
    city: "Mesa, AZ",
    hours: "Mon–Fri 9am–5pm",
    tagline: "Mesa tax prep",
    about: "We file household returns in Mesa.",
    services: ["Personal tax preparation", "ITIN applications"],
    template: "tax",
    customDomain: null,
    siteStatus: "live",
    paymentStatus: "paid",
    lastPaymentAt: null,
    nextInvoiceAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeBoostSubscriptionId: null,
    localBoost: false,
    stripeTrafficSubscriptionId: null,
    trafficAds: false,
    stripeLoudSubscriptionId: null,
    loudAds: false,
    stripeEmailSubscriptionId: null,
    businessEmail: false,
    reminderSentAt: null,
    overdueSince: null,
    offlineAt: null,
    filesKeptUntil: null,
    takenDownAt: null,
    notes: [],
    editRequests: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    ...patch,
  };
}

test("Hola Tax stays off the Pro layout; other tax shops use it", () => {
  assert.equal(isHolaTaxLayout("hola-tax-service"), true);
  assert.equal(isTaxProLayout(taxClient({ slug: "hola-tax-service" })), false);
  assert.equal(isTaxProLayout(taxClient()), true);
  assert.equal(isTaxProLayout(taxClient({ slug: "pa-financial" })), true);
  assert.equal(isTaxProLayout(taxClient({ template: "salon" })), false);
});

test("next tax client copy comes from seed fields, not Patricia", () => {
  const copy = taxProCopy(taxClient(), "en");
  assert.equal(copy.aboutTitle, "What we do");
  assert.equal(copy.readyCta, "Ready to call or schedule an appointment?");
  assert.equal(copy.scheduleCta, "Schedule appointment");
  assert.match(copy.heroLede, /Mesa/);
  assert.equal(copy.heroLede.includes("Patricia"), false);
  assert.equal(copy.ownerName, "Jordan Owner");
  assert.equal(copy.whatWeDo.length, 2);
  assert.equal(copy.whatWeDo[0].title, "Personal tax preparation");
  const es = taxProCopy(taxClient(), "es");
  assert.equal(es.aboutTitle, "Qué hacemos");
  assert.match(es.scheduleBlurb, /Next Tax LLC/);
  const pa = taxProCopy(taxClient({ slug: "pa-financial" }), "en");
  assert.match(pa.about, /Patricia Escobedo/);
  assert.equal(pa.aboutTitle, "What we do");
});

test("refund helpers default to IRS; P&A keeps Arizona and payments", () => {
  const next = taxProRefundLinks(taxClient(), "en");
  assert.equal(next.length, 1);
  assert.equal(next[0].href, PA_FINANCIAL_IRS_REFUND);
  assert.equal(next[0].label, "IRS Where's My Refund");
  const pa = taxProRefundLinks(taxClient({ slug: "pa-financial" }), "en");
  assert.equal(pa.length, 3);
  assert.equal(pa[0].href, PA_FINANCIAL_IRS_REFUND);
});

test("logo, theme class, and WhatsApp come from client fields with P&A fallbacks", () => {
  assert.equal(taxOfficeLogoSrc(taxClient()), "");
  assert.equal(
    taxOfficeLogoSrc(
      taxClient({ logoSrc: "/clients/next-tax-llc/logo-brand.svg" }),
    ),
    "/clients/next-tax-llc/logo-brand.svg",
  );
  assert.equal(taxOfficeLogoSrc(taxClient({ slug: "pa-financial" })), PA_FINANCIAL_LOGO);
  const theme = taxOfficeThemeClass(taxClient());
  assert.match(theme, /theme-tax-office/);
  assert.match(theme, /theme-tax-pro/);
  assert.match(theme, /theme-next-tax-llc/);
  assert.equal(taxOfficeThemeClass(taxClient({ slug: "hola-tax-service" })), "theme-tax-office");
  assert.equal(whatsappHrefFromPhone("(480) 555-0100"), "https://wa.me/14805550100");
  const brand = taxProBrand(taxClient(), "en");
  assert.equal(brand.logoSrc, "");
  assert.equal(brand.ownerPhotoSrc, "");
  assert.ok(brand.socials.some((row) => row.kind === "whatsapp" && row.href === "https://wa.me/14805550100"));
  assert.equal(
    brand.socials.some((row) => row.kind === "instagram"),
    false,
  );
  const pa = taxProBrand(taxClient({ slug: "pa-financial" }), "en");
  assert.equal(pa.logoSrc, PA_FINANCIAL_LOGO);
  assert.equal(pa.ownerPhotoSrc, PA_FINANCIAL_OWNER);
  assert.ok(pa.socials.some((row) => row.href === PA_FINANCIAL_WHATSAPP));
  assert.ok(pa.socials.some((row) => row.href === PA_FINANCIAL_INSTAGRAM));
});

test("brand field sanitizers reject unsafe paths and non-http URLs", () => {
  assert.equal(sanitizePublicAssetPath("/clients/acme/logo.svg"), "/clients/acme/logo.svg");
  assert.equal(sanitizePublicAssetPath("//evil.example/x"), "");
  assert.equal(sanitizePublicAssetPath("/clients/../secret"), "");
  assert.equal(sanitizeHttpUrl("https://www.instagram.com/acme"), "https://www.instagram.com/acme");
  assert.equal(sanitizeHttpUrl("javascript:alert(1)"), "");
  const fields = readTaxBrandFields(new FormData());
  assert.equal(fields.logoSrc, undefined);
  const fd = new FormData();
  fd.set("logoSrc", "/clients/acme/logo-brand.svg");
  fd.set("instagram", "https://instagram.com/acme");
  fd.set("facebook", "not-a-url");
  fd.set("googleReviewUrl", "javascript:alert(1)");
  const next = readTaxBrandFields(fd);
  assert.equal(next.logoSrc, "/clients/acme/logo-brand.svg");
  assert.match(String(next.instagram), /instagram\.com\/acme/);
  assert.equal(next.facebook, undefined);
  assert.equal(next.googleReviewUrl, undefined);
  const saved = new FormData();
  saved.set("googleReviewUrl", "https://g.page/r/abc/review");
  assert.equal(
    readTaxBrandFields(saved).googleReviewUrl,
    "https://g.page/r/abc/review",
  );
});

test("google review URL prefers the client brand field and hides when empty", () => {
  assert.equal(taxOfficeGoogleReviewUrl(taxClient()), "");
  assert.equal(
    taxOfficeGoogleReviewUrl(
      taxClient({ googleReviewUrl: "https://g.page/r/abc/review" }),
    ),
    "https://g.page/r/abc/review",
  );
  assert.equal(
    taxOfficeGoogleReviewUrl(taxClient({ googleReviewUrl: "javascript:alert(1)" })),
    "",
  );
  const prev = process.env.PA_FINANCIAL_GOOGLE_REVIEW_URL;
  process.env.PA_FINANCIAL_GOOGLE_REVIEW_URL =
    "https://search.google.com/local/writereview?placeid=ChIJ";
  try {
    assert.match(
      paFinancialGoogleReviewUrlFromEnv(),
      /search\.google\.com\/local\/writereview/,
    );
    assert.equal(taxOfficeGoogleReviewUrl(taxClient()), "");
    assert.match(
      taxOfficeGoogleReviewUrl(taxClient({ slug: "pa-financial" })),
      /search\.google\.com\/local\/writereview/,
    );
    assert.equal(
      taxOfficeGoogleReviewUrl(
        taxClient({
          slug: "pa-financial",
          googleReviewUrl: "https://g.page/r/override/review",
        }),
      ),
      "https://g.page/r/override/review",
    );
    const brand = taxProBrand(
      taxClient({ googleReviewUrl: "https://g.page/r/shop/review" }),
      "en",
    );
    assert.equal(brand.googleReviewUrl, "https://g.page/r/shop/review");
    assert.equal(taxProBrand(taxClient(), "en").googleReviewUrl, "");
    delete process.env.PA_FINANCIAL_GOOGLE_REVIEW_URL;
    assert.equal(taxOfficeGoogleReviewUrl(taxClient({ slug: "pa-financial" })), "");
    assert.equal(paFinancialGoogleReviewUrlFromEnv(), "");
  } finally {
    if (prev == null) delete process.env.PA_FINANCIAL_GOOGLE_REVIEW_URL;
    else process.env.PA_FINANCIAL_GOOGLE_REVIEW_URL = prev;
  }
});

test("TaxOfficeSite uses the shared Pro layout instead of a P&A-only fork", () => {
  const site = readFileSync(
    new URL("../components/sites/TaxOfficeSite.tsx", import.meta.url),
    "utf8",
  );
  assert.match(site, /isTaxProLayout/);
  assert.match(site, /taxProCopy/);
  assert.match(site, /taxProBrand/);
  assert.match(site, /href="#appointment"/);
  assert.match(site, /pa-logo-spin/);
  assert.match(site, /pa-appoint-logo/);
  assert.match(site, /LeaveReviewCta/);
  assert.match(site, /brand\.googleReviewUrl|taxOfficeGoogleReviewUrl/);
  assert.equal(site.includes("★★★★★"), false);
  assert.equal(site.includes("PA_FINANCIAL_WHATSAPP"), false);
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /theme-tax-pro/);
  assert.match(css, /\.pa-appoint-logo[\s\S]*animation:\s*pa-logo-spin/);
  assert.match(
    css,
    /prefers-reduced-motion:\s*reduce[\s\S]*theme-tax-pro[\s\S]*\.pa-appoint-logo[\s\S]*animation:\s*none/,
  );
});
