"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/products/product-card";
import { CatalogCategory, CatalogProduct } from "@/lib/types/catalog";
import { cn } from "@/lib/utils";

export default function CollectionsPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    if (requestedCategory) setCategory(requestedCategory);
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ])
      .then(([productData, categoryData]) => {
        if (productData.success) setProducts(productData.products);
        if (categoryData.success) setCategories(categoryData.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = category === "all" || product.category.slug === category;
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          `${product.name} ${product.tagline || ""} ${product.description}`
            .toLowerCase()
            .includes(term);
        return matchesCategory && matchesSearch;
      }),
    [products, category, search]
  );

  return (
    <div className="py-10 md:py-16">
      <Container size="xl">
        <header className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
          <Badge variant="pink">Handmade Collections</Badge>
          <Heading as="h1" size="2xl">
            Find a keepsake for every feeling
          </Heading>
          <Text size="base" variant="muted">
            Browse preserved floral gifts designed for birthdays, anniversaries, gratitude, and the
            moments that deserve to last.
          </Text>
        </header>
        <div className="mb-8 space-y-4">
          <div className="relative mx-auto max-w-lg">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-brown-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search keepsakes..."
              className="h-12 bg-white pl-11"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Filter by collection">
            {[{ slug: "all", name: "All" }, ...categories].map((item) => (
              <button
                key={item.slug}
                onClick={() => setCategory(item.slug)}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border px-4 text-xs font-semibold transition",
                  category === item.slug
                    ? "border-brand-brown bg-brand-brown text-white"
                    : "border-brand-beige-300 bg-white text-brand-brown hover:bg-brand-cream-200"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="py-20 text-center text-sm text-brand-brown-500">
            Gathering our collections...
          </div>
        ) : visibleProducts.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-brand-beige-300 bg-white/70 p-12 text-center">
            <Heading as="h2" size="md">
              No keepsakes found
            </Heading>
            <Text size="sm" variant="muted" className="mt-2">
              Try another collection or search term.
            </Text>
          </div>
        )}
      </Container>
    </div>
  );
}
