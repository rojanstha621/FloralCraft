import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Palette, Flower2, Gift, Truck } from "lucide-react";

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "We listen",
    desc: "You share the person, occasion, colors, photographs, or words that make the piece meaningful.",
    icon: Palette,
    color: "bg-brand-pink-100 text-brand-pink-800",
  },
  {
    step: "02",
    title: "We compose",
    desc: "We choose the form, botanicals, paper, ribbon, and small details that belong to your story.",
    icon: Flower2,
    color: "bg-brand-sage-100 text-brand-sage-800",
  },
  {
    step: "03",
    title: "We make",
    desc: "Every flower is placed and every finish considered by hand—never on a production line.",
    icon: Gift,
    color: "bg-brand-beige-200 text-brand-brown-800",
  },
  {
    step: "04",
    title: "You give",
    desc: "The finished piece is wrapped with care and delivered ready to become part of the memory.",
    icon: Truck,
    color: "bg-brand-pink-50 text-brand-pink-700",
  },
];

export function CraftProcessSection() {
  return (
    <section className="home-craft bg-[#faf7f1] py-24 sm:py-28">
      <Container size="xl">
        <div className="mb-16 space-y-4 text-center" data-reveal="up">
          <Badge variant="sage" className="home-eyebrow">
            Made at the studio
          </Badge>
          <Heading as="h2" size="2xl">
            From your story to their hands.
          </Heading>
          <Text size="sm" variant="muted" className="mx-auto max-w-md">
            A personal, unhurried process from the first conversation to the moment it is given.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                data-reveal="up"
                className={`process-editorial relative flex flex-col items-center border-t border-brand-brown/15 p-8 text-center transition-all duration-500 hover:-translate-y-1 reveal-delay-${(idx % 4) + 1}`}
              >
                <div className="absolute right-5 top-4 font-serif text-2xl font-bold text-brand-brown-300/40">
                  {item.step}
                </div>

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
