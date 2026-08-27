import { setReviewStatusAction } from "@/app/admin/actions";
import { listReviews } from "@/lib/store";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Phoenix",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function ReviewsAdminPage() {
  const reviews = await listReviews();
  const pending = reviews.filter((review) => review.status === "pending").length;
  return (
    <div>
      <h1 className="font-display text-3xl">Reviews</h1>
      <p className="mt-2 text-ink-soft">
        Public submissions stay pending until you approve them. {pending} waiting.
      </p>
      <ul className="mt-6 space-y-4">
        {reviews.length === 0 && (
          <li className="text-ink-soft">No reviews yet.</li>
        )}
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-2xl border border-line bg-paper p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">{review.companyName}</p>
                <p className="text-sm text-ink-soft">
                  {review.reviewerName}
                  {review.city ? ` · ${review.city}` : ""} · {review.rating}/5 ·{" "}
                  {review.status} · {fmt(review.createdAt)} MST
                </p>
                <p className="mt-3 text-sm">{review.body}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {review.status !== "approved" && (
                  <form action={setReviewStatusAction}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input type="hidden" name="status" value="approved" />
                    <button className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white">
                      Approve
                    </button>
                  </form>
                )}
                {review.status !== "rejected" && (
                  <form action={setReviewStatusAction}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button className="rounded-full border border-line px-4 py-2 text-sm">
                      Hide
                    </button>
                  </form>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
