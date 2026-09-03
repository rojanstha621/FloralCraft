import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Flower2, Sparkles, PackageCheck, MapPin } from "lucide-react";

export function WhyPetalCraft() {
  return (
    <section className="bg-[#efe5dc] py-24 sm:py-28">
      <Container size="xl">
        <div className="mb-14 space-y-4 text-center" data-reveal="up">
          <Badge variant="pink" className="home-eyebrow">
            The Petal Craft Standard
          </Badge>
          <Heading as="h2" size="2xl">
            Beauty in every last detail.
          </Heading>
          <Text size="sm" variant="muted" className="mx-auto max-w-xl">
            We are not a generic flower shop. We preserve emotions and stories through archival
            botanical craftsmanship.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div
            data-reveal="up"
            className="principle-card reveal-delay-1 flex flex-col items-start gap-3 border border-white/80 bg-white/45 p-8 text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-pink-100 text-brand-brown">
              <Flower2 className="h-6 w-6 text-brand-brown" />
            </div>
            <Heading as="h3" size="sm" className="font-serif">
              100% Real Preserved Flowers
            </Heading>
            <Text size="xs" variant="muted">
              Unlike fresh cut flowers that fade in days, our naturally treated florals maintain
              their color and texture for years without water.
            </Text>
          </div>

          <div
            data-reveal="up"
            className="principle-card reveal-delay-2 flex flex-col items-start gap-3 border border-white/80 bg-white/45 p-8 text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sage-100 text-brand-brown">
              <Sparkles className="h-6 w-6 text-brand-sage-800" />
            </div>
            <Heading as="h3" size="sm" className="font-serif">
              End-to-End Personalization
            </Heading>
            <Text size="xs" variant="muted">
              From your cherished photos and names to bespoke botanical arrangements, each creation
              is one of a kind.
            </Text>
          </div>

          <div
            data-reveal="up"
            className="principle-card reveal-delay-3 flex flex-col items-start gap-3 border border-white/80 bg-white/45 p-8 text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-beige-200 text-brand-brown">
              <PackageCheck className="h-6 w-6 text-brand-brown" />
            </div>
            <Heading as="h3" size="sm" className="font-serif">
              Luxury Unboxing Experience
            </Heading>
            <Text size="xs" variant="muted">
              Wrapped in tactile cotton paper, fastened with handmade botanical wax seals, and
              presented in rigid gift boxes.
            </Text>
          </div>

          <div
            data-reveal="up"
            className="principle-card reveal-delay-4 flex flex-col items-start gap-3 border border-white/80 bg-white/45 p-8 text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-pink-50 text-brand-brown">
              <MapPin className="h-6 w-6 text-brand-pink-600" />
            </div>
            <Heading as="h3" size="sm" className="font-serif">
              Made in Kathmandu, Nepal
            </Heading>
            <Text size="xs" variant="muted">
              Proudly crafted by local Nepali artisans with prompt, dedicated delivery across
              Kathmandu Valley.
            </Text>
          </div>
        </div>
      </Container>
    </section>
  );
}
