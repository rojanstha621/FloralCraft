import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20">
      <Container size="md">
        <div className="relative overflow-hidden rounded-4xl border border-brand-pink-300/80 bg-gradient-to-b from-brand-pink-100/70 via-brand-cream to-brand-cream-100 p-8 sm:p-14 text-center space-y-6 shadow-card">
          {/* Ambient decorative background sparkles */}
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-36 w-36 rounded-full bg-brand-pink-300/40 blur-2xl" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/80 shadow-subtle border border-brand-pink-200">
            <Heart className="h-6 w-6 fill-brand-pink-500 text-brand-pink-500" />
          </div>

          <Heading as="h2" size="2xl" className="font-serif text-balance">
            Give them something they&apos;ll keep.
          </Heading>

          <Text size="base" variant="muted" className="max-w-md mx-auto text-balance">
            Every petal is placed with intention, making each keepsake as unique as the memory it represents. Handcrafted in Kathmandu, Nepal.
          </Text>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 shadow-card hover:shadow-elevated">
                <span>Shop All Gifts</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/customize" className="w-full sm:w-auto">
              <Button variant="soft" size="lg" className="w-full sm:w-auto gap-2">
                <Sparkles className="h-4 w-4 text-brand-pink-500" />
                <span>Create Custom Gift</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
