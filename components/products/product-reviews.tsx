"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Quote, Star } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { RatingSummary } from "@/components/products/rating-summary";
import { formatDate } from "@/lib/utils";

interface ProductReview {
  id: string;
  reviewerName: string;
  rating: number;
  body: string;
  verified: boolean;
  createdAt: string;
}

export function ProductReviews({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");

    fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error("Reviews are temporarily unavailable.");
        setReviews(data.reviews);
        setState("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState("error");
      });

    return () => controller.abort();
  }, [productId, reloadToken]);

  const averageRating = useMemo(
    () =>
      reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0,
    [reviews]
  );

  return (
    <section className="product-reviews-section" id="reviews" aria-labelledby="reviews-heading">
      <div className="product-section-heading">
        <div>
          <p>Notes from customers</p>
          <Heading as="h2" size="xl" id="reviews-heading">
            A piece becomes part of someone&apos;s story.
          </Heading>
        </div>
        {state === "ready" && <RatingSummary rating={averageRating} count={reviews.length} />}
      </div>

      {state === "loading" ? (
        <div className="product-review-loading" aria-label="Loading reviews">
          {[0, 1].map((item) => (
            <div key={item} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          ))}
        </div>
      ) : state === "error" ? (
        <div className="product-review-state" role="alert">
          <AlertCircle aria-hidden="true" />
          <Heading as="h3" size="sm">
            Customer notes could not be gathered.
          </Heading>
          <Text size="sm" variant="muted">
            The product is still available to enquire about. You can try loading its reviews again.
          </Text>
          <button type="button" onClick={() => setReloadToken((value) => value + 1)}>
            Try again <ArrowRight />
          </button>
        </div>
      ) : reviews.length > 0 ? (
        <div className="product-review-grid">
          {reviews.map((review) => (
            <article key={review.id}>
              <Quote className="product-review-quote" aria-hidden="true" />
              <div className="product-review-stars" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    aria-hidden="true"
                    className={index < review.rating ? "is-filled" : undefined}
                  />
                ))}
              </div>
              <blockquote>&ldquo;{review.body}&rdquo;</blockquote>
              <footer>
                <span>
                  <strong>{review.reviewerName}</strong>
                  {review.verified && <em>Verified order</em>}
                </span>
                <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="product-review-state">
          <Quote aria-hidden="true" />
          <Heading as="h3" size="sm">
            No customer notes yet.
          </Heading>
          <Text size="sm" variant="muted">
            If this piece has been part of your story, you can be the first to share it.
          </Text>
        </div>
      )}

      <Link href={`/reviews?product=${productId}`} className="product-review-link">
        Share a review of {productName} <ArrowRight />
      </Link>
    </section>
  );
}
