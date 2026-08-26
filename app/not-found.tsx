import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-sand px-6 py-20 text-center">
      <h1 className="font-display text-4xl">Page not found</h1>
      <p className="mt-3 text-ink-soft">That address is not a Phoenixwebhost page.</p>
      <Link href="/" className="mt-6 text-clay">
        Back to phoenixwebhost.com
      </Link>
    </div>
  );
}
