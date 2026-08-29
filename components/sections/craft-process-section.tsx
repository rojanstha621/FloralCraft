import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Palette, Gift, Truck } from "lucide-react";

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Choose Frame & Style",
    desc: "Browse our signature wooden, shadowbox, or dome formats suited for your occasion.",
    icon: Sparkles,
    color: "bg-brand-pink-100 text-brand-pink-800",
  },
  {
    step: "02",
    title: "Personalize Your Details",
    desc: "Upload a special photo, write your custom message, choose floral tones, and pick dimensions.",
    icon: Palette,
    color: "bg-brand-sage-100 text-brand-sage-800",
  },
  {
    step: "03",
    title: "Handcrafted in Kathmandu",
    desc: "Our artisans carefully dry, treat, and hand-assemble every flower petal with surgical precision.",
    icon: Gift,
    color: "bg-brand-beige-200 text-brand-brown-800",
  },
  {
    step: "04",
    title: "Doorstep Gift Delivery",
    desc: "Wrapped in luxury paper, secured with wax seals, and delivered directly to your loved one.",
    icon: Truck,
    color: "bg-brand-pink-50 text-brand-pink-700",
  },
];

export function CraftProcessSection() {
  return (
    <section className="py-16">
      <Container size="xl">
        <div className="text-center space-y-3 mb-14">
          <Badge variant="sage">The Artisan Journey</Badge>
          <Heading as="h2" size="2xl">
            From Heart to Keepsake
          </Heading>
          <Text size="sm" variant="muted" className="max-w-md mx-auto">
            How we turn your cherished moments into everlasting floral art in 4 mindful steps.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col items-center text-center rounded-3xl border border-brand-beige-300/80 bg-white/70 p-8 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
              >
                {/* Step numbering */}
                <div className="absolute top-4 right-5 font-serif text-2xl font-bold text-brand-brown-300/40">
                  {item.step}
                </div>

                {/* Icon */}
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} shadow-subtle`}>
                  <Icon className="h-6 w-6" />
                </div>

                <Heading as="h3" size="sm" className="font-serif font-semibold text-brand-brown mb-2">
                  {item.title}
                </Heading>

                <Text size="xs" variant="muted">
                  {item.desc}
                </Text>

                {idx < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-brand-beige-400 text-lg">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
