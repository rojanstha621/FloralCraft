import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, Quote } from "lucide-react";

export const REVIEWS = [
  {
    id: "rev-1",
    author: "Prashant & Shreya",
    location: "Lalitpur",
    rating: 5,
    date: "February 2025",
    product: "Our Story Customized Keepsake",
    comment:
      "I ordered this for our 2nd anniversary and my wife was genuinely moved to tears. The preserved flowers look so fresh and delicate, and the photo printing was crystal clear. Unboxing felt so luxurious!",
  },
  {
    id: "rev-2",
    author: "Aayushma Sharma",
    location: "Kathmandu",
    rating: 5,
    date: "January 2025",
    product: "Dear Mom Preserved Rose Frame",
    comment:
      "Gifting flowers in Nepal usually means they wilt in 3 days. Petal Craft completely changed that. My mom has kept this on her bedside table for months now. Exceptional craftsmanship.",
  },
  {
    id: "rev-3",
    author: "Rohan Manandhar",
    location: "Bhaktapur",
    rating: 5,
    date: "Valentine's Week 2025",
    product: "Forever Bloom Botanical Frame",
    comment:
      "Super seamless delivery in Kathmandu Valley and payment with eSewa was instant. The wax seal packaging made it feel like a royal gift.",
  },
];

export function ReviewsSection() {
  return (
    <section className="py-16">
      <Container size="xl">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="sage">Heartfelt Words</Badge>
          <Heading as="h2" size="2xl">
            Loved Across Kathmandu
          </Heading>
          <Text size="sm" variant="muted" className="max-w-md mx-auto">
            Read how Petal Craft keepsakes have helped celebrate love, friendships, and milestones.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="relative flex flex-col justify-between rounded-3xl border border-brand-beige-300/80 bg-white/80 p-8 shadow-card"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-brand-pink-200/60" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-brand-brown/90 italic font-serif">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-beige-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-xs text-brand-brown">
                    <span>{rev.author}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-sage-600" />
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
      </Container>
    </section>
  );
}
