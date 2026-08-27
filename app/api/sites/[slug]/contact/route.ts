import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  notifySiteContact,
  usableEmail,
  type SiteContactStatus,
} from "@/lib/notify";
import { addContactMessage, getClientBySlug } from "@/lib/store";

export const dynamic = "force-dynamic";

const MAX = { name: 120, email: 200, phone: 40, message: 4000 };

function clip(value: unknown, max: number) {
  return String(value || "").trim().slice(0, max);
}

function wantsJson(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  return contentType.includes("application/json");
}

function siteUrl(request: Request, slug: string, query: string) {
  const url = new URL(`/s/${slug}?${query}`, request.url);
  url.hash = "contact";
  return url;
}

function finish(
  request: Request,
  slug: string,
  result: { sent: true } | { error: SiteContactStatus | "missing" },
) {
  if (wantsJson(request)) {
    if ("sent" in result) {
      return NextResponse.json({ ok: true });
    }
    const status =
      result.error === "missing"
        ? 400
        : result.error === "no-email"
          ? 409
          : 502;
    return NextResponse.json({ error: result.error }, { status });
  }
  const query = "sent" in result ? "sent=1" : `error=${result.error}`;
  return NextResponse.redirect(siteUrl(request, slug, query), 303);
}

async function readFields(request: Request) {
  if (wantsJson(request)) {
    const body = (await request.json()) as Record<string, unknown>;
    return {
      name: clip(body.name, MAX.name),
      email: clip(body.email, MAX.email),
      phone: clip(body.phone, MAX.phone),
      message: clip(body.message, MAX.message),
    };
  }
  const form = await request.formData();
  return {
    name: clip(form.get("name"), MAX.name),
    email: clip(form.get("email"), MAX.email),
    phone: clip(form.get("phone"), MAX.phone),
    message: clip(form.get("message"), MAX.message),
  };
}

export function GET() {
  return new NextResponse(
    "Use the contact form on the site to send a message.",
    {
      status: 405,
      headers: { Allow: "POST" },
    },
  );
}

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

  let fields: Awaited<ReturnType<typeof readFields>>;
  try {
    fields = await readFields(request);
  } catch {
    return finish(request, slug, { error: "missing" });
  }

  if (!fields.name || !fields.message || !usableEmail(fields.email)) {
    return finish(request, slug, { error: "missing" });
  }

  try {
    const message = await addContactMessage({
      id: `msg_${crypto.randomUUID()}`,
      clientId: client.id,
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      message: fields.message,
      createdAt: new Date().toISOString(),
    });
    const status = await notifySiteContact(client, message);
    revalidatePath(`/admin/clients/${client.id}`);
    if (status === "sent") {
      return finish(request, slug, { sent: true });
    }
    return finish(request, slug, { error: status });
  } catch (error) {
    console.error("[contact] submit failed", error);
    return finish(request, slug, { error: "send-failed" });
  }
}
