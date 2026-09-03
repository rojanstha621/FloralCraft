import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";

export function BrandStorySection() {
  return (
    <section className="bg-brand-brown-900 py-24 text-brand-cream sm:py-28">
      <Container size="xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border border-white/15 shadow-[0_40px_90px_-30px_rgba(0,0,0,.55)]">
            <Image
              src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop"
              alt="Floral artisan arranging preserved flowers"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
            />
          </div>
          <div className="space-y-6">
            <Badge variant="sage">Our story</Badge>
            <Heading as="h2" size="2xl" className="text-brand-cream">
              A quiet craft for life&apos;s loudest feelings.
            </Heading>
            <Text size="base" className="max-w-lg text-brand-cream/65">
              Flowers hold emotion in a way words sometimes cannot. In our Kathmandu studio, we
              preserve that feeling through thoughtful botanical pieces made slowly, carefully, and
              by hand.
            </Text>
            <Link
              href="/about"
              className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-brand-cream transition hover:bg-white hover:text-brand-brown-900"
            >
              Meet Petal Craft <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
