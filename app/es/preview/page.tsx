import { SeeYourSitePage } from "@/components/marketing/SeeYourSitePage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vea su sitio",
  description:
    "Escriba el nombre de su negocio, elija el tipo y vea una vista de Phoenixwebhost con precios Starter, Pro y Premium.",
};

export default async function PreviewEsPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; type?: string; kind?: string }>;
}) {
  const { name, type, kind } = await searchParams;
  return <SeeYourSitePage locale="es" name={name} type={type} kind={kind} />;
}
