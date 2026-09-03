"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Floral Care & Preservation",
    q: "Do preserved flowers require water or sunlight?",
    a: "No watering is needed whatsoever! In fact, you should keep your keepsake away from water and high humidity. Preserved flowers have undergone an organic treatment that replaces their natural sap, allowing them to remain pristine and soft for 3 to 5+ years.",
  },
  {
    category: "Floral Care & Preservation",
    q: "How long do Petal Craft keepsakes last?",
    a: "When kept indoors away from direct, harsh midday sunlight and moisture, our handcrafted preserved frames and glass domes retain their vibrant hues and textures for 3 to 5+ years without wilting.",
  },
  {
    category: "Custom Orders",
    q: "Can I request a special message or personal detail?",
    a: "Some keepsakes can include personal details depending on the design. Send us your idea on WhatsApp and our studio will confirm what is possible, the timeline, and the final price before you order.",
  },
  {
    category: "Custom Orders",
    q: "How long does custom handcrafting take?",
    a: "Each custom keepsake requires 2 to 4 business days of meticulous artisan preparation in our Lalitpur studio before dispatch. If you need urgent delivery for an anniversary or birthday, please contact us on WhatsApp.",
  },
  {
    category: "Delivery in Nepal",
    q: "Where do you deliver across Nepal?",
    a: "We provide direct, dedicated doorstep delivery across the entire Kathmandu Valley (Kathmandu, Lalitpur, and Bhaktapur). Orders outside the valley are securely packed with reinforced bubble casing and dispatched via express domestic courier.",
  },
  {
    category: "Delivery in Nepal",
    q: "What is your delivery fee?",
    a: "Delivery inside Kathmandu Valley is FREE for all orders above Rs. 3,500. For orders below this threshold, a flat delivery fee of Rs. 150 applies.",
  },
  {
    category: "Ordering",
    q: "How do I place an order?",
    a: "Choose a keepsake from our collections and tap Order via WhatsApp. We will confirm availability, delivery timing, and payment details with you directly before finalizing the order.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-12 md:py-20">
      <Container size="md">
        {/* Header */}
        <div className="mb-12 space-y-3 text-center">
          <Badge variant="sage">Frequently Asked Questions</Badge>
          <Heading as="h1" size="2xl" className="font-serif">
            Care, Delivery &amp; Custom Keepsakes
          </Heading>
          <Text size="base" variant="muted" className="mx-auto max-w-md">
            Everything you need to know about preserving memories with Petal Craft Florals in
            Kathmandu.
          </Text>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-3xl border border-brand-beige-300 bg-white shadow-card transition-shadow hover:shadow-elevated"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="space-y-1 pr-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-sage-800">
                    {faq.category}
                  </span>
                  <h3 className="font-serif text-base font-semibold text-brand-brown">{faq.q}</h3>
                </div>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cream-200 text-brand-brown transition-transform ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              {openIndex === idx && (
                <div className="border-t border-brand-beige-200 bg-brand-cream-50/50 p-6 pt-4 text-xs leading-relaxed text-brand-brown-700">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Banner */}
        <div className="mt-16 space-y-4 rounded-3xl border border-brand-pink-300 bg-brand-pink-50/60 p-8 text-center">
          <HelpCircle className="mx-auto h-8 w-8 text-brand-pink-600" />
          <Heading as="h3" size="md" className="font-serif">
            Have a custom request or specific question?
          </Heading>
          <Text size="xs" variant="muted" className="mx-auto max-w-sm">
            Our team in Kathmandu is happy to assist with special milestone inquiries or corporate
            bulk orders.
          </Text>
          <div className="pt-2">
            <Link href="/contact">
              <Button variant="primary" size="md" className="gap-2">
                <span>Contact Our Studio</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
