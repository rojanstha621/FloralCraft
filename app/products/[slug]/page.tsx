"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/data/products";
import { useCart } from "@/lib/store/cart-context";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Clock,
  Ruler,
  Layers,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = PRODUCTS.find((p) => p.slug === slug);

  const { addToCart } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="py-10 md:py-16">
      <Container size="xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex items-center space-x-2 text-xs text-brand-brown-400">
          <Link href="/" className="hover:text-brand-brown transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-brown transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.categorySlug}`}
            className="hover:text-brand-brown transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-brand-brown font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left: Product Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-brand-beige-300 bg-brand-cream-100 shadow-card">
              <Image
                src={product.images[selectedImageIndex]?.url || product.images[0]?.url || ""}
                alt={product.images[selectedImageIndex]?.altText || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />

              {product.isCustomizable && (
                <div className="absolute top-4 left-4">
                  <Badge variant="sage" className="shadow-subtle gap-1 bg-white/90 backdrop-blur-xs">
                    <Sparkles className="h-3 w-3 text-brand-sage-800" />
                    <span>Customizable with Your Photo &amp; Words</span>
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.url}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-brand-brown shadow-subtle scale-95"
                        : "border-brand-beige-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-brand-sage-800">
                {product.category}
              </span>

              <Heading as="h1" size="xl" className="font-serif">
                {product.name}
              </Heading>

              <Text size="sm" variant="muted">
                {product.tagline}
              </Text>
            </div>

            {/* Price & Nepal Trust Badge */}
            <div className="flex items-baseline justify-between border-y border-brand-beige-200 py-4">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-brand-brown">
                  {formatCurrency(product.basePrice)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-brand-brown-400 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-brand-sage-800 font-medium">
                <Heart className="h-3.5 w-3.5 fill-brand-pink text-brand-pink" />
                <span>Handmade in Kathmandu</span>
              </div>
            </div>

            {/* Quick Specs Pill Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs text-brand-brown-700">
              <div className="flex items-center gap-2 rounded-2xl border border-brand-beige-300 bg-white/70 p-3">
                <Ruler className="h-4 w-4 text-brand-sage-700 shrink-0" />
                <span className="truncate">{product.dimensions}</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-brand-beige-300 bg-white/70 p-3">
                <Clock className="h-4 w-4 text-brand-pink-600 shrink-0" />
                <span>{product.prepTimeDays} Business Days Prep</span>
              </div>
            </div>

            {/* Actions: Customize or Add to Cart */}
            <div className="space-y-4 pt-2">
              {product.isCustomizable ? (
                <div className="space-y-3">
                  <Link href={`/customize?product=${product.slug}`} className="block">
                    <Button variant="primary" size="lg" className="w-full gap-2 shadow-card hover:shadow-elevated">
                      <Sparkles className="h-4 w-4 text-brand-pink-300" />
                      <span>Customize Photo &amp; Message</span>
                    </Button>
                  </Link>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-brand-beige-300 bg-white px-3 py-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 text-brand-brown hover:opacity-75"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 text-brand-brown hover:opacity-75"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add Ready-Made</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-brand-beige-300 bg-white px-3 py-1.5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-brand-brown hover:opacity-75"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-brand-brown hover:opacity-75"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Shopping Bag</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Accordion Information */}
            <div className="space-y-3 pt-4 border-t border-brand-beige-200">
              {/* Description & Story */}
              <div className="rounded-2xl border border-brand-beige-300 bg-white/70 overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "details" ? null : "details")}
                  className="flex w-full items-center justify-between p-4 text-xs font-semibold text-brand-brown"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-brand-sage-700" />
                    <span>Story &amp; Materials</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      activeAccordion === "details" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === "details" && (
                  <div className="p-4 pt-0 space-y-3 text-xs text-brand-brown-600 border-t border-brand-beige-100">
                    <p className="leading-relaxed">{product.description}</p>
                    <div className="p-3 rounded-xl bg-brand-cream-200/60 space-y-1">
                      <span className="font-semibold text-brand-brown">Materials:</span>
                      <p>{product.materials}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery & Packaging */}
              <div className="rounded-2xl border border-brand-beige-300 bg-white/70 overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "delivery" ? null : "delivery")}
                  className="flex w-full items-center justify-between p-4 text-xs font-semibold text-brand-brown"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-brand-sage-700" />
                    <span>Kathmandu Delivery &amp; Packaging</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      activeAccordion === "delivery" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === "delivery" && (
                  <div className="p-4 pt-0 space-y-2 text-xs text-brand-brown-600 border-t border-brand-beige-100">
                    <p>
                      • <strong>Kathmandu Valley:</strong> Hand-delivered within 2-4 business days. Free for orders above Rs. 3,500.
                    </p>
                    <p>
                      • <strong>Packaging:</strong> Encased in protective bubble insulation and placed inside our rigid gift box with wax stamp seal.
                    </p>
                  </div>
                )}
              </div>

              {/* Preserved Flower Care Guide */}
              <div className="rounded-2xl border border-brand-beige-300 bg-white/70 overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "care" ? null : "care")}
                  className="flex w-full items-center justify-between p-4 text-xs font-semibold text-brand-brown"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-sage-700" />
                    <span>Care Guide (Keepsake Lifespan)</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      activeAccordion === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeAccordion === "care" && (
                  <div className="p-4 pt-0 space-y-2 text-xs text-brand-brown-600 border-t border-brand-beige-100">
                    <p>• <strong>No Water Needed:</strong> Preserved florals do not require hydration.</p>
                    <p>• <strong>Keep Indoors:</strong> Avoid prolonged direct midday sun to maintain petal vibrancy.</p>
                    <p>• <strong>Lifespan:</strong> Designed to look pristine for 2 to 5+ years.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-brand-beige-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge variant="pink">More from this collection</Badge>
                <Heading as="h3" size="lg" className="font-serif mt-1">
                  You Might Also Cherish
                </Heading>
              </div>
              <Link href="/shop" className="text-xs font-semibold text-brand-brown hover:underline">
                View All Gifts
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-brand-beige-300 bg-white p-4 shadow-card hover:shadow-elevated transition-all"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-cream-100 mb-3">
                    <Image
                      src={rel.images[0]?.url || ""}
                      alt={rel.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <Heading as="h4" size="sm" className="font-serif text-brand-brown">
                    {rel.name}
                  </Heading>
                  <span className="font-serif text-sm font-bold text-brand-brown mt-1">
                    {formatCurrency(rel.basePrice)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
