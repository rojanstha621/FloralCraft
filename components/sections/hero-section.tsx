"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { FallbackHero } from "@/components/three/fallback-hero";
import { Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";

// Dynamic import with SSR false for Three.js
const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => <FallbackHero />,
});

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 md:py-16 lg:py-24">
      {/* Background ambient lighting glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-brand-sage-200/30 blur-3xl" />

      <Container size="xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Hero Content */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-sage/40 bg-brand-sage-50/80 px-4 py-1.5 text-xs font-medium text-brand-brown shadow-subtle animate-fadeIn">
              <Sparkles className="h-3.5 w-3.5 text-brand-sage-700" />
              <span>Handcrafted in Kathmandu, Nepal</span>
            </div>

            <Heading as="h1" size="hero" className="text-balance font-serif">
              More than just flowers... <br />
              <span className="italic text-brand-brown-600 font-normal">
                it&apos;s a feeling.
              </span>
            </Heading>

            <Text size="lg" variant="muted" className="max-w-xl text-balance">
              Handcrafted floral gifts made to preserve the moments, memories, and people you never want to forget. Personalized frames with real preserved botanicals.
            </Text>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 shadow-card hover:shadow-elevated">
                  <span>Shop Gifts</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/customize" className="w-full sm:w-auto">
                <Button variant="soft" size="lg" className="w-full sm:w-auto gap-2">
                  <Sparkles className="h-4 w-4 text-brand-pink-500" />
                  <span>Create Your Own</span>
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-brand-beige-300/50 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-brand-brown-600">
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-brand-pink-500 fill-brand-pink-200" />
                <span>100% Real Preserved Flowers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-sage-700" />
                <span>Kathmandu Valley Doorstep Delivery</span>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Hero */}
          <div className="flex items-center justify-center lg:col-span-5">
            <HeroScene />
          </div>
        </div>
      </Container>
    </section>
  );
}
