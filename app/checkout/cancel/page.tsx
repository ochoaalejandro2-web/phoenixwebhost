import Link from "next/link";
import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";

export default function CheckoutCancelPage() {
  return (
    <StudioShell>
      <SiteHeader locale="en" />
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-ink-black">Checkout canceled</h1>
        <p className="mt-5 text-body">
          No charge was made. You can request a site again whenever you are ready.
        </p>
        <Link href="/request" className="mt-8 inline-block text-lime hover:text-lime-deep">
          Return to the request form
        </Link>
      </main>
      <SiteFooter locale="en" />
    </StudioShell>
  );
}
