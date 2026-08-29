import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Sparkles, ArrowRight, Heart, Flower2, ShieldCheck, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-12 md:py-20">
      {/* Brand Hero Introduction */}
      <section className="relative overflow-hidden">
        <Container size="xl">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-sage/40 bg-brand-sage-50 px-4 py-1.5 text-xs font-medium text-brand-brown shadow-subtle animate-fadeIn">
              <Sparkles className="h-3.5 w-3.5 text-brand-sage-600" />
              <span>Handcrafted with devotion in Kathmandu, Nepal</span>
            </div>

            <Heading as="h1" size="hero" className="text-balance font-serif">
              More than just flowers... <br />
              <span className="italic text-brand-brown-600 font-normal">it&apos;s a feeling.</span>
            </Heading>

            <Text size="lg" variant="muted" className="mx-auto max-w-2xl text-balance">
              Handcrafted floral gifts made to preserve the moments, memories, and people you never want to forget.
            </Text>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/shop">
                <Button variant="primary" size="lg" className="gap-2 shadow-card hover:shadow-elevated">
                  <span>Shop Gifts</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/customize">
                <Button variant="soft" size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4 text-brand-pink-500" />
                  <span>Create Your Own</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Brand Pillars / Value Proposition */}
      <section className="py-6">
        <Container size="xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col items-center text-center space-y-3 bg-white/70 border-brand-beige-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-pink-100 text-brand-brown">
                <Flower2 className="h-6 w-6 text-brand-brown" />
              </div>
              <Heading as="h3" size="sm" className="font-serif">
                100% Handmade
              </Heading>
              <Text size="sm" variant="muted">
                Each piece is carefully arranged by artisans in Kathmandu using premium dried and preserved florals.
              </Text>
            </Card>

            <Card className="flex flex-col items-center text-center space-y-3 bg-white/70 border-brand-beige-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sage-100 text-brand-brown">
                <Sparkles className="h-6 w-6 text-brand-sage-700" />
              </div>
              <Heading as="h3" size="sm" className="font-serif">
                Fully Customizable
              </Heading>
              <Text size="sm" variant="muted">
                Personalize with your favorite photographs, warm handwritten notes, custom frames, and color palettes.
              </Text>
            </Card>

            <Card className="flex flex-col items-center text-center space-y-3 bg-white/70 border-brand-beige-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-beige-200 text-brand-brown">
                <ShieldCheck className="h-6 w-6 text-brand-brown" />
              </div>
              <Heading as="h3" size="sm" className="font-serif">
                Thoughtfully Packaged
              </Heading>
              <Text size="sm" variant="muted">
                Delivered in luxury boutique gift boxes with wax seals, ready to bring tears of joy to your loved ones.
              </Text>
            </Card>

            <Card className="flex flex-col items-center text-center space-y-3 bg-white/70 border-brand-beige-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-pink-50 text-brand-brown">
                <Truck className="h-6 w-6 text-brand-pink-600" />
              </div>
              <Heading as="h3" size="sm" className="font-serif">
                Kathmandu Valley Delivery
              </Heading>
              <Text size="sm" variant="muted">
                Hand-delivered with utmost care right to your doorstep across Kathmandu, Lalitpur, and Bhaktapur.
              </Text>
            </Card>
          </div>
        </Container>
      </section>

      {/* Brand Identity & Token Overview Section */}
      <section className="py-8 bg-brand-cream-200/50 rounded-3xl border border-brand-beige-300/40">
        <Container size="xl">
          <div className="text-center space-y-3 mb-10">
            <Badge variant="sage">Design Architecture</Badge>
            <Heading as="h2" size="xl">
              Brand Identity System & Color Harmony
            </Heading>
            <Text size="sm" variant="muted" className="max-w-xl mx-auto">
              Constructed according to the official Petal Craft Florals design guidelines with soft, emotional, and botanical luxury tokens.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Logo Variants Matrix */}
            <div className="space-y-4">
              <Heading as="h3" size="sm" className="font-semibold text-brand-brown">
                Responsive Logo System
              </Heading>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-beige-300 bg-white/80 p-5 text-center">
                  <Logo variant="circular" size="sm" asLink={false} />
                  <span className="mt-2 text-xs font-medium text-brand-brown-400">Circular Emblem</span>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-beige-300 bg-white/80 p-5 text-center">
                  <Logo variant="monogram" size="lg" asLink={false} />
                  <span className="mt-2 text-xs font-medium text-brand-brown-400">PC Monogram</span>
                </div>

                <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border border-brand-beige-300 bg-white/80 p-5 text-center">
                  <Logo variant="horizontal" size="md" asLink={false} />
                  <span className="mt-2 text-xs font-medium text-brand-brown-400">Horizontal Brandmark</span>
                </div>
              </div>
            </div>

            {/* Brand Color Tokens Matrix */}
            <div className="space-y-4">
              <Heading as="h3" size="sm" className="font-semibold text-brand-brown">
                Harmonious Color Palette
              </Heading>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-brand-pink p-3.5 text-brand-brown-900 shadow-subtle">
                  <span className="font-serif font-semibold">Dusty Pink</span>
                  <span className="font-mono text-xs font-bold">#E8B8B8</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-brand-sage p-3.5 text-brand-brown-900 shadow-subtle">
                  <span className="font-serif font-semibold">Sage Green</span>
                  <span className="font-mono text-xs font-bold">#A7B89F</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-brand-cream border border-brand-beige p-3.5 text-brand-brown shadow-subtle">
                  <span className="font-serif font-semibold">Cream</span>
                  <span className="font-mono text-xs font-bold">#F9F6EF</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-brand-brown p-3.5 text-brand-cream shadow-subtle">
                  <span className="font-serif font-semibold">Warm Brown</span>
                  <span className="font-mono text-xs font-bold">#7A5B4F</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-brand-beige p-3.5 text-brand-brown shadow-subtle">
                  <span className="font-serif font-semibold">Beige</span>
                  <span className="font-mono text-xs font-bold">#D7C9B8</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-8">
        <Container size="xl">
          <div className="text-center space-y-3 mb-12">
            <Badge variant="pink">The Handmade Journey</Badge>
            <Heading as="h2" size="xl">
              From Heart to Keepsake in 4 Steps
            </Heading>
            <Text size="sm" variant="muted" className="max-w-md mx-auto">
              We turn your heartfelt memories and messages into timeless handcrafted floral art.
            </Text>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Choose Gift", desc: "Select a curated botanical frame or custom gift format." },
              { step: "02", title: "Personalize", desc: "Upload your cherished photo and write a personalized note." },
              { step: "03", title: "Handcrafted", desc: "Our artisans meticulously compose the dried flowers and frame." },
              { step: "04", title: "Delivered", desc: "Carefully wrapped with luxury packaging and delivered in Kathmandu." },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-3xl border border-brand-beige-300/80 bg-white/70 p-6 text-center space-y-2 shadow-subtle"
              >
                <span className="font-serif text-3xl font-bold text-brand-pink-400/80">{item.step}</span>
                <Heading as="h4" size="sm" className="font-serif font-semibold text-brand-brown">
                  {item.title}
                </Heading>
                <Text size="xs" variant="muted">
                  {item.desc}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Emotional Closing Banner */}
      <section className="text-center py-10">
        <Container size="md">
          <div className="rounded-3xl border border-brand-pink-300/60 bg-gradient-to-b from-brand-pink-50 to-brand-cream p-8 md:p-12 space-y-6 shadow-card">
            <Heart className="h-8 w-8 text-brand-pink-500 mx-auto fill-brand-pink-200" />
            <Heading as="h2" size="2xl" className="font-serif">
              Give them something they&apos;ll keep forever.
            </Heading>
            <Text size="base" variant="muted" className="max-w-lg mx-auto">
              Every petal is placed with intention, making each gift as unique as the memory it represents.
            </Text>
            <div className="pt-2">
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
