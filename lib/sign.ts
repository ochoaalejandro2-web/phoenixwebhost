/** Crockford-ish alphabet: no 0/O/1/I. 8 chars = 40 bits. */
export const SIGN_CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const SIGN_CODE_LENGTH = 8;
export const SIGN_TTL_MS = 14 * 24 * 60 * 60 * 1000;
export const MAX_SIGN_PDF_BYTES = 10 * 1024 * 1024;
export const SIGN_BLOB_PREFIX = "sign-docs/";

export type SignLookupError = "invalid" | "expired" | "signed";
export type PublicSignStatus = "pending" | SignLookupError;

export function generateSignCode(bytes?: Uint8Array) {
  const source = bytes ?? crypto.getRandomValues(new Uint8Array(SIGN_CODE_LENGTH));
  let out = "";
  for (let i = 0; i < SIGN_CODE_LENGTH; i += 1) {
    out += SIGN_CODE_ALPHABET[source[i] % SIGN_CODE_ALPHABET.length];
  }
  return out;
}

export function signCodeLookupKey(raw: string): string | null {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (cleaned.length !== SIGN_CODE_LENGTH) return null;
  for (const char of cleaned) {
    if (!SIGN_CODE_ALPHABET.includes(char)) return null;
  }
  return cleaned;
}

export function formatSignCode(raw: string) {
  const key = signCodeLookupKey(raw) || raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (key.length !== SIGN_CODE_LENGTH) return key;
  return `${key.slice(0, 4)}-${key.slice(4)}`;
}

export function signPublicPath(code?: string) {
  if (!code) return "/sign";
  const formatted = formatSignCode(code);
  return formatted ? `/sign/${formatted}` : "/sign";
}

export function signPublicUrl(origin: string, code?: string) {
  return `${origin.replace(/\/$/, "")}${signPublicPath(code)}`;
}

export function signTextMessage(code: string, origin: string) {
  const formatted = formatSignCode(code);
  return `Sign this PDF at ${signPublicUrl(origin)}\nCode: ${formatted}`;
}

export function signBlobPath(id: string, kind: "original" | "signed") {
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, "");
  return `${SIGN_BLOB_PREFIX}${safeId}/${kind}.pdf`;
}

export function signPathAllowed(pathname: string) {
  return (
    pathname.startsWith(SIGN_BLOB_PREFIX) &&
    !pathname.includes("..") &&
    !pathname.includes("\\")
  );
}

/** Folder under sign-docs/ for one stored PDF. Never the whole tree. */
export function signStoragePrefix(pathname: string): string | null {
  if (!signPathAllowed(pathname)) return null;
  const trimmed = pathname.replace(/\/+$/, "");
  const slash = trimmed.lastIndexOf("/");
  if (slash < SIGN_BLOB_PREFIX.length) return null;
  const prefix = `${trimmed.slice(0, slash)}/`;
  if (prefix === SIGN_BLOB_PREFIX || !signPathAllowed(prefix)) return null;
  return prefix;
}

export function signCleanupPaths(paths: Array<string | null | undefined>) {
  const allowed = new Set<string>();
  for (const pathname of paths) {
    if (pathname && signPathAllowed(pathname)) allowed.add(pathname);
  }
  return [...allowed];
}

export function signCleanupPrefixes(paths: Array<string | null | undefined>) {
  const prefixes = new Set<string>();
  for (const pathname of paths) {
    const prefix = pathname ? signStoragePrefix(pathname) : null;
    if (prefix) prefixes.add(prefix);
  }
  return [...prefixes];
}

export function safePdfFilename(name: string) {
  const trimmed = name.trim().replace(/[/\\]/g, "").slice(0, 120);
  if (!trimmed) return "document.pdf";
  return trimmed.toLowerCase().endsWith(".pdf") ? trimmed : `${trimmed}.pdf`;
}

export function signedDownloadName(filename: string) {
  const base = safePdfFilename(filename).replace(/\.pdf$/i, "");
  return `${base}-signed.pdf`;
}

export function publicSignStatus(
  doc: { status: "pending" | "signed"; expiresAt: string },
  now = Date.now(),
): PublicSignStatus {
  if (doc.status === "signed") return "signed";
  if (new Date(doc.expiresAt).getTime() <= now) return "expired";
  return "pending";
}

export function publicSignErrorMessage(kind: SignLookupError) {
  if (kind === "expired") {
    return "That code expired. Ask Alex for a new one.";
  }
  if (kind === "signed") {
    return "This document was already signed. That code cannot be used again.";
  }
  return "That code is not valid.";
}

export function sanitizeSignerName(raw: string) {
  return raw.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 80);
}

export function formatPhoenixStamp(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export const MAX_SIGN_BOXES = 8;
export const DEFAULT_SIGN_BOX_W = 0.36;
export const DEFAULT_SIGN_BOX_H = 0.08;
export const MIN_SIGN_BOX_W = 0.06;
export const MIN_SIGN_BOX_H = 0.022;
export const MAX_SIGN_BOX_W = 0.95;
export const MAX_SIGN_BOX_H = 0.5;

export type SignBoxCorner = "nw" | "ne" | "sw" | "se";

export type SignHereBox = {
  id: string;
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function newSignBox(page: number, x: number, y: number): SignHereBox {
  const w = DEFAULT_SIGN_BOX_W;
  const h = DEFAULT_SIGN_BOX_H;
  const safePage = Math.max(0, Math.floor(Number.isFinite(page) ? page : 0));
  return {
    id: `box_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`,
    page: safePage,
    w,
    h,
    x: clamp(x - w / 2, 0, 1 - w),
    y: clamp(y - h / 2, 0, 1 - h),
  };
}

export function normalizeSignBox(raw: unknown): SignHereBox | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const page = Number(row.page);
  if (!Number.isInteger(page) || page < 0 || page > 99) return null;
  const rawW = Number(row.w);
  const rawH = Number(row.h);
  const rawX = Number(row.x);
  const rawY = Number(row.y);
  if (![rawW, rawH, rawX, rawY].every(Number.isFinite)) return null;
  const w = clamp(rawW, MIN_SIGN_BOX_W, MAX_SIGN_BOX_W);
  const h = clamp(rawH, MIN_SIGN_BOX_H, MAX_SIGN_BOX_H);
  const x = clamp(rawX, 0, 1 - w);
  const y = clamp(rawY, 0, 1 - h);
  const idRaw = typeof row.id === "string" ? row.id.replace(/[^a-zA-Z0-9_-]/g, "") : "";
  const id = idRaw.length >= 4 && idRaw.length <= 48 ? idRaw : `box_${page}_${Math.round(x * 1000)}_${Math.round(y * 1000)}`;
  return { id, page, x, y, w, h };
}

export function normalizeSignBoxes(raw: unknown): SignHereBox[] {
  if (!Array.isArray(raw)) return [];
  const out: SignHereBox[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    const box = normalizeSignBox(item);
    if (!box) continue;
    let { id } = box;
    if (seen.has(id)) id = `${id}_${out.length}`;
    seen.add(id);
    out.push({ ...box, id });
    if (out.length >= MAX_SIGN_BOXES) break;
  }
  return out;
}

export function resizeSignBox(
  box: SignHereBox,
  corner: SignBoxCorner,
  pointerX: number,
  pointerY: number,
): SignHereBox {
  const px = clamp(pointerX, 0, 1);
  const py = clamp(pointerY, 0, 1);
  const right = box.x + box.w;
  const bottom = box.y + box.h;
  let x = box.x;
  let y = box.y;
  let w = box.w;
  let h = box.h;

  if (corner === "se" || corner === "ne") {
    w = clamp(px - box.x, MIN_SIGN_BOX_W, Math.min(MAX_SIGN_BOX_W, 1 - box.x));
  } else {
    x = clamp(px, 0, right - MIN_SIGN_BOX_W);
    w = right - x;
    if (w > MAX_SIGN_BOX_W) {
      x = right - MAX_SIGN_BOX_W;
      w = MAX_SIGN_BOX_W;
    }
  }

  if (corner === "se" || corner === "sw") {
    h = clamp(py - box.y, MIN_SIGN_BOX_H, Math.min(MAX_SIGN_BOX_H, 1 - box.y));
  } else {
    y = clamp(py, 0, bottom - MIN_SIGN_BOX_H);
    h = bottom - y;
    if (h > MAX_SIGN_BOX_H) {
      y = bottom - MAX_SIGN_BOX_H;
      h = MAX_SIGN_BOX_H;
    }
  }

  return { ...box, x, y, w, h };
}

/** HTML top-left fractions → PDF bottom-left points. */
export function signBoxPdfRect(
  box: SignHereBox,
  pageWidth: number,
  pageHeight: number,
) {
  const w = box.w * pageWidth;
  const h = box.h * pageHeight;
  return {
    x: box.x * pageWidth,
    y: pageHeight - box.y * pageHeight - h,
    w,
    h,
  };
}
