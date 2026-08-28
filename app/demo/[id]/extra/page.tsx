import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoChrome } from "@/components/marketing/DemoChrome";
import { demoPath, leadHasExtraPage } from "@/lib/demo";
import { t } from "@/lib/i18n";
import { getLead } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lead = await getLead(id);
  const title = lead?.demo.extraPageTitle.trim() || "Extra page";
  return {
    title: { absolute: `${title} · Demo` },
    robots: { index: false, follow: false },
  };
}

export default async function DemoExtraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead || !leadHasExtraPage(lead.demo)) notFound();
  const locale = lead.locale;
  const c = t(locale);
  const title = lead.demo.extraPageTitle.trim() || c.demoExtraNav;
  const body =
    lead.demo.extraPageBody.trim() ||
    (locale === "es"
      ? "Esta página extra es parte de la vista previa. En el sitio real, una página nueva se cotiza a $75–$150."
      : "This extra page is part of the preview. On the live site, a new page is quoted at $75–$150.");
  return (
    <DemoChrome lead={lead}>
      <article className="mx-auto max-w-5xl px-5 py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
          {lead.businessName}
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {body}
        </p>
        <p className="mt-8 text-sm text-ink-soft">{c.demoQuoted}</p>
        <Link
          href={demoPath(lead.id)}
          className="mt-8 inline-block text-sm font-semibold text-ink hover:underline"
        >
          {lead.businessName}
        </Link>
      </article>
    </DemoChrome>
  );
}
