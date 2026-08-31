import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Flower2, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20">
      <Container size="xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="pink">Our Studio Heritage</Badge>
          <Heading as="h1" size="hero" className="font-serif">
            More than just flowers... <br />
            <span className="italic text-brand-brown-600 font-normal">it&apos;s a feeling.</span>
          </Heading>
          <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
            Founded with a passion for preserving life&apos;s quiet, tender moments, Petal Craft Florals turns genuine botanical wonders into timeless keepsakes.
          </Text>
        </div>

        {/* 2-Column Story Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center mb-20">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-4xl border border-brand-beige-300 bg-brand-cream-100 shadow-card lg:col-span-5">
            <Image
              src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop"
              alt="Artisan arranging preserved flowers in Kathmandu"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <Badge variant="sage">The Kathmandu Connection</Badge>
            <Heading as="h2" size="xl" className="font-serif">
              Handcrafted with devotion in Nepal
            </Heading>
            <Text size="base" variant="muted" className="leading-relaxed">
              In a world of fast gifts and temporary bouquets that wilt within days, we wanted to create something enduring. Fresh flowers carry tremendous emotional weight, but their ephemeral nature often leaves a feeling of loss when they fade.
            </Text>
            <Text size="base" variant="muted" className="leading-relaxed">
              At Petal Craft Florals, our artisans in Lalitpur carefully preserve natural botanicals using eco-friendly drying techniques that retain the organic softness, vibrant hues, and delicate petal textures for years.
            </Text>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl border border-brand-beige-300 bg-white p-4 shadow-subtle">
                <span className="font-serif text-2xl font-bold text-brand-brown">100%</span>
                <p className="text-xs text-brand-brown-500 mt-0.5">Real Preserved Botanicals</p>
              </div>
              <div className="rounded-2xl border border-brand-beige-300 bg-white p-4 shadow-subtle">
                <span className="font-serif text-2xl font-bold text-brand-brown">3-5+</span>
                <p className="text-xs text-brand-brown-500 mt-0.5">Years of Lasting Beauty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Craftsmanship Pillars */}
        <div className="rounded-4xl border border-brand-beige-300 bg-white/80 p-8 sm:p-14 shadow-card space-y-10 mb-20">
          <div className="text-center space-y-2">
            <Heading as="h2" size="xl" className="font-serif">
              Our Artisan Principles
            </Heading>
            <Text size="sm" variant="muted" className="max-w-md mx-auto">
              Every detail is considered—from organic preservation to hand-poured wax seals.
            </Text>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-3 text-center sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-pink-100 text-brand-brown mx-auto sm:mx-0">
                <Flower2 className="h-6 w-6" />
              </div>
              <Heading as="h3" size="sm" className="font-serif font-semibold text-brand-brown">
                Mindful Floral Sourcing
              </Heading>
              <Text size="xs" variant="muted">
                We work directly with sustainable growers and collect local flora from the surrounding Kathmandu hillsides.
              </Text>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sage-100 text-brand-brown mx-auto sm:mx-0">
                <Sparkles className="h-6 w-6 text-brand-sage-800" />
              </div>
              <Heading as="h3" size="sm" className="font-serif font-semibold text-brand-brown">
                Archival Fine-Art Materials
              </Heading>
              <Text size="xs" variant="muted">
                Frames made of natural teak, ash, and pine wood paired with UV-blocking museum acrylic to shield petals from fading.
              </Text>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-beige-200 text-brand-brown mx-auto sm:mx-0">
                <Heart className="h-6 w-6" />
              </div>
              <Heading as="h3" size="sm" className="font-serif font-semibold text-brand-brown">
                Emotional Storytelling
              </Heading>
              <Text size="xs" variant="muted">
                Each frame tells your story—be it a wedding anniversary, a tribute to mom, or celebrating a lifetime friend.
              </Text>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Heading as="h2" size="xl" className="font-serif">
            Ready to preserve a memory?
          </Heading>
          <div className="flex justify-center gap-4">
            <Link href="/shop">
              <Button variant="primary" size="lg" className="gap-2">
                <span>Browse Curated Gifts</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
