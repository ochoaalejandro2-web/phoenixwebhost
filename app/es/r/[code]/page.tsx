import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CLOSER_COOKIE,
  closerCookieOptions,
  closerHomePath,
  sanitizeCloserCode,
} from "@/lib/closers";

export default async function CloserLinkEsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const clean = sanitizeCloserCode(code);
  if (clean) {
    const store = await cookies();
    store.set(CLOSER_COOKIE, clean, closerCookieOptions(true));
  }
  redirect(closerHomePath("es"));
}
