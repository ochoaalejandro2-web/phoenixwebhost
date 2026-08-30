import { NextResponse } from "next/server";
import { buildClientFromLead } from "@/lib/demo";
import {
  STUDIO_SITE,
  answerReceptionist,
  buildClientFacts,
  buildStudioFacts,
  fallbackAnswer,
  type ReceptionistFacts,
} from "@/lib/receptionist";
import { getClientBySlug, getLead } from "@/lib/store";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

function asLocale(value: unknown): Locale {
  return value === "es" ? "es" : "en";
}

function genericFacts(locale: Locale): ReceptionistFacts {
  const facts = buildStudioFacts(locale);
  return {
    ...facts,
    kind: "client",
    businessName: facts.locale === "es" ? "este sitio" : "this site",
    phone: "",
    listedPrices: [],
    services: [],
    serviceKeys: [],
    contactHint:
      locale === "es"
        ? "Use el formulario de contacto o el teléfono que aparece en esta página."
        : "Use the contact form or the phone number on this page.",
  };
}

export async function POST(request: Request) {
  let body: {
    site?: string;
    leadId?: string;
    locale?: Locale;
    message?: string;
    history?: { role?: string; content?: string }[];
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({
      reply: fallbackAnswer(buildStudioFacts("en"), ""),
      source: "facts",
    });
  }

  const locale = asLocale(body.locale);
  const message = String(body.message || "").trim().slice(0, 500);
  const site = String(body.site || "").trim();
  const leadId = String(body.leadId || "").trim();
  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (turn) =>
            (turn.role === "user" || turn.role === "assistant") &&
            typeof turn.content === "string",
        )
        .map((turn) => ({
          role: turn.role as "user" | "assistant",
          content: String(turn.content).slice(0, 800),
        }))
    : [];

  let facts: ReceptionistFacts = genericFacts(locale);
  if (leadId) {
    const lead = await getLead(leadId);
    if (lead) {
      facts = buildClientFacts(
        buildClientFromLead(lead, [], { preview: true }),
        locale,
      );
    }
  } else if (!site || site === STUDIO_SITE) {
    facts = buildStudioFacts(locale);
  } else {
    const client = await getClientBySlug(site);
    if (client && client.siteStatus !== "taken_down") {
      facts = buildClientFacts(client, locale);
    }
  }

  const result = await answerReceptionist({
    facts,
    message,
    history,
    oidcToken: process.env.VERCEL_OIDC_TOKEN,
  });

  return NextResponse.json(result);
}
