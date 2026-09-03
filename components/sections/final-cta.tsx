import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Heart } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="bg-[#faf7f1] py-24 sm:py-32">
      <Container size="lg">
        <div className="relative space-y-7 overflow-hidden rounded-[3rem] border border-brand-pink-300/40 bg-gradient-to-br from-brand-pink-100/80 via-brand-cream to-brand-sage-100/70 p-9 text-center shadow-[0_40px_100px_-55px_rgba(61,39,30,.8)] sm:p-16">
          {/* Ambient decorative background sparkles */}
          <div className="pointer-events-none absolute -top-12 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-brand-pink-300/40 blur-2xl" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-pink-200 bg-white/80 shadow-subtle">
            <Heart className="h-6 w-6 fill-brand-pink-500 text-brand-pink-500" />
          </div>

          <Heading as="h2" size="2xl" className="text-balance font-serif">
            Let&apos;s make their heart stop for a second.
          </Heading>

          <Text size="base" variant="muted" className="mx-auto max-w-md text-balance">
            Tell us about the person or moment you want to celebrate. We&apos;ll help you find a
            handmade keepsake that feels just right.
          </Text>

          <div className="flex items-center justify-center pt-4">
            <WhatsAppButton label="Chat with us on WhatsApp" className="w-full sm:w-auto" />
          </div>
        </div>
      </Container>
    </section>
  );
}
