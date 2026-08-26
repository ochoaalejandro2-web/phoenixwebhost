import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "pwh_session";

function secret() {
  const value = process.env.AUTH_SECRET || "dev-only-phoenixwebhost-change-me";
  return new TextEncoder().encode(value);
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
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
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
