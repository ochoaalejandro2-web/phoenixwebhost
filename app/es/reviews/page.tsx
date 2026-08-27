import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { ReviewsSection } from "@/components/marketing/ReviewsSection";
import { listPublicReviews } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reseñas" };

export default async function ReviewsEsPage() {
  const reviews = await listPublicReviews();
  return (
    <StudioShell>
      <SiteHeader locale="es" />
      <main>
        <ReviewsSection locale="es" reviews={reviews} variant="page" />
      </main>
      <SiteFooter locale="es" />
    </StudioShell>
  );
}
