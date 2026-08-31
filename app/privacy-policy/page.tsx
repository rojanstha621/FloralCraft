import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-20">
      <Container size="md">
        <div className="rounded-4xl border border-brand-beige-300 bg-white p-8 md:p-14 shadow-card space-y-8">
          <div className="space-y-3 border-b border-brand-beige-200 pb-6">
            <Badge variant="sage">Data Privacy &amp; Photo Protection</Badge>
            <Heading as="h1" size="2xl" className="font-serif">
              Privacy Policy
            </Heading>
            <Text size="xs" variant="muted">
              Last updated: August 2025 • Petal Craft Florals, Kathmandu, Nepal
            </Text>
          </div>

          <div className="space-y-6 text-xs text-brand-brown leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                1. Protection of Uploaded Customer Photographs
              </h2>
              <p className="text-brand-brown-600">
                Your personal memories, wedding portraits, and family photographs uploaded through our Customizer are strictly used for fine-art printing your keepsake. We <strong>NEVER</strong> share, sell, or publicly showcase your personal photos on social media without your explicit prior written consent.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                2. Information We Collect
              </h2>
              <p className="text-brand-brown-600">
                When placing an order, we collect:
              </p>
              <ul className="list-disc pl-5 text-brand-brown-600 space-y-1">
                <li>Full name, mobile number, and email address for order confirmation and delivery coordination.</li>
                <li>Physical delivery address and landmarks in Kathmandu Valley.</li>
                <li>Custom inscriptions, message texts, and uploaded photo assets.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                3. Payment Security
              </h2>
              <p className="text-brand-brown-600">
                All digital transactions via eSewa, Khalti, or Fonepay are encrypted end-to-end through their respective PCI-DSS compliant secure gateways. We do not store or have access to your bank passwords, wallet PINs, or card CVVs.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
