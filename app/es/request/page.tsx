import {
  CompanyPhone,
  SiteFooter,
  SiteHeader,
  StudioShell,
} from "@/components/marketing/Chrome";
import { RequestForm } from "@/components/marketing/RequestForm";
import { parseAdsTier } from "@/lib/ads";
import {
  COMPANY,
  stripeBookConfigured,
  stripeBoostConfigured,
  stripeEmailConfigured,
  stripeLoudConfigured,
  stripeMissedCallConfigured,
  stripeReviewTextsConfigured,
  stripeTrafficConfigured,
  stripeVoiceConfigured,
} from "@/lib/config";
import { t } from "@/lib/i18n";

export const metadata = { title: "Pedir una demo" };

export default async function RequestEsPage({
  searchParams,
}: {
  searchParams: Promise<{ ads?: string }>;
}) {
  const { ads } = await searchParams;
  const c = t("es");
  return (
    <StudioShell>
      <SiteHeader locale="es" />
      <main className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl text-ink-black">{c.requestTitle}</h1>
          <p className="mt-5 text-lg text-body">{c.requestLead}</p>
          <p className="price-lime mt-8 text-lg">$200 para lanzar · $69 al mes para mantenerlo en línea</p>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-body">
            El primer pago es $269 si paga el lanzamiento y el primer mes juntos.
            Esta demo parte de una plantilla comprobada — no inventamos un diseño
            a medida nuevo por $200.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Local Boost opcional: $99 una vez más $79 al mes extra para el Perfil
            de Empresa en Google y un anuncio local pequeño a su propio sitio. No
            es SEO mágico.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Traffic opcional: $199 al mes extra para un anuncio de Google más
            grande que Local Boost, para que más gente vea el negocio. No promete
            posiciones.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Loud opcional: $349 al mes extra para el paquete agresivo de anuncios.
            Anuncios más fuertes, más gente viéndolo. No promete posiciones. Elija
            un solo nivel de anuncios.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            Business Email opcional: $49 una vez más $19 al mes extra para un
            buzón profesional como info@su dominio. Un correo de negocio real para
            que lo tomen en serio — no es magia.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-body">
            La recepcionista de IA en el chat va incluida en $200 + $69. Extras
            opcionales: Reservar un trabajo $49 + $19 al mes, texto de llamada
            perdida $49 + $29 al mes, textos de reseña $29 al mes, recepcionista
            de voz $99 + $79 al mes. Eso no es el chat incluido.
          </p>
          <p className="mt-6 text-sm text-body">
            {c.callPrompt}{" "}
            <CompanyPhone className="font-semibold text-ink-black hover:text-lime" />
            . {COMPANY.email}
          </p>
        </div>
        <RequestForm
          locale="es"
          boostReady={stripeBoostConfigured()}
          trafficReady={stripeTrafficConfigured()}
          loudReady={stripeLoudConfigured()}
          emailReady={stripeEmailConfigured()}
          bookReady={stripeBookConfigured()}
          missedReady={stripeMissedCallConfigured()}
          reviewsReady={stripeReviewTextsConfigured()}
          voiceReady={stripeVoiceConfigured()}
          initialAds={parseAdsTier(ads)}
        />
      </main>
      <SiteFooter locale="es" />
    </StudioShell>
  );
}
