import { NextResponse } from "next/server";
import { applyUnpaidPolicy } from "@/lib/billing";
import { listClients, upsertClient } from "@/lib/store";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const now = new Date();
  const clients = await listClients();
  let changed = 0;
  for (const client of clients) {
    const next = applyUnpaidPolicy(client, now);
    if (JSON.stringify(next) !== JSON.stringify(client)) {
      await upsertClient(next);
      changed += 1;
    }
  }
  return NextResponse.json({ ok: true, changed });
}
