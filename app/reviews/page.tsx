import { SiteFooter, SiteHeader, StudioShell } from "@/components/marketing/Chrome";
import { ReviewsSection } from "@/components/marketing/ReviewsSection";
import { listPublicReviews } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const reviews = await listPublicReviews();
  return (
    <StudioShell>
      <SiteHeader locale="en" />
      <main>
        <ReviewsSection locale="en" reviews={reviews} variant="page" />
      </main>
      <SiteFooter locale="en" />
    </StudioShell>
  );
}
