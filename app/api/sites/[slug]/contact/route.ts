import { NextResponse } from "next/server";
import { notifySiteContact } from "@/lib/notify";
import { addContactMessage, getClientBySlug } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const client = await getClientBySlug(slug);
  if (!client) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (client.siteStatus !== "live") {
    return NextResponse.json({ error: "site offline" }, { status: 403 });
  }
  const form = await request.formData();
  const message = await addContactMessage({
    id: `msg_${crypto.randomUUID()}`,
    clientId: client.id,
    name: String(form.get("name") || "").trim(),
    email: String(form.get("email") || "").trim(),
    phone: String(form.get("phone") || "").trim(),
    message: String(form.get("message") || "").trim(),
    createdAt: new Date().toISOString(),
  });
  await notifySiteContact(client.businessName, message, client.id);
  return NextResponse.redirect(new URL(`/s/${slug}?sent=1`, request.url));
}
