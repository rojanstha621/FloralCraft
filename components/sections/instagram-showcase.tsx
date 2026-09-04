"use client";

import Image from "next/image";
import { Instagram, Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_CONTENT } from "@/lib/data/social";
import { useBusinessSettings } from "@/components/providers/business-provider";

export function InstagramShowcase() {
  const business = useBusinessSettings();
  return (
    <section className="home-instagram bg-[#f1e9df] py-24 sm:py-28">
      <Container size="xl">
        <div
          className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"
          data-reveal="up"
        >
          <div className="space-y-3">
            <Badge variant="pink" className="home-eyebrow gap-1">
              <Instagram className="h-3 w-3" /> @petalcraftflorals
            </Badge>
            <Heading as="h2" size="2xl" className="text-brand-brown-900">
              From the studio, with love.
            </Heading>
            <Text size="sm" variant="muted" className="max-w-lg">
              Worktables, petal details, new commissions, and the quiet rituals behind each piece.
            </Text>
          </div>
          <div className="flex gap-3">
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 border-b border-brand-brown/25 text-xs font-semibold"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a
              href={business.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border-b border-brand-brown/25 text-xs font-semibold"
            >
              TikTok
            </a>
          </div>
        </div>
        <div className="mb-7 flex gap-4 overflow-x-auto pb-2 md:hidden">
          {SOCIAL_CONTENT.filter((item) => item.type === "story-link").map((item) => (
            <a
              key={item.id}
              href={business.instagramUrl || item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 shrink-0 text-center"
            >
              <span className="relative mx-auto block h-16 w-16 overflow-hidden rounded-full border-2 border-brand-pink-400 p-0.5">
                <Image
                  src={item.imageUrl}
                  alt=""
                  fill
                  className="rounded-full object-cover p-0.5"
                />
              </span>
              <span className="mt-1 block text-[10px]">{item.title}</span>
            </a>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {SOCIAL_CONTENT.map((item, index) => (
            <a
              key={item.id}
              href={business.instagramUrl || item.href}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal="up"
              className={`social-editorial group relative aspect-[4/5] overflow-hidden border border-white/70 bg-brand-cream-200 shadow-[0_25px_55px_-38px_rgba(61,39,30,.7)] transition duration-500 hover:-translate-y-2 reveal-delay-${(index % 4) + 1}`}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.07]"
              />
              {item.type === "reel" && (
                <span className="absolute right-3 top-3 rounded-full bg-white/85 p-2">
                  <Play className="h-3.5 w-3.5 fill-brand-brown" />
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-brown-900/90 to-transparent p-4 pt-12 text-white">
                <span className="font-serif text-base font-semibold">{item.title}</span>
                <p className="mt-1 hidden text-[11px] text-white/80 sm:line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-5 text-center text-[11px] text-brand-brown-400">
          Curated links to our social profiles; this is not a live Instagram feed.
        </p>
      </Container>
    </section>
  );
}
