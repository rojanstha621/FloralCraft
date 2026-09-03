import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OCCASIONS } from "@/components/sections/shop-by-occasion";
import { ArrowRight } from "lucide-react";

export default function OccasionsPage() {
  return (
    <div className="py-12 md:py-20">
      <Container size="xl">
        <div className="mb-14 space-y-3 text-center">
          <Badge variant="pink">Celebrate Milestones</Badge>
          <Heading as="h1" size="2xl" className="font-serif">
            Gifts Tailored by Occasion
          </Heading>
          <Text size="base" variant="muted" className="mx-auto max-w-xl">
            Discover bespoke floral keepsakes curated for birthdays, anniversaries, weddings,
            gratitude, and life’s most cherished celebrations.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((occ) => (
            <div
              key={occ.title}
              className="group flex flex-col overflow-hidden rounded-3xl border border-brand-beige-300 bg-white shadow-card transition-all hover:shadow-elevated"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-cream-100">
                <Image
                  src={occ.imageUrl}
                  alt={occ.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                <div>
                  <Heading as="h3" size="md" className="font-serif text-brand-brown">
                    {occ.title}
                  </Heading>
                  <Text size="xs" variant="muted" className="mt-1">
                    {occ.subtitle}
                  </Text>
                </div>

                <Link href={occ.href} className="mt-auto block">
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                    <span>Explore {occ.title} Gifts</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
