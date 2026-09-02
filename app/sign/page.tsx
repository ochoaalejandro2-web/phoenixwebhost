import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CodeForm } from "@/components/sign/CodeForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign a document",
  robots: { index: false, follow: false },
};

export default function SignCodeEntryPage() {
  return (
    <div className="studio flex min-h-full flex-col items-center bg-snow px-5 py-12">
      <Link href="/" aria-label="Phoenixwebhost home">
        <Logo />
      </Link>
      <div className="mt-10 w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink-black">Sign a document</h1>
        <p className="mt-2 text-sm text-body">
          Enter the code Alex texted you. No account or password.
        </p>
        <CodeForm />
      </div>
    </div>
  );
}
