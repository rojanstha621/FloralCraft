"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";

interface ReviewPreview {
  id: string;
  reviewerName: string;
  rating: number;
  body: string;
  product: { name: string };
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewPreview[]>([]);
  useEffect(() => {
    fetch("/api/reviews")
      .then((response) => response.json())
      .then((data) => data.success && setReviews(data.reviews.slice(0, 3)))
      .catch(() => undefined);
  }, []);
  if (!reviews.length) return null;

  return (
    <section className="home-reviews bg-[#faf7f1] py-24 sm:py-28">
      <Container size="xl">
        <div className="mb-12 space-y-3 text-center" data-reveal="up">
          <Badge variant="sage" className="home-eyebrow">
            Notes we keep
          </Badge>
          <Heading as="h2" size="2xl">
            The moment after it is opened.
          </Heading>
          <Text size="sm" variant="muted" className="mx-auto max-w-md">
            A few words from people who trusted us with birthdays, milestones, and memories.
          </Text>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <article
              key={review.id}
              data-reveal="up"
              className={`review-editorial relative border-y border-brand-brown/15 bg-transparent px-5 py-8 transition duration-500 reveal-delay-${index + 1}`}
            >
              <Quote className="absolute right-6 top-6 h-7 w-7 text-brand-pink-200" />
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${index < review.rating ? "fill-amber-400" : ""}`}
                  />
                ))}
              </div>
              <p className="mt-5 font-serif text-xl italic leading-relaxed text-brand-brown-800">
                &ldquo;{review.body}&rdquo;
              </p>
              <div className="mt-5 border-t pt-4 text-xs">
                <strong>{review.reviewerName}</strong>
                <span className="block text-brand-brown-400">{review.product.name}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center" data-reveal="up">
          <Link
            href="/reviews"
            className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
          >
            Read all customer stories
          </Link>
        </div>
      </Container>
    </section>
  );
}
