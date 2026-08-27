import { NextResponse } from "next/server";
import { beginOwnerLogin } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const result = await beginOwnerLogin(body.email || "", body.password || "");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ ok: true, needsCode: true });
}
