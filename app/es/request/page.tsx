import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { t } from "@/lib/i18n";

export const metadata = { title: "Pedir un sitio" };

export default function RequestEsPage() {
  const c = t("es");
  return (
    <StudioShell>
      <SiteHeader locale="es" />
      <main className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl text-ink-black">{c.requestTitle}</h1>
          <p className="mt-5 text-lg text-body">{c.requestLead}</p>
          <p className="price-lime mt-8 text-lg">$200 para lanzar · $69 al mes para mantenerlo en línea</p>
        </div>
        <RequestForm locale="es" />
      </main>
      <SiteFooter locale="es" />
    </StudioShell>
  );
}
