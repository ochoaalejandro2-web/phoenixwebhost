import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatPhoenixStamp, sanitizeSignerName } from "./sign.ts";

export function pngFromDataUrl(dataUrl: string) {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/]+=*)$/.exec(dataUrl.trim());
  if (!match) return null;
  if (match[1].length > 400_000) return null;
  return Buffer.from(match[1], "base64");
}

export async function stampSignedPdf(input: {
  original: Uint8Array;
  signerName: string;
  acknowledged: boolean;
  signaturePng?: Uint8Array | null;
  signedAt: Date;
}) {
  const pdf = await PDFDocument.load(input.original);
  const page = pdf.addPage();
  const { width, height } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const name = sanitizeSignerName(input.signerName) || "Signature";
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

  if (input.signaturePng && input.signaturePng.length > 0) {
    const image = await pdf.embedPng(input.signaturePng);
    const scale = Math.min(maxWidth / image.width, 140 / image.height, 1);
    const w = image.width * scale;
    const h = image.height * scale;
    page.drawImage(image, {
      x: left,
      y: y - h,
      width: w,
      height: h,
    });
    y -= h + 16;
  } else {
    page.drawText(name, {
      x: left,
      y: y - 8,
      size: 22,
      font: italic,
    });
    y -= 40;
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
