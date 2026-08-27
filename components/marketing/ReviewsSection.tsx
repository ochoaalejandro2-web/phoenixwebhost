import Link from "next/link";
import { reviewsPath, t } from "@/lib/i18n";
import type { Locale, Review } from "@/lib/types";
import { ReviewForm } from "@/components/marketing/ReviewForm";

export function StarRating({
  rating,
  className = "text-lime",
}: {
  rating: number;
  className?: string;
}) {
  const safe = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <p className={className} aria-label={`${safe} out of 5 stars`}>
      {"★".repeat(safe)}
      <span className="text-zinc-300">{"★".repeat(5 - safe)}</span>
    </p>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-[1.5rem] border border-zinc-200 bg-snow p-6">
      <StarRating rating={review.rating} />
      <p className="mt-4 text-sm leading-relaxed text-body">{review.body}</p>
      <p className="mt-5 font-display text-lg text-ink-black">
        {review.companyName}
      </p>
      <p className="text-sm text-body">
        {review.reviewerName}
        {review.city ? ` · ${review.city}` : ""}
      </p>
    </article>
  );
}

export function ReviewsSection({
  locale,
  reviews,
  variant = "home",
}: {
  locale: Locale;
  reviews: Review[];
  variant?: "home" | "page";
}) {
  const c = t(locale);
  const shown = variant === "home" ? reviews.slice(0, 3) : reviews;
  return (
    <section id="reviews" className="border-t border-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-lime">
              {c.nav.reviews}
            </p>
            {variant === "page" ? (
              <h1 className="mt-3 font-display text-3xl text-ink-black sm:text-4xl">
                {c.reviewsTitle}
              </h1>
            ) : (
              <h2 className="mt-3 font-display text-3xl text-ink-black sm:text-4xl">
                {c.reviewsTitle}
              </h2>
            )}
          </div>
          <p className="max-w-md text-sm leading-relaxed text-body">
            {c.reviewsLead}
          </p>
        </div>

        {shown.length === 0 ? (
          <p className="mt-12 text-body">{c.reviewsEmpty}</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {shown.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {variant === "home" && reviews.length > 3 ? (
          <p className="mt-8">
            <Link href={reviewsPath(locale)} className="text-sm text-lime">
              {c.reviewsSeeAll}
            </Link>
          </p>
        ) : null}

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl text-ink-black">
              {c.reviewsFormTitle}
            </h3>
            <p className="mt-3 text-body">{c.reviewsFormLead}</p>
          </div>
          <ReviewForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
