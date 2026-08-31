"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2, Quote, Plus, X, Heart } from "lucide-react";

interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  product: string;
  comment: string;
  imageUrl?: string;
  isVerified: boolean;
}

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    author: "Prashant & Shreya",
    location: "Jhamsikhel, Lalitpur",
    rating: 5,
    date: "February 2025",
    product: "Our Story Customized Keepsake",
    comment:
      "I ordered this for our 2nd anniversary and my wife was genuinely moved to tears. The preserved flowers look so fresh and delicate, and the photo printing was crystal clear. Unboxing felt like a royal boutique experience!",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: "rev-2",
    author: "Aayushma Sharma",
    location: "Lazimpat, Kathmandu",
    rating: 5,
    date: "January 2025",
    product: "Dear Mom Preserved Rose Shadowbox",
    comment:
      "Gifting flowers in Nepal usually means they wilt in 3 days. Petal Craft completely changed that. My mom has kept this on her bedside table for months now. Exceptional craftsmanship.",
    imageUrl: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: "rev-3",
    author: "Rohan Manandhar",
    location: "Suryabinayak, Bhaktapur",
    rating: 5,
    date: "Valentine's Week 2025",
    product: "Forever Bloom Botanical Frame",
    comment:
      "Super seamless delivery in Kathmandu Valley and payment with eSewa was instant. The wax seal packaging made it feel like a handcrafted heirloom.",
    isVerified: true,
  },
  {
    id: "rev-4",
    author: "Sneha Tuladhar",
    location: "Baneshwor, Kathmandu",
    rating: 5,
    date: "December 2024",
    product: "With Gratitude Floral Glass Dome",
    comment:
      "Ordered this as a farewell gift for our mentor. The glass bell jar with dried wildflowers looks magical under desk lights. Highly recommended!",
    imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
    isVerified: true,
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("Kathmandu");
  const [product, setProduct] = useState("Custom Floral Keepsake");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author,
      location,
      rating,
      date: "Just now",
      product,
      comment,
      isVerified: false,
    };

    setReviews([newRev, ...reviews]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmittedMessage(false);
      setAuthor("");
      setComment("");
    }, 1800);
  };

  return (
    <div className="py-12 md:py-20">
      <Container size="xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <Badge variant="pink">Verified Stories</Badge>
            <Heading as="h1" size="2xl" className="font-serif">
              Customer Reviews &amp; Love Notes
            </Heading>
            <Text size="base" variant="muted" className="max-w-xl">
              Read how Petal Craft keepsakes have brought smiles, tears of joy, and lasting memories to loved ones across Nepal.
            </Text>
          </div>

          <Button
            variant="primary"
            size="md"
            className="gap-2 shrink-0"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Write a Review</span>
          </Button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="relative flex flex-col justify-between rounded-3xl border border-brand-beige-300 bg-white p-8 shadow-card"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-brand-pink-200/50" />

              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center space-x-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="font-serif text-sm italic leading-relaxed text-brand-brown/90">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {rev.imageUrl && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-beige-300 bg-brand-cream-100 mt-2">
                    <Image
                      src={rev.imageUrl}
                      alt={`Review by ${rev.author}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-brand-beige-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-brand-brown">
                    <span>{rev.author}</span>
                    {rev.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-brand-sage-700" />}
                  </div>
                  <span className="text-[10px] text-brand-brown-400">
                    {rev.location} • {rev.product}
                  </span>
                </div>
                <span className="text-[10px] text-brand-brown-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Write a Review */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-brown-900/50 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md rounded-3xl border border-brand-beige-300 bg-white p-6 md:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-brand-beige-200 pb-3">
                <h3 className="font-serif font-bold text-lg text-brand-brown">
                  Share Your Petal Craft Experience
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-brand-brown-400 hover:bg-brand-cream-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {submittedMessage ? (
                <div className="text-center py-6 space-y-2">
                  <Heart className="h-10 w-10 text-brand-pink-500 fill-brand-pink-300 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-brand-brown">
                    Thank You!
                  </h4>
                  <p className="text-xs text-brand-brown-500">
                    Your review has been submitted to our Kathmandu studio moderation queue.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1">
                      Your Name *
                    </label>
                    <Input
                      placeholder="e.g. Suman Shakya"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-brand-brown mb-1">
                        Location
                      </label>
                      <Input
                        placeholder="Kathmandu"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-brand-brown mb-1">
                        Rating (1-5)
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="h-11 w-full rounded-2xl border border-brand-beige-400/60 bg-white px-3 text-sm text-brand-brown"
                      >
                        <option value={5}>★★★★★ (5 Stars)</option>
                        <option value={4}>★★★★☆ (4 Stars)</option>
                        <option value={3}>★★★☆☆ (3 Stars)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1">
                      Product Name
                    </label>
                    <Input
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1">
                      Your Feedback / Story *
                    </label>
                    <Textarea
                      placeholder="How did your recipient react when unboxing their keepsake?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      className="min-h-[90px]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Submit Review
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
