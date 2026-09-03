import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";

export default function RefundPolicyPage() {
  return (
    <div className="py-12 md:py-20">
      <Container size="md">
        <div className="space-y-8 rounded-4xl border border-brand-beige-300 bg-white p-8 shadow-card md:p-14">
          <div className="space-y-3 border-b border-brand-beige-200 pb-6">
            <Badge variant="pink">Customer Promise</Badge>
            <Heading as="h1" size="2xl" className="font-serif">
              Refund &amp; Cancellation Policy
            </Heading>
            <Text size="xs" variant="muted">
              Last updated: August 2025 • Petal Craft Florals, Kathmandu, Nepal
            </Text>
          </div>

          <div className="space-y-6 text-xs leading-relaxed text-brand-brown">
            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                1. Nature of Handmade &amp; Personalized Keepsakes
              </h2>
              <p className="text-brand-brown-600">
                Because our floral frames and memory keepsakes are custom printed with your personal
                photographs, vows, names, and hand-arranged preserved botanicals, personalized items
                cannot be restocked or returned for change of mind once production has started.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                2. Order Cancellations
              </h2>
              <p className="text-brand-brown-600">
                You may request cancellation or edits to your order within <strong>6 hours</strong>{" "}
                of placing it. Once our artisans begin photo printing and floral mounting (after 6
                hours), cancellations are subject to a materials deduction.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                3. Damaged or Defective Items (100% Replacement Guarantee)
              </h2>
              <p className="text-brand-brown-600">
                If your keepsake arrives with damaged glass, frame structural defect, or printing
                flaw due to courier handling, please notify us within <strong>24 hours</strong> of
                delivery via WhatsApp (+977 980-1234567) with an unboxing photo. We will craft and
                dispatch a complimentary replacement immediately at zero cost.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown">
                4. Refund Processing
              </h2>
              <p className="text-brand-brown-600">
                When a refund is approved, our studio will confirm the return method and expected
                processing time with you directly.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
