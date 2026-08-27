import Link from "next/link";
import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";

export default function CheckoutSuccessPage() {
  return (
    <StudioShell>
      <SiteHeader locale="en" />
      <main className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="font-display text-4xl text-ink-black">Payment received</h1>
        <p className="mt-4 text-ink-black/70">
          The $200 launch and $69/month plan are in Stripe test or live mode,
          depending on your keys. Alex will see the client as paid in the owner
          panel once the webhook lands.
        </p>
        <Link href="/" className="mt-8 inline-block text-gold hover:text-gold-deep">
          Back to Phoenixwebhost
        </Link>
      </main>
      <SiteFooter locale="en" />
    </StudioShell>
  );
}
