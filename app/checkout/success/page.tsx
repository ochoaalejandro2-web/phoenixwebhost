import Link from "next/link";
import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";

export default function CheckoutSuccessPage() {
  return (
    <StudioShell>
      <SiteHeader locale="en" />
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-ink-black">Payment received</h1>
        <p className="mt-5 text-body">
          The $200 launch and $69/month plan are in Stripe test or live mode,
          depending on your keys. If you added Local Boost, the $99 setup and
          $79/month extra are on the same receipt. Alex will see the client as
          paid in the owner panel once the webhook lands.
        </p>
        <Link href="/" className="mt-8 inline-block text-lime hover:text-lime-deep">
          Back to Phoenixwebhost
        </Link>
      </main>
      <SiteFooter locale="en" />
    </StudioShell>
  );
}
