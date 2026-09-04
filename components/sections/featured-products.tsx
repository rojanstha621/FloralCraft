"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/product-card";
import { CatalogProduct } from "@/lib/types/catalog";

export function FeaturedProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (data.success)
          setProducts(
            [...data.products]
              .sort(
                (a: CatalogProduct, b: CatalogProduct) =>
                  +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0)
              )
              .slice(0, 6)
          );
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    <section id="featured" className="home-collection relative bg-[#f3ece3] py-24 sm:py-28">
      <Container size="xl">
        <div className="collection-heading mb-14 grid gap-7 border-b border-brand-brown/15 pb-9 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-4" data-reveal="up">
            <Badge variant="pink" className="home-eyebrow">
              The atelier collection
            </Badge>
            <Heading as="h2" size="2xl" className="max-w-2xl text-brand-brown-900">
              Flowers, made into something to keep.
            </Heading>
            <Text size="sm" variant="muted" className="max-w-2xl">
              Petal Craft takes many forms: hand-tied bouquets, floral bottles and pots, shadow
              boxes, pressed-flower frames, keepsakes, baskets, and one-of-one pieces created for a
              particular person or occasion.
            </Text>
            <p className="collection-materials">
              Preserved botanicals · handmade paper · glass · natural wood · ribbon
            </p>
          </div>
          <Link
            href="/collections"
            data-reveal="up"
            className="editorial-link inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-brown"
          >
            View all collections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="home-product-grid grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-9">
            {products.map((product, index) => (
              <div
                key={product.id}
                data-reveal="up"
                data-visible="true"
                className={`h-full reveal-delay-${(index % 3) + 1}`}
              >
                <ProductCard product={product} interactiveGallery editorialIndex={index + 1} />
              </div>
            ))}
          </div>
        ) : (
          <div className="collection-loading" aria-live="polite">
            <span>The studio collection is being arranged.</span>
          </div>
        )}
      </Container>
    </section>
  );
}
