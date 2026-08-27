import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { t } from "@/lib/i18n";

export const metadata = { title: "Pedir un sitio" };

export default function RequestEsPage() {
  const c = t("es");
  return (
    <StudioShell>
      <SiteHeader locale="es" />
      <main className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl text-ink-black">{c.requestTitle}</h1>
          <p className="mt-4 text-lg text-ink-black/70">{c.requestLead}</p>
          <p className="price-gold mt-6">$200 para lanzar · $69 al mes para mantenerlo en línea</p>
        </div>
        <RequestForm locale="es" />
      </main>
      <SiteFooter locale="es" />
    </StudioShell>
  );
}
