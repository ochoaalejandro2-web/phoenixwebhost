import Link from "next/link";
import { COMPANY } from "@/lib/config";

export default function NotFound() {
  return (
    <div className="studio flex min-h-full flex-col items-center justify-center bg-snow px-6 py-20 text-center">
      <h1 className="font-display text-4xl text-ink-black">Page not found</h1>
      <p className="mt-3 text-body">That address is not a Phoenixwebhost page.</p>
      <p className="mt-4 text-sm text-body">
        <a href={COMPANY.telHref} className="font-medium text-ink-black hover:text-lime">
          {COMPANY.phone}
        </a>
        {" · "}
        <a href={`mailto:${COMPANY.email}`} className="hover:text-lime">
          {COMPANY.email}
        </a>
      </p>
      <Link href="/" className="mt-6 text-lime hover:text-lime-deep">
        Back to phoenixwebhost.com
      </Link>
    </div>
  );
}
