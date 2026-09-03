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
    imageUrl:
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop",
    href: "/collections",
  },
  {
    title: "Anniversaries",
    subtitle: "Everlasting preserved florals that celebrate your love story",
    imageUrl:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
    href: "/collections",
  },
  {
    title: "Couples & Engagements",
    subtitle: "Custom photo frames with wedding vows and dates",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    href: "/collections",
  },
  {
    title: "Dear Parents",
    subtitle: "Warm expressions of gratitude for Mom & Dad",
    imageUrl:
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop",
    href: "/collections",
  },
  {
    title: "Teachers & Mentors",
    subtitle: "Thoughtful floral glass domes and gratitude art",
    imageUrl:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
    href: "/collections",
  },
  {
    title: "Special Moments",
    subtitle: "Farewells, graduations, and just-because surprises",
    imageUrl:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
    href: "/collections",
  },
];

export function ShopByOccasion() {
  return (
    <section className="bg-[#faf7f1] py-24 sm:py-28">
      <Container size="xl">
        <div className="mb-14 space-y-4 text-center" data-reveal="up">
          <Badge variant="sage" className="home-eyebrow">
            Tailored Gifting
          </Badge>
          <Heading as="h2" size="2xl">
            A keepsake for every kind of love.
          </Heading>
          <Text size="sm" variant="muted" className="mx-auto max-w-lg">
            Find the perfect handcrafted keepsake crafted specifically for the milestone you are
            celebrating.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((occasion, index) => (
            <Link
              key={occasion.title}
              href={occasion.href}
              data-reveal="up"
              className={`occasion-editorial group relative flex h-80 flex-col justify-end overflow-hidden border border-white/70 p-6 shadow-[0_28px_60px_-42px_rgba(61,39,30,.6)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_70px_-38px_rgba(61,39,30,.55)] reveal-delay-${(index % 3) + 1}`}
            >
              {/* Background Image */}
              <Image
                src={occasion.imageUrl}
                alt={occasion.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.07]"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-900/90 via-brand-brown-900/25 to-transparent" />

              {/* Content */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <Heading as="h3" size="md" className="font-serif text-brand-cream">
                    {occasion.title}
                  </Heading>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <p className="line-clamp-1 text-xs text-brand-cream-300/90">{occasion.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
