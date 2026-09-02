import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  formatPhoenixStamp,
  normalizeSignBoxes,
  sanitizeSignerName,
  signBoxPdfRect,
  type SignHereBox,
} from "./sign.ts";

export function pngFromDataUrl(dataUrl: string) {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/]+=*)$/.exec(dataUrl.trim());
  if (!match) return null;
  if (match[1].length > 400_000) return null;
  return Buffer.from(match[1], "base64");
}

function fitTextSize(font: PDFFont, text: string, maxWidth: number, maxSize: number) {
  let size = maxSize;
  while (size > 7 && font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 0.5;
  }
  return size;
}

function stampNameInBox(
  page: PDFPage,
  box: SignHereBox,
  name: string,
  italic: PDFFont,
) {
  const { width, height } = page.getSize();
  const rect = signBoxPdfRect(box, width, height);
  if (rect.w < 8 || rect.h < 8) return;
  const size = fitTextSize(italic, name, rect.w - 8, Math.min(22, rect.h * 0.55));
  const textWidth = italic.widthOfTextAtSize(name, size);
  page.drawText(name, {
    x: rect.x + Math.max(4, (rect.w - textWidth) / 2),
    y: rect.y + (rect.h - size) / 2,
    size,
    font: italic,
    color: rgb(0, 0, 0),
  });
}

export async function stampSignedPdf(input: {
  original: Uint8Array;
  signerName: string;
  acknowledged: boolean;
  signaturePng?: Uint8Array | null;
  signedAt: Date;
  boxes?: SignHereBox[];
}) {
  const pdf = await PDFDocument.load(input.original);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const name = sanitizeSignerName(input.signerName) || "Signature";
  const boxes = normalizeSignBoxes(input.boxes);
  const pages = pdf.getPages();
  const embedded =
    input.signaturePng && input.signaturePng.length > 0
      ? await pdf.embedPng(input.signaturePng)
      : null;

  for (const box of boxes) {
    const page = pages[box.page];
    if (!page) continue;
    if (embedded) {
      const { width, height } = page.getSize();
      const rect = signBoxPdfRect(box, width, height);
      if (rect.w < 8 || rect.h < 8) continue;
      const scale = Math.min(rect.w / embedded.width, rect.h / embedded.height);
      const w = embedded.width * scale;
      const h = embedded.height * scale;
      page.drawImage(embedded, {
        x: rect.x + (rect.w - w) / 2,
        y: rect.y + (rect.h - h) / 2,
        width: w,
        height: h,
      });
    } else {
      stampNameInBox(page, box, name, italic);
    }
  }

  const page = pdf.addPage();
  const { width, height } = page.getSize();
  const left = 54;
  const maxWidth = width - left * 2;
  let y = height - 72;

  page.drawText("Signature", {
    x: left,
    y,
    size: 18,
    font: bold,
    color: rgb(0, 0, 0),
  });
  y -= 28;
  page.drawText(`Name: ${name}`.slice(0, 90), {
    x: left,
    y,
    size: 12,
    font,
  });
  y -= 18;
  page.drawText(`Signed: ${formatPhoenixStamp(input.signedAt)}`, {
    x: left,
    y,
    size: 12,
    font,
  });
  y -= 22;
  if (input.acknowledged) {
    page.drawText("I typed my name or drew it to sign this document.", {
      x: left,
      y,
      size: 11,
      font: italic,
      color: rgb(0.25, 0.25, 0.25),
    });
    y -= 28;
  }

  if (embedded) {
    const scale = Math.min(maxWidth / embedded.width, 140 / embedded.height, 1);
    const w = embedded.width * scale;
    const h = embedded.height * scale;
    page.drawImage(embedded, {
      x: left,
      y: y - h,
      width: w,
      height: h,
    });
  } else {
    page.drawText(name, {
      x: left,
      y: y - 8,
      size: 22,
      font: italic,
    });
  }

  page.drawLine({
    start: { x: left, y: 56 },
    end: { x: left + Math.min(maxWidth, 280), y: 56 },
    thickness: 0.6,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText("Phoenixwebhost Inc. · document sign", {
    x: left,
    y: 36,
    size: 9,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  return pdf.save();
}
