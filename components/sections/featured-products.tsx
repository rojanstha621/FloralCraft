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
            data.products.filter((product: CatalogProduct) => product.featured).slice(0, 6)
          );
      })
      .catch(() => setProducts([]));
  }, []);

  if (!products.length) return null;

  return (
    <section id="featured" className="relative bg-[#f3ece3] py-24 sm:py-28">
      <Container size="xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <Badge variant="pink">Curated Keepsakes</Badge>
            <Heading as="h2" size="2xl" className="max-w-xl text-brand-brown-900">
              Small works of art, made to be felt.
            </Heading>
            <Text size="sm" variant="muted" className="max-w-xl">
              Our signature keepsakes pair real botanicals with your most meaningful moments.
            </Text>
          </div>
          <Link
            href="/collections"
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand-brown"
          >
            View all collections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
