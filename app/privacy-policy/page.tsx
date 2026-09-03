import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-20">
      <Container size="md">
        <div className="space-y-8 rounded-4xl border border-brand-beige-300 bg-white p-8 shadow-card md:p-14">
          <div className="space-y-3 border-b border-brand-beige-200 pb-6">
            <Badge variant="sage">Data Privacy &amp; Photo Protection</Badge>
            <Heading as="h1" size="2xl" className="font-serif">
              Privacy Policy
            </Heading>
            <Text size="xs" variant="muted">
              Last updated: August 2025 • Petal Craft Florals, Kathmandu, Nepal
            </Text>
          </div>

          <div className="space-y-6 text-xs leading-relaxed text-brand-brown">
            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                1. Protection of Uploaded Customer Photographs
              </h2>
              <p className="text-brand-brown-600">
                Personal memories, photographs, and order details shared with our team through
                WhatsApp are used only to discuss and prepare your requested keepsake. We{" "}
                <strong>NEVER</strong> share, sell, or publicly showcase personal content without
                explicit prior consent.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                2. Information We Collect
              </h2>
              <p className="text-brand-brown-600">When placing an order, we collect:</p>
              <ul className="list-disc space-y-1 pl-5 text-brand-brown-600">
                <li>
                  Full name, mobile number, and email address for order confirmation and delivery
                  coordination.
                </li>
                <li>Physical delivery address and landmarks in Kathmandu Valley.</li>
                <li>Custom inscriptions, message texts, and uploaded photo assets.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                3. Ordering and Payment
              </h2>
              <p className="text-brand-brown-600">
                Ordering and payment arrangements are confirmed directly with our studio. This
                website does not collect card numbers, wallet PINs, banking passwords, or payment
                credentials.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
