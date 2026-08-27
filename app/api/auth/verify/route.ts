import { NextResponse } from "next/server";
import { completeOwnerLogin } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { code?: string };
  const result = await completeOwnerLogin(body.code || "");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ ok: true });
}
