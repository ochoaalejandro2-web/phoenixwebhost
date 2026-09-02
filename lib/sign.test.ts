import assert from "node:assert/strict";
import test from "node:test";
import { PDFDocument } from "pdf-lib";
import {
  SIGN_CODE_ALPHABET,
  SIGN_CODE_LENGTH,
  formatSignCode,
  generateSignCode,
  publicSignErrorMessage,
  publicSignStatus,
  safePdfFilename,
  signBlobPath,
  signCleanupPaths,
  signCleanupPrefixes,
  signCodeLookupKey,
  signPathAllowed,
  signPublicPath,
  signStoragePrefix,
  signedDownloadName,
  normalizeSignBoxes,
  normalizeSignBox,
  signBoxPdfRect,
  newSignBox,
} from "./sign.ts";
import { pngFromDataUrl, stampSignedPdf } from "./sign-pdf.ts";

test("sign codes are 8 unguessable alphabet chars, not 1234", () => {
  const codes = new Set<string>();
  for (let i = 0; i < 80; i += 1) {
    const code = generateSignCode();
    assert.equal(code.length, SIGN_CODE_LENGTH);
    assert.match(code, new RegExp(`^[${SIGN_CODE_ALPHABET}]{${SIGN_CODE_LENGTH}}$`));
    assert.notEqual(code, "12345678");
    codes.add(code);
  }
  assert.ok(codes.size > 70);
});

test("code lookup ignores hyphens and case, rejects short or ambiguous codes", () => {
  assert.equal(signCodeLookupKey("k7m2-p9qx"), "K7M2P9QX");
  assert.equal(formatSignCode("k7m2p9qx"), "K7M2-P9QX");
  assert.equal(signCodeLookupKey("1234"), null);
  assert.equal(signCodeLookupKey("AAAAAA"), null);
  assert.equal(signCodeLookupKey("O0O0-O0O0"), null);
  assert.equal(signPublicPath("k7m2p9qx"), "/sign/K7M2-P9QX");
});

test("wrong, expired, and already-signed codes have clear errors and do not list other docs", () => {
  const now = Date.parse("2026-03-02T12:00:00.000Z");
  assert.equal(
    publicSignStatus(
      { status: "pending", expiresAt: "2026-03-01T00:00:00.000Z" },
      now,
    ),
    "expired",
  );
  assert.equal(
    publicSignStatus(
      { status: "signed", expiresAt: "2026-04-01T00:00:00.000Z" },
      now,
    ),
    "signed",
  );
  assert.equal(
    publicSignStatus(
      { status: "pending", expiresAt: "2026-04-01T00:00:00.000Z" },
      now,
    ),
    "pending",
  );
  for (const kind of ["invalid", "expired", "signed"] as const) {
    const message = publicSignErrorMessage(kind);
    assert.equal(message.includes("Estimate.pdf"), false);
    assert.equal(message.includes("other"), false);
    assert.ok(message.length > 10);
  }
});

test("file paths stay under the private sign-docs prefix, not a public folder", () => {
  const pathname = signBlobPath("sign_abc", "original");
  assert.equal(pathname.startsWith("sign-docs/"), true);
  assert.equal(pathname.includes("public"), false);
  assert.equal(signPathAllowed(pathname), true);
  assert.equal(signPathAllowed("sign-docs/../secret.pdf"), false);
  assert.equal(signPathAllowed("/public/file.pdf"), false);
  assert.equal(safePdfFilename("a/b\\c.pdf"), "abc.pdf");
  assert.equal(signedDownloadName("Job.pdf"), "Job-signed.pdf");
});

test("cleanup prefixes are per-document folders, not the whole sign-docs tree", () => {
  const original = "sign-docs/aaaa-bbbb/original-xyz.pdf";
  const signed = signBlobPath("sign_cccc", "signed");
  assert.equal(signStoragePrefix(original), "sign-docs/aaaa-bbbb/");
  assert.equal(signStoragePrefix(signed), "sign-docs/sign_cccc/");
  assert.equal(signStoragePrefix("sign-docs/orphan.pdf"), null);
  assert.equal(signStoragePrefix("sign-docs/"), null);
  assert.equal(signStoragePrefix("public/file.pdf"), null);
  const prefixes = signCleanupPrefixes([
    original,
    signed,
    null,
    "sign-docs/../secret.pdf",
  ]);
  assert.deepEqual(prefixes.sort(), [
    "sign-docs/aaaa-bbbb/",
    "sign-docs/sign_cccc/",
  ]);
  assert.equal(prefixes.includes("sign-docs/"), false);
  assert.deepEqual(signCleanupPaths([original, null, "nope.pdf"]), [original]);
});

test("stamping a signed PDF adds a signature page with name and timestamp", async () => {
  const source = await PDFDocument.create();
  source.addPage([612, 792]);
  const original = await source.save();
  const signed = await stampSignedPdf({
    original,
    signerName: "Jane Doe",
    acknowledged: true,
    signedAt: new Date("2026-03-02T20:04:00.000Z"),
  });
  const loaded = await PDFDocument.load(signed);
  assert.equal(loaded.getPageCount(), 2);
  assert.equal(pngFromDataUrl("not-a-png"), null);
  assert.ok(
    pngFromDataUrl(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    ),
  );
});

test("sign-here boxes stay on one page as fractions and map to PDF coordinates", () => {
  const junk = normalizeSignBoxes([
    { id: "ok_box_1", page: 0, x: 0.1, y: 0.2, w: 0.3, h: 0.1 },
    { page: -1, x: 0, y: 0, w: 0.2, h: 0.1 },
    { id: "ok_box_1", page: 0, x: 0.5, y: 0.5, w: 0.2, h: 0.1 },
    null,
    { page: 0, x: "nope", y: 0, w: 0.2, h: 0.1 },
  ]);
  assert.equal(junk.length, 2);
  assert.equal(junk[0].page, 0);
  assert.equal(normalizeSignBox({ page: 0, x: -2, y: 0, w: 0.3, h: 0.1 })?.x, 0);
  const rect = signBoxPdfRect(
    { id: "a", page: 0, x: 0, y: 0, w: 1, h: 0.1 },
    612,
    792,
  );
  assert.equal(rect.x, 0);
  assert.equal(rect.w, 612);
  assert.ok(Math.abs(rect.h - 79.2) < 0.01);
  assert.ok(Math.abs(rect.y - (792 - 79.2)) < 0.01);
  const dropped = newSignBox(1, 0.5, 0.5);
  assert.equal(dropped.page, 1);
  assert.ok(dropped.x >= 0 && dropped.x + dropped.w <= 1);
});

test("stamping with sign-here boxes keeps the extra signature page", async () => {
  const source = await PDFDocument.create();
  source.addPage([612, 792]);
  const original = await source.save();
  const signed = await stampSignedPdf({
    original,
    signerName: "Jane Doe",
    acknowledged: true,
    signedAt: new Date("2026-03-02T20:04:00.000Z"),
    boxes: [{ id: "ok_box_1", page: 0, x: 0.1, y: 0.8, w: 0.4, h: 0.08 }],
  });
  const loaded = await PDFDocument.load(signed);
  assert.equal(loaded.getPageCount(), 2);
});
