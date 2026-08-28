import { NextResponse } from "next/server";
import { applyDemoPatch, interpretDemoChat, leadHasExtraPage } from "@/lib/demo";
import { getLead, updateLead } from "@/lib/store";
import type { DemoTweaks } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) {
    return NextResponse.json({ error: "Demo not found." }, { status: 404 });
  }

  const body = (await request.json()) as {
    chat?: string;
    demo?: Partial<DemoTweaks>;
  };

  let patch: Partial<DemoTweaks> = body.demo || {};
  let replyKind = "saved";

  if (typeof body.chat === "string" && body.chat.trim()) {
    const intent = interpretDemoChat(body.chat);
    replyKind = intent.kind;
    if (intent.kind === "logo") patch = { logoText: intent.logoText };
    else if (intent.kind === "color") patch = { accent: intent.accent };
    else if (intent.kind === "sentence") {
      patch = { extraSentence: intent.extraSentence };
    } else if (intent.kind === "page") {
      if (leadHasExtraPage(lead.demo)) {
        replyKind = "capped";
        patch = {};
      } else {
        patch = {
          extraPageTitle: intent.title,
          extraPageBody: intent.body,
        };
      }
    } else {
      patch = {};
    }
  }

  const demo = applyDemoPatch(lead.demo, patch);
  const updated = await updateLead(lead.id, { demo });
  return NextResponse.json({
    id: lead.id,
    demo: updated?.demo ?? demo,
    replyKind,
  });
}
