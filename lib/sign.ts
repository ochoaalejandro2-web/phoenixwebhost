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
