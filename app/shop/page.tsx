"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRODUCTS, CATEGORIES, OCCASIONS_LIST } from "@/lib/data/products";
import { useCart } from "@/lib/store/cart-context";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Filter,
  Sparkles,
  Eye,
  ShoppingBag,
  SlidersHorizontal,
  X,
  Check,
} from "lucide-react";

export default function ShopPage() {
  const { addToCart } = useCart();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [customizableOnly, setCustomizableOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.categorySlug !== selectedCategory) {
        return false;
      }
      // Occasion filter
      if (selectedOccasion !== "all" && !product.occasion.includes(selectedOccasion)) {
        return false;
      }
      // Customizable filter
      if (customizableOnly && !product.isCustomizable) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesTagline = product.tagline.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesTagline) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.basePrice - b.basePrice;
      if (sortBy === "price-desc") return b.basePrice - a.basePrice;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      return 0; // featured default
    });
  }, [selectedCategory, selectedOccasion, customizableOnly, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedOccasion("all");
    setCustomizableOnly(false);
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <div className="py-10 md:py-16">
      <Container size="xl">
        {/* Page Header */}
        <div className="text-center space-y-3 mb-10">
          <Badge variant="pink">Handcrafted Catalog</Badge>
          <Heading as="h1" size="2xl" className="font-serif">
            Floral Keepsakes &amp; Gifts
          </Heading>
          <Text size="base" variant="muted" className="max-w-xl mx-auto">
            Browse our curated collections of preserved botanical frames, customizable photo keepsakes, and glass domes crafted in Kathmandu.
          </Text>
        </div>

        {/* Search & Mobile Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-brown-400" />
            <Input
              type="text"
              placeholder="Search keepsakes, flowers, occasions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown-400 hover:text-brand-brown"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="md"
              className="md:hidden flex-1 gap-2"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-brand-brown-500 font-medium whitespace-nowrap">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc" | "newest")}
                className="h-11 rounded-2xl border border-brand-beige-400/60 bg-white px-3.5 py-2 text-xs font-medium text-brand-brown focus-visible:outline-none focus-visible:border-brand-sage"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills (Desktop & Tablet) */}
        <div className="mb-8 hidden md:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? "bg-brand-brown text-brand-cream shadow-subtle"
                  : "bg-white text-brand-brown/80 border border-brand-beige-300 hover:bg-brand-cream-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="rounded-3xl border border-brand-beige-300/80 bg-white/80 p-6 space-y-6 shadow-card">
              <div className="flex items-center justify-between border-b border-brand-beige-200 pb-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-brand-brown" />
                  <h3 className="font-serif font-semibold text-brand-brown text-base">Filters</h3>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-medium text-brand-pink-700 hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Occasions Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-brown-500">
                  Occasion
                </h4>
                <div className="space-y-1.5">
                  {OCCASIONS_LIST.map((occ) => (
                    <button
                      key={occ}
                      onClick={() => setSelectedOccasion(occ)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs transition-colors ${
                        selectedOccasion === occ
                          ? "bg-brand-sage-100 font-semibold text-brand-sage-900"
                          : "text-brand-brown/80 hover:bg-brand-cream-200"
                      }`}
                    >
                      <span className="capitalize">{occ.replace("-", " ")}</span>
                      {selectedOccasion === occ && <Check className="h-3.5 w-3.5 text-brand-sage-700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization Toggle */}
              <div className="pt-2 border-t border-brand-beige-200">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-brand-brown select-none">
                  <input
                    type="checkbox"
                    checked={customizableOnly}
                    onChange={(e) => setCustomizableOnly(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-brown focus:ring-brand-sage"
                  />
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-brand-pink-500" />
                    <span>Customizable Only</span>
                  </div>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Product Grid */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-brand-beige-300 bg-white/70 p-12 text-center space-y-4">
                <Heading as="h3" size="lg" className="font-serif">
                  No gifts match your filter criteria
                </Heading>
                <Text size="sm" variant="muted" className="max-w-md">
                  Try clearing your search query or removing some filters to discover more items.
                </Text>
                <Button variant="primary" size="md" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-beige-300/80 bg-white shadow-card transition-all duration-300 hover:shadow-elevated"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-cream-100">
                      <Image
                        src={product.images[0]?.url || ""}
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

                      {/* Quick Action Overlay */}
                      <div className="absolute inset-0 flex items-end justify-center p-4 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <div className="flex w-full gap-2">
                          <Link href={`/products/${product.slug}`} className="flex-1">
                            <Button variant="soft" size="sm" className="w-full bg-white/95 text-brand-brown hover:bg-white text-xs gap-1.5">
                              <Eye className="h-3.5 w-3.5" />
                              <span>Details</span>
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
                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1 text-xs gap-1.5"
                              onClick={() => addToCart(product, 1)}
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              <span>Add</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Product Card Body */}
                    <div className="flex flex-1 flex-col p-5 space-y-1.5">
                      <span className="text-[10px] font-semibold tracking-wider text-brand-sage-800 uppercase">
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

                      <div className="pt-2 mt-auto flex items-center justify-between border-t border-brand-beige-200">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-base font-bold text-brand-brown">
                            {formatCurrency(product.basePrice)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-xs text-brand-brown-400 line-through">
                              {formatCurrency(product.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-medium text-brand-brown-500">
                          {product.prepTimeDays}d prep
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
