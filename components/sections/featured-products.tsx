import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, ArrowRight, Eye, ShoppingBag } from "lucide-react";

export interface FeaturedProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  tagline: string;
  isCustomizable: boolean;
}

export const FEATURED_PRODUCTS: FeaturedProductItem[] = [
  {
    id: "prod-1",
    name: "Forever Bloom Botanical Frame",
    slug: "forever-bloom-botanical-frame",
    category: "Forever Bloom",
    price: 2499,
    compareAtPrice: 2899,
    imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
    tagline: "Preserved baby's breath and pastel blush roses in natural teak.",
    isCustomizable: true,
  },
  {
    id: "prod-2",
    name: "Our Story Customized Keepsake",
    slug: "our-story-customized-keepsake",
    category: "Our Story",
    price: 3299,
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop",
    tagline: "Your favorite photo surrounded by dried hydrangeas and custom calligraphy.",
    isCustomizable: true,
  },
  {
    id: "prod-3",
    name: "Dear Mom Preserved Rose Shadowbox",
    slug: "dear-mom-preserved-rose-shadowbox",
    category: "Dear Mom",
    price: 2899,
    imageUrl: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop",
    tagline: "A heartfelt gratitude gift with everlasting dried carnations and roses.",
    isCustomizable: true,
  },
  {
    id: "prod-4",
    name: "With Gratitude Floral Glass Dome",
    slug: "with-gratitude-floral-glass-dome",
    category: "With Gratitude",
    price: 3599,
    compareAtPrice: 3999,
    imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
    tagline: "Enchanted glass bell jar housing dried everlasting wildflowers.",
    isCustomizable: false,
  },
  {
    id: "prod-5",
    name: "Memory Lane Arch Keepsake",
    slug: "memory-lane-arch-keepsake",
    category: "Memory Lane",
    price: 3899,
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop",
    tagline: "Arched wooden frame preserving your special dates, vows, and botanicals.",
    isCustomizable: true,
  },
  {
    id: "prod-6",
    name: "Bespoke Couple Blossom Frame",
    slug: "bespoke-couple-blossom-frame",
    category: "Made For You",
    price: 2999,
    imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800&auto=format&fit=crop",
    tagline: "Tailored to your love story with customizable flower palettes and initials.",
    isCustomizable: true,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-brand-cream-50/60">
      <Container size="xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <Badge variant="pink">Curated Keepsakes</Badge>
            <Heading as="h2" size="2xl">
              Featured Handmade Gifts
            </Heading>
            <Text size="sm" variant="muted" className="max-w-xl">
              Each piece is individually assembled by our artisans in Kathmandu, using everlasting preserved florals that never wilt.
            </Text>
          </div>

          <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-brown hover:text-brand-brown-600 transition-colors">
            <span>View All Collections</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-beige-300/80 bg-white shadow-card transition-all duration-300 hover:shadow-elevated"
            >
              {/* Product Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-cream-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Customization Badge */}
                {product.isCustomizable && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="sage" className="shadow-xs gap-1 bg-white/90 backdrop-blur-xs">
                      <Sparkles className="h-3 w-3 text-brand-sage-700" />
                      <span>Customizable</span>
                    </Badge>
                  </div>
                )}

                {/* Quick Action Overlay (Mobile & Desktop) */}
                <div className="absolute inset-0 flex items-end justify-center p-4 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="flex w-full gap-2">
                    <Link href={`/products/${product.slug}`} className="flex-1">
                      <Button variant="soft" size="sm" className="w-full bg-white/95 text-brand-brown hover:bg-white text-xs gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        <span>Quick View</span>
                      </Button>
                    </Link>
                    {product.isCustomizable ? (
                      <Link href={`/customize?product=${product.slug}`} className="flex-1">
                        <Button variant="primary" size="sm" className="w-full text-xs gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Customize</span>
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/products/${product.slug}`} className="flex-1">
                        <Button variant="primary" size="sm" className="w-full text-xs gap-1.5">
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add to Cart</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col p-6 space-y-2">
                <span className="text-xs font-semibold tracking-wider text-brand-sage-800 uppercase">
                  {product.category}
                </span>

                <Link href={`/products/${product.slug}`}>
                  <Heading as="h3" size="sm" className="font-serif hover:text-brand-brown-600 transition-colors">
                    {product.name}
                  </Heading>
                </Link>

                <Text size="xs" variant="muted" className="line-clamp-2">
                  {product.tagline}
                </Text>

                <div className="pt-2 mt-auto flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg font-bold text-brand-brown">
                      {formatCurrency(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-brand-brown-400 line-through">
                        {formatCurrency(product.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-medium text-brand-brown-500">
                    Handmade in KTM
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
