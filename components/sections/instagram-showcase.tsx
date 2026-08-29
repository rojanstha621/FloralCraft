import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Instagram } from "lucide-react";

export const SOCIAL_POSTS = [
  {
    id: "ig-1",
    imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop",
    caption: "A bespoke anniversary keepsake leaving our Kathmandu studio today ✨ #PetalCraftFlorals",
    handle: "@petalcraftflorals",
  },
  {
    id: "ig-2",
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop",
    caption: "Preserved baby's breath and pastel blush roses 🌸 #KathmanduGifts",
    handle: "@petalcraftflorals",
  },
  {
    id: "ig-3",
    imageUrl: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=600&auto=format&fit=crop",
    caption: "The secret behind our everlasting dried florals... delicate handcrafting. 🌿",
    handle: "@petalcraftflorals",
  },
  {
    id: "ig-4",
    imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=600&auto=format&fit=crop",
    caption: "Wax seals and boutique packaging ready for weekend deliveries in Lalitpur.",
    handle: "@petalcraftflorals",
  },
];

export function InstagramShowcase() {
  return (
    <section className="py-16 bg-brand-cream-50/80">
      <Container size="xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-3">
            <Badge variant="pink" className="gap-1">
              <Instagram className="h-3 w-3 text-brand-pink-600" />
              <span>@petalcraftflorals</span>
            </Badge>
            <Heading as="h2" size="2xl">
              Follow Along Our Studio Journey
            </Heading>
            <Text size="sm" variant="muted" className="max-w-md">
              Discover behind-the-scenes handcrafting reels, custom orders, and new botanical drops on Instagram and TikTok.
            </Text>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-beige-400 bg-white px-5 py-2.5 text-xs font-semibold text-brand-brown hover:bg-brand-pink-50 transition-colors shadow-subtle"
          >
            <Instagram className="h-4 w-4 text-brand-pink-600" />
            <span>Join Our Community</span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOCIAL_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square overflow-hidden rounded-3xl border border-brand-beige-300 bg-brand-cream-200 shadow-card"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover overlay with caption */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-brand-brown-900/85 via-brand-brown-900/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <p className="text-[11px] text-white/95 line-clamp-2">{post.caption}</p>
                <span className="mt-1 text-[9px] font-semibold text-brand-pink-300">{post.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
