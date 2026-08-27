import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { stripeBoostConfigured, stripeEmailConfigured } from "@/lib/config";
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
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Local Boost opcional: $99 una vez más $79 al mes extra para el Perfil
            de Empresa en Google y un anuncio local pequeño a su propio sitio. No
            es SEO mágico.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Business Email opcional: $49 una vez más $19 al mes extra para un
            buzón profesional como info@su dominio. Un correo de negocio real para
            que lo tomen en serio — no es magia.
          </p>
        </div>
        <RequestForm
          locale="es"
          boostReady={stripeBoostConfigured()}
          emailReady={stripeEmailConfigured()}
        />
      </main>
      <SiteFooter locale="es" />
    </StudioShell>
  );
}
