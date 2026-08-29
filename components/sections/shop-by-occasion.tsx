import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

export const OCCASIONS = [
  {
    title: "Birthdays",
    subtitle: "Vibrant botanical memories for their special day",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
    href: "/shop?occasion=birthdays",
  },
  {
    title: "Anniversaries",
    subtitle: "Everlasting preserved florals that celebrate your love story",
    imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
    href: "/shop?occasion=anniversaries",
  },
  {
    title: "Couples & Engagements",
    subtitle: "Custom photo frames with wedding vows and dates",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    href: "/shop?occasion=couples",
  },
  {
    title: "Dear Parents",
    subtitle: "Warm expressions of gratitude for Mom & Dad",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
    href: "/shop?occasion=parents",
  },
  {
    title: "Teachers & Mentors",
    subtitle: "Thoughtful floral glass domes and gratitude art",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
    href: "/shop?occasion=teachers",
  },
  {
    title: "Special Moments",
    subtitle: "Farewells, graduations, and just-because surprises",
    imageUrl: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=800&auto=format&fit=crop",
    href: "/shop?occasion=special-moments",
  },
];

export function ShopByOccasion() {
  return (
    <section className="py-16">
      <Container size="xl">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="sage">Tailored Gifting</Badge>
          <Heading as="h2" size="2xl">
            Shop by Occasion
          </Heading>
          <Text size="sm" variant="muted" className="max-w-lg mx-auto">
            Find the perfect handcrafted keepsake crafted specifically for the milestone you are celebrating.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((occasion) => (
            <Link
              key={occasion.title}
              href={occasion.href}
              className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl border border-brand-beige-300/60 p-6 shadow-subtle transition-all duration-300 hover:shadow-card hover:-translate-y-1"
            >
              {/* Background Image */}
              <Image
                src={occasion.imageUrl}
                alt={occasion.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-900/90 via-brand-brown-900/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <Heading as="h3" size="md" className="text-brand-cream font-serif">
                    {occasion.title}
                  </Heading>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xs text-brand-cream-300/90 line-clamp-1">
                  {occasion.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
