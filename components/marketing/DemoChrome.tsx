import { DemoBar } from "@/components/marketing/DemoStudio";
import { ReceptionistChat } from "@/components/sites/ReceptionistChat";
import {
  stripeBookConfigured,
  stripeBoostConfigured,
  stripeConfigured,
  stripeEmailConfigured,
  stripeLoudConfigured,
  stripeMissedCallConfigured,
  stripeReviewTextsConfigured,
  stripeTrafficConfigured,
  stripeVoiceConfigured,
  stripeDomainConfigured,
} from "@/lib/config";
import { accentHex } from "@/lib/demo";
import type { Lead } from "@/lib/types";

export function DemoChrome({
  lead,
  children,
}: {
  lead: Lead;
  children: React.ReactNode;
}) {
  const hex = accentHex(lead.demo.accent);
  return (
    <div className="min-h-full bg-snow text-ink-black">
      <DemoBar
        lead={lead}
        locale={lead.locale}
        stripeReady={stripeConfigured()}
        boostReady={stripeBoostConfigured()}
        trafficReady={stripeTrafficConfigured()}
        loudReady={stripeLoudConfigured()}
        emailReady={stripeEmailConfigured()}
        bookReady={stripeBookConfigured()}
        missedReady={stripeMissedCallConfigured()}
        reviewsReady={stripeReviewTextsConfigured()}
        voiceReady={stripeVoiceConfigured()}
        domainReady={stripeDomainConfigured()}
      />
      <div
        className="demo-preview"
        data-accent={lead.demo.accent}
        style={hex ? { ["--site-accent" as string]: hex } : undefined}
      >
        {children}
      </div>
      <ReceptionistChat
        site={`demo-${lead.id}`}
        leadId={lead.id}
        locale={lead.locale}
        businessName={lead.businessName}
      />
    </div>
  );
}
