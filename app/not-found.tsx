import Link from "next/link";

export default function NotFound() {
  return (
    <div className="studio grain flex min-h-full flex-col items-center justify-center bg-snow px-6 py-20 text-center">
      <h1 className="font-display text-4xl text-ink-black">Page not found</h1>
      <p className="mt-3 text-ink-black/65">That address is not a Phoenixwebhost page.</p>
      <Link href="/" className="mt-6 text-gold hover:text-gold-deep">
        Back to phoenixwebhost.com
      </Link>
    </div>
  );
}
