import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="py-12 md:py-20">
      <Container size="md">
        <div className="space-y-8 rounded-4xl border border-brand-beige-300 bg-white p-8 shadow-card md:p-14">
          <div className="space-y-3 border-b border-brand-beige-200 pb-6">
            <Badge variant="pink">Legal Agreement</Badge>
            <Heading as="h1" size="2xl" className="font-serif">
              Terms &amp; Conditions of Service
            </Heading>
            <Text size="xs" variant="muted">
              Last updated: August 2025 • Petal Craft Florals, Kathmandu, Nepal
            </Text>
          </div>

          <div className="space-y-6 text-xs leading-relaxed text-brand-brown">
            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                1. Acceptance of Terms
              </h2>
              <p className="text-brand-brown-600">
                By browsing this website or confirming an order with Petal Craft Florals through
                WhatsApp, you agree to these terms, our Delivery Policy, and our Refund Policy.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                2. Handmade Botanical Variations
              </h2>
              <p className="text-brand-brown-600">
                Each flower blossom is organically grown and naturally preserved. Minor variations
                in flower petal size, color shading, and stem curves are natural characteristics of
                genuine botanical art and make every individual keepsake frame completely unique.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                3. Intellectual Property
              </h2>
              <p className="text-brand-brown-600">
                All branding assets, photography, 3D presentations, web designs, and copy are the
                proprietary intellectual property of Petal Craft Florals, Kathmandu, Nepal.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
