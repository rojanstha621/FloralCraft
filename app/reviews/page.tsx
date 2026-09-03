"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CatalogProduct } from "@/lib/types/catalog";
import { formatDate } from "@/lib/utils";

interface PublicReview {
  id: string;
  reviewerName: string;
  rating: number;
  body: string;
  createdAt: string;
  product: { name: string; slug: string };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProductId(new URLSearchParams(window.location.search).get("product") || "");
    Promise.all([
      fetch("/api/reviews").then((res) => res.json()),
      fetch("/api/products").then((res) => res.json()),
    ]).then(([reviewData, productData]) => {
      if (reviewData.success) setReviews(reviewData.reviews);
      if (productData.success) setProducts(productData.products);
    });
  }, []);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: data.get("productId"),
        name: data.get("name"),
        email: data.get("email"),
        rating: Number(data.get("rating")),
        comment: data.get("comment"),
        website: data.get("website"),
      }),
    });
    const result = await response.json();
    setMessage(result.message);
    setStatus(response.ok ? "success" : "error");
    if (response.ok) formElement.reset();
  }

  return (
    <div className="py-10 md:py-16">
      <Container size="xl">
        <header className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <Badge variant="pink">Customer stories</Badge>
          <Heading as="h1" size="2xl">
            Love notes from our community
          </Heading>
          <Text size="base" variant="muted">
            Real words about gifts that made birthdays, anniversaries, and everyday moments feel
            unforgettable.
          </Text>
        </header>

        <div className="grid gap-10 lg:grid-cols-12">
          <section className="space-y-5 lg:col-span-7" aria-label="Approved customer reviews">
            {reviews.length ? (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-3xl border bg-white p-6 shadow-card md:p-8"
                >
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${index < review.rating ? "fill-amber-400" : ""}`}
                      />
                    ))}
                  </div>
                  <p className="mt-4 font-serif text-lg italic leading-relaxed">
                    &ldquo;{review.body}&rdquo;
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-4 text-xs">
                    <strong>{review.reviewerName}</strong>
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-sage-700" />
                    <Link
                      href={`/products/${review.product.slug}`}
                      className="text-brand-brown-500 underline"
                    >
                      {review.product.name}
                    </Link>
                    <span className="ml-auto text-brand-brown-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border bg-white/70 p-10 text-center text-sm text-brand-brown-500">
                Approved customer stories will appear here soon.
              </div>
            )}
          </section>

          <aside className="lg:col-span-5">
            <form
              onSubmit={submitReview}
              className="sticky top-32 space-y-5 rounded-3xl border bg-white p-6 shadow-card md:p-8"
            >
              <div>
                <Heading as="h2" size="md">
                  Share your experience
                </Heading>
                <Text size="xs" variant="muted" className="mt-1">
                  Reviews are checked before publishing. No account is required.
                </Text>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold" htmlFor="review-product">
                  Product *
                </label>
                <select
                  id="review-product"
                  name="productId"
                  required
                  value={productId}
                  onChange={(event) => setProductId(event.target.value)}
                  className="h-11 w-full rounded-2xl border border-brand-beige-400/60 bg-white px-3 text-sm"
                >
                  <option value="">Choose a keepsake</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold" htmlFor="review-name">
                  Name *
                </label>
                <Input id="review-name" name="name" required minLength={2} maxLength={80} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold" htmlFor="review-email">
                  Email{" "}
                  <span className="font-normal text-brand-brown-400">
                    (optional, not published)
                  </span>
                </label>
                <Input id="review-email" name="email" type="email" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold" htmlFor="review-rating">
                  Rating *
                </label>
                <select
                  id="review-rating"
                  name="rating"
                  defaultValue="5"
                  className="h-11 w-full rounded-2xl border border-brand-beige-400/60 bg-white px-3 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} star{rating === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold" htmlFor="review-comment">
                  Your review *
                </label>
                <Textarea
                  id="review-comment"
                  name="comment"
                  required
                  minLength={10}
                  maxLength={1200}
                  className="min-h-32"
                />
              </div>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              {status !== "idle" && (
                <p
                  role="status"
                  className={`text-xs ${status === "error" ? "text-red-700" : "text-brand-sage-800"}`}
                >
                  {status === "sending" ? "Submitting..." : message}
                </p>
              )}
              <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
                Submit review
              </Button>
            </form>
          </aside>
        </div>
      </Container>
    </div>
  );
}
