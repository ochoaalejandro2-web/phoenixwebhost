import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import type { TaxPortalRole, TaxSession } from "@/lib/tax-access";
import { portalPath } from "@/lib/tax-office";

const COOKIE = "tax_portal_session";
const AUDIENCE = "tax-portal";

function secret() {
  const value = process.env.AUTH_SECRET || "dev-only-phoenixwebhost-change-me";
  return new TextEncoder().encode(value);
}

function cookieBase() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export async function createTaxSessionToken(session: TaxSession) {
  return new SignJWT({
    role: session.role,
    userId: session.userId,
    clientId: session.clientId,
    email: session.email,
    name: session.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setAudience(AUDIENCE)
    .sign(secret());
}

export async function setTaxSessionCookie(session: TaxSession) {
  const jar = await cookies();
  jar.set(COOKIE, await createTaxSessionToken(session), {
    ...cookieBase(),
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearTaxSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getTaxSession(): Promise<TaxSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      audience: AUDIENCE,
    });
    if (payload.role !== "customer" && payload.role !== "staff") return null;
    if (
      typeof payload.userId !== "string" ||
      typeof payload.clientId !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    return {
      role: payload.role as TaxPortalRole,
      userId: payload.userId,
      clientId: payload.clientId,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
    };
  } catch {
    return null;
  }
}

export async function sessionForClient(clientId: string) {
  const session = await getTaxSession();
  if (!session || session.clientId !== clientId) return null;
  return session;
}

export async function requireTaxCustomer(slug: string, clientId: string) {
  const session = await sessionForClient(clientId);
  if (!session) redirect(portalPath(slug, "/login"));
  if (session.role === "staff") redirect(portalPath(slug, "/staff"));
  if (session.role !== "customer") redirect(portalPath(slug, "/login"));
  return session;
}

export async function requireTaxStaff(slug: string, clientId: string) {
  const session = await sessionForClient(clientId);
  if (!session) redirect(portalPath(slug, "/staff/login"));
  if (session.role !== "staff") redirect(portalPath(slug, "/folder"));
  return session;
}
