import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Clock, ShieldCheck } from "lucide-react";

export default function DeliveryPolicyPage() {
  return (
    <div className="py-12 md:py-20">
      <Container size="md">
        <div className="rounded-4xl border border-brand-beige-300 bg-white p-8 md:p-14 shadow-card space-y-8">
          <div className="space-y-3 border-b border-brand-beige-200 pb-6">
            <Badge variant="sage">Kathmandu Logistics</Badge>
            <Heading as="h1" size="2xl" className="font-serif">
              Delivery Policy &amp; Packaging
            </Heading>
            <Text size="xs" variant="muted">
              Last updated: August 2025 • Petal Craft Florals, Kathmandu, Nepal
            </Text>
          </div>

          <div className="space-y-6 text-xs text-brand-brown leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-sage-700" />
                <span>1. Delivery Coverage in Kathmandu Valley</span>
              </h2>
              <p className="text-brand-brown-600">
                We operate direct, dedicated doorstep deliveries across the entire Kathmandu Valley including:
              </p>
              <ul className="list-disc pl-5 text-brand-brown-600 space-y-1">
                <li><strong>Kathmandu District:</strong> Thamel, Durbar Marg, Lazimpat, Baneshwor, Baluwatar, Kapan, Maharajgunj, Koteshwor, and all ring road &amp; sub-urban areas.</li>
                <li><strong>Lalitpur District:</strong> Jhamsikhel, Sanepa, Pulchowk, Jawalakhel, Kupondole, Imadol, Mahalaxmi, and environs.</li>
                <li><strong>Bhaktapur District:</strong> Suryabinayak, Thimi, Lokanthali, Sallaghari, and surrounding areas.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-pink-600" />
                <span>2. Preparation &amp; Dispatch Timeline</span>
              </h2>
              <p className="text-brand-brown-600">
                Because our keepsakes are meticulously handcrafted by artisans:
              </p>
              <ul className="list-disc pl-5 text-brand-brown-600 space-y-1">
                <li><strong>Customized Keepsakes (Photo &amp; Text):</strong> 2 to 4 business days for printing, botanical arrangement, and sealing.</li>
                <li><strong>Ready-Made Curated Domes &amp; Frames:</strong> Dispatched within 24 to 48 hours.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown flex items-center gap-2">
                <Package className="h-4 w-4 text-brand-beige-500" />
                <span>3. Delivery Charges &amp; Free Thresholds</span>
              </h2>
              <div className="rounded-2xl bg-brand-cream-100 p-4 space-y-1.5">
                <p>• <strong>Valley Orders Above Rs. 3,500:</strong> 100% FREE Doorstep Delivery.</p>
                <p>• <strong>Valley Orders Below Rs. 3,500:</strong> Flat Rs. 150 standard charge.</p>
                <p>• <strong>Outside Kathmandu Valley (Express Courier):</strong> Flat Rs. 250 - Rs. 350 based on district destination.</p>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base font-semibold text-brand-brown flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-sage-700" />
                <span>4. Luxury Protective Packaging</span>
              </h2>
              <p className="text-brand-brown-600">
                Every frame and dome is cushioned in multi-layer bubble insulation, enclosed within our signature rigid sage/cream boutique gift box, and finished with a hand-pressed botanical wax seal to guarantee pristine condition upon arrival.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
