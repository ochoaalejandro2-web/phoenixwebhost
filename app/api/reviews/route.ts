import { NextResponse } from "next/server";
import { notifyNewReview } from "@/lib/notify";
import { addReview } from "@/lib/store";
import type { Review } from "@/lib/types";

const MAX_BODY = 600;
const MAX_NAME = 120;

function clip(value: unknown, max: number) {
  return String(value || "").trim().slice(0, max);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    companyName?: string;
    reviewerName?: string;
    city?: string;
    rating?: number | string;
    body?: string;
  };
  const companyName = clip(body.companyName, MAX_NAME);
  const reviewerName = clip(body.reviewerName, MAX_NAME);
  const city = clip(body.city, 80);
  const text = clip(body.body, MAX_BODY);
  const ratingNum = Number(body.rating);
  if (!companyName || !reviewerName || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }
  const review: Review = {
    id: `rev_${crypto.randomUUID()}`,
    companyName,
    reviewerName,
    city,
    rating: ratingNum as 1 | 2 | 3 | 4 | 5,
    body: text,
    status: "pending",
    createdAt: new Date().toISOString(),
    publishedAt: null,
  };
  await addReview(review);
  await notifyNewReview(review);
  return NextResponse.json({ id: review.id, status: review.status });
}
