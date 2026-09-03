import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Heart } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="home-final bg-[#faf7f1] py-24 sm:py-32">
      <Container size="lg">
        <div
          data-reveal="up"
          className="final-editorial relative space-y-7 overflow-hidden border-y border-brand-pink-300/40 bg-brand-pink-50/70 p-9 text-center sm:p-16"
        >
          <div className="cta-bloom mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-pink-200 bg-white/80 shadow-subtle">
            <Heart className="h-6 w-6 fill-brand-pink-500 text-brand-pink-500" />
          </div>

          <Heading as="h2" size="2xl" className="text-balance font-serif">
            Some feelings deserve a form you can keep.
          </Heading>

          <Text size="base" variant="muted" className="mx-auto max-w-md text-balance">
            Tell us the story, the occasion, or the memory. We&apos;ll help shape it into a floral
            piece made especially for them.
          </Text>

          <div className="flex items-center justify-center pt-4">
            <WhatsAppButton
              label="Start your custom keepsake"
              className="h-14 w-full px-8 sm:w-auto"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
