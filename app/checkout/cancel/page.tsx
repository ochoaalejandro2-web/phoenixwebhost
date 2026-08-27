import Link from "next/link";
import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";

export default function CheckoutCancelPage() {
  return (
    <StudioShell>
      <SiteHeader locale="en" />
      <main className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="font-display text-4xl text-ink-black">Checkout canceled</h1>
        <p className="mt-4 text-ink-black/70">
          No charge was made. You can request a site again whenever you are ready.
        </p>
        <Link href="/request" className="mt-8 inline-block text-gold hover:text-gold-deep">
          Return to the request form
        </Link>
      </main>
      <SiteFooter locale="en" />
    </StudioShell>
  );
}
