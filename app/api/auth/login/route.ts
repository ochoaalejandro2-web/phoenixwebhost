import { NextResponse } from "next/server";
import {
  createSessionToken,
  setSessionCookie,
  verifyLogin,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const ok = await verifyLogin(body.email || "", body.password || "");
  if (!ok) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  await setSessionCookie(await createSessionToken());
  return NextResponse.json({ ok: true });
}
