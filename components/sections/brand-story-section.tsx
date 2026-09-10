import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { mediaUrl } from "@/lib/config/media";

export function BrandStorySection() {
  return (
    <section className="home-story bg-brand-brown-900 py-24 text-brand-cream sm:py-28">
      <Container size="xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
          <div
            className="story-image relative aspect-[4/3] overflow-hidden border border-white/15 shadow-[0_40px_90px_-30px_rgba(0,0,0,.55)]"
            data-reveal="left"
            data-parallax="14"
            data-scroll-image
          >
            <Image
              src={mediaUrl("editorial/brand-story.jpg")}
              alt="Hands carefully composing flowers at a wooden worktable"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="story-photo object-cover transition-transform duration-1000 hover:scale-[1.03]"
            />
            <span className="story-image-label absolute bottom-0 left-0 bg-[#f7f0e7] px-4 py-3 text-[9px] font-semibold uppercase tracking-[.2em] text-brand-brown-700">
              The practice of making · by hand
            </span>
          </div>
          <div className="story-copy space-y-6" data-reveal="right">
            <Badge variant="sage" className="home-eyebrow home-eyebrow-dark">
              Our story
            </Badge>
            <Heading as="h2" size="2xl" className="text-brand-cream">
              A quiet craft for life&apos;s loudest feelings.
            </Heading>
            <Text size="base" className="max-w-lg text-brand-cream/70">
              Flowers hold emotion in a way words sometimes cannot. In our Kathmandu studio, each
              piece begins with a person, a photograph, a date, or a few words that deserve to be
              kept close.
            </Text>
            <p className="story-pullquote max-w-lg font-serif text-2xl italic leading-snug text-brand-cream">
              We do not simply arrange flowers. We give a memory a physical form.
            </p>
            <Text size="sm" className="max-w-lg text-brand-cream/60">
              That form might be a bouquet, a frame, a flower-filled bottle, a pot, a basket, or a
              gift box made entirely for the occasion. No two stories arrive the same, so custom
              commissions are always welcome.
            </Text>
            <div className="story-signature border-y border-white/15 py-4 text-[10px] uppercase tracking-[.19em] text-brand-cream/55">
              Composed slowly · finished by hand · made in Kathmandu
            </div>
            <Link
              href="/about"
              className="inline-flex min-h-12 items-center gap-3 border-b border-white/35 text-sm font-semibold text-brand-cream transition hover:border-white"
            >
              Meet Petal Craft <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
