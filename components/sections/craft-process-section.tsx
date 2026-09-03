import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Palette, Flower2, Gift, Truck } from "lucide-react";

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Designed",
    desc: "Every keepsake begins with a thoughtful composition created for the feeling behind the gift.",
    icon: Palette,
    color: "bg-brand-pink-100 text-brand-pink-800",
  },
  {
    step: "02",
    title: "Handcrafted",
    desc: "Our artisans carefully arrange preserved flowers and finish every detail by hand.",
    icon: Flower2,
    color: "bg-brand-sage-100 text-brand-sage-800",
  },
  {
    step: "03",
    title: "Packaged",
    desc: "Your piece is protected and beautifully wrapped so the unboxing feels as special as the gift.",
    icon: Gift,
    color: "bg-brand-beige-200 text-brand-brown-800",
  },
  {
    step: "04",
    title: "Delivered",
    desc: "We coordinate delivery with care across Kathmandu Valley and arrange courier options beyond it.",
    icon: Truck,
    color: "bg-brand-pink-50 text-brand-pink-700",
  },
];

export function CraftProcessSection() {
  return (
    <section className="bg-[#faf7f1] py-24 sm:py-28">
      <Container size="xl">
        <div className="mb-16 space-y-4 text-center">
          <Badge variant="sage">The Artisan Journey</Badge>
          <Heading as="h2" size="2xl">
            From your story to their hands.
          </Heading>
          <Text size="sm" variant="muted" className="mx-auto max-w-md">
            How we turn your cherished moments into everlasting floral art in 4 mindful steps.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col items-center rounded-[2rem] border border-white bg-white/75 p-8 text-center shadow-[0_22px_55px_-40px_rgba(61,39,30,.75)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_65px_-38px_rgba(61,39,30,.6)]"
              >
                {/* Step numbering */}
                <div className="absolute right-5 top-4 font-serif text-2xl font-bold text-brand-brown-300/40">
                  {item.step}
                </div>

                {/* Icon */}
                <div
                  className={`mb-6 flex h-14 w-14 rotate-3 items-center justify-center rounded-2xl ${item.color} shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_12px_24px_-12px_rgba(61,39,30,.3)] transition-transform duration-300 group-hover:rotate-0`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <Heading
                  as="h3"
                  size="sm"
                  className="mb-2 font-serif font-semibold text-brand-brown"
                >
                  {item.title}
                </Heading>

                <Text size="xs" variant="muted">
                  {item.desc}
                </Text>

                {idx < PROCESS_STEPS.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-lg text-brand-beige-400 lg:block">
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
