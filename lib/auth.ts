import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { notifyOwnerAuthCode, twoFactorProvidersReady } from "@/lib/notify";
import { getAuthLock, updateAuthLock } from "@/lib/store";

const SESSION_COOKIE = "pwh_session";
const PENDING_COOKIE = "pwh_pending";
const CODE_TTL = "10m";
const CODE_MAX_AGE = 10 * 60;
const MAX_FAILS = 5;
const LOCK_MS = 10 * 60 * 1000;
const SEND_COOLDOWN_MS = 45 * 1000;

function secret() {
  const value = process.env.AUTH_SECRET || "dev-only-phoenixwebhost-change-me";
  return new TextEncoder().encode(value);
}

function hmacKey() {
  return process.env.AUTH_SECRET || "dev-only-phoenixwebhost-change-me";
}

export function adminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "alex@phoenixwebhost.com").toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "MesaSunrise2026!",
  };
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function hashCode(nonce: string, code: string) {
  return createHmac("sha256", hmacKey()).update(`${nonce}:${code}`).digest("hex");
}

function hashesMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function cookieBase() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export async function verifyLogin(email: string, password: string) {
  const expected = adminCredentials();
  const emailOk = safeEqual(email.trim().toLowerCase(), expected.email);
  const passOk = safeEqual(password, expected.password);
  return emailOk && passOk;
}

export async function createSessionToken() {
  return new SignJWT({ role: "owner", name: "Alex Ochoa" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    ...cookieBase(),
    maxAge: 60 * 60 * 24 * 7,
  });
}

async function setPendingCookie(token: string) {
  const jar = await cookies();
  jar.set(PENDING_COOKIE, token, {
    ...cookieBase(),
    maxAge: CODE_MAX_AGE,
  });
}

async function clearPendingCookie() {
  const jar = await cookies();
  jar.delete(PENDING_COOKIE);
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(PENDING_COOKIE);
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role !== "owner") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function requireOwner() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

function stillLocked(until: number | null, now: number) {
  return typeof until === "number" && until > now;
}

export type AuthAttemptResult =
  | { ok: true; needsCode: boolean }
  | { ok: false; status: 401 | 429; error: "invalid" | "locked" | "expired" };

async function issueOwnerSession() {
  await clearPendingCookie();
  await updateAuthLock((next) => {
    next.passwordFails = 0;
    next.passwordLockedUntil = null;
    next.codeFails = 0;
    next.codeLockedUntil = null;
  });
  await setSessionCookie(await createSessionToken());
  return { ok: true as const, needsCode: false };
}

export async function beginOwnerLogin(
  email: string,
  password: string,
): Promise<AuthAttemptResult> {
  const now = Date.now();
  const lock = await getAuthLock();
  if (stillLocked(lock.passwordLockedUntil, now)) {
    return { ok: false, status: 429, error: "locked" };
  }

  const valid = await verifyLogin(email, password);
  if (!valid) {
    await updateAuthLock((next) => {
      next.passwordFails += 1;
      if (next.passwordFails >= MAX_FAILS) {
        next.passwordLockedUntil = Date.now() + LOCK_MS;
        next.passwordFails = 0;
      }
    });
    return { ok: false, status: 401, error: "invalid" };
  }

  if (!twoFactorProvidersReady()) {
    console.warn(
      "[auth] 2FA is off until RESEND_API_KEY or complete Twilio vars are set; issuing session after password",
    );
    return issueOwnerSession();
  }

  if (
    lock.lastCodeSentAt &&
    now - lock.lastCodeSentAt < SEND_COOLDOWN_MS
  ) {
    const jar = await cookies();
    if (jar.get(PENDING_COOKIE)?.value) {
      return { ok: true, needsCode: true };
    }
    return { ok: false, status: 429, error: "locked" };
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const nonce = crypto.randomUUID();
  const token = await new SignJWT({
    role: "pending-2fa",
    hash: hashCode(nonce, code),
    nonce,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(CODE_TTL)
    .setJti(nonce)
    .sign(secret());

  await setPendingCookie(token);
  const sent = await notifyOwnerAuthCode(code);
  if (!sent.email && !sent.sms) {
    console.error(
      "[auth] 2FA code could not be delivered on any channel; falling back to password-only session",
    );
    return issueOwnerSession();
  }

  await updateAuthLock((next) => {
    next.passwordFails = 0;
    next.passwordLockedUntil = null;
    next.codeFails = 0;
    next.codeLockedUntil = null;
    next.lastCodeSentAt = Date.now();
  });
  return { ok: true, needsCode: true };
}

export async function completeOwnerLogin(rawCode: string): Promise<AuthAttemptResult> {
  const now = Date.now();
  const lock = await getAuthLock();
  if (stillLocked(lock.codeLockedUntil, now)) {
    return { ok: false, status: 429, error: "locked" };
  }

  const code = rawCode.replace(/\D/g, "");
  const jar = await cookies();
  const pending = jar.get(PENDING_COOKIE)?.value;
  if (!pending || code.length !== 6) {
    return { ok: false, status: 401, error: "invalid" };
  }

  let nonce = "";
  let expectedHash = "";
  try {
    const { payload } = await jwtVerify(pending, secret());
    if (payload.role !== "pending-2fa" || typeof payload.hash !== "string") {
      return { ok: false, status: 401, error: "expired" };
    }
    nonce = String(payload.nonce || payload.jti || "");
    expectedHash = payload.hash;
    if (lock.consumedNonces.includes(nonce)) {
      return { ok: false, status: 401, error: "expired" };
    }
  } catch {
    return { ok: false, status: 401, error: "expired" };
  }

  if (!hashesMatch(expectedHash, hashCode(nonce, code))) {
    const nextLock = await updateAuthLock((next) => {
      next.codeFails += 1;
      if (next.codeFails >= MAX_FAILS) {
        next.codeLockedUntil = Date.now() + LOCK_MS;
        next.codeFails = 0;
      }
    });
    if (stillLocked(nextLock.codeLockedUntil, Date.now())) {
      await clearPendingCookie();
      return { ok: false, status: 429, error: "locked" };
    }
    return { ok: false, status: 401, error: "invalid" };
  }

  await updateAuthLock((next) => {
    next.passwordFails = 0;
    next.passwordLockedUntil = null;
    next.codeFails = 0;
    next.codeLockedUntil = null;
    next.consumedNonces = [...next.consumedNonces, nonce].slice(-30);
  });
  await clearPendingCookie();
  await setSessionCookie(await createSessionToken());
  return { ok: true, needsCode: false };
}
