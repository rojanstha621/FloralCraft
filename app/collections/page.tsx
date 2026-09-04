"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Flower2,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ProductCard } from "@/components/products/product-card";
import { CatalogCategory, CatalogProduct, CatalogProductType } from "@/lib/types/catalog";
import { cn } from "@/lib/utils";

type AvailabilityFilter = "all" | "available" | "made-to-order";

const PRODUCT_FORMS = [
  "Bouquets",
  "Bottles",
  "Pots",
  "Frames",
  "Shadow boxes",
  "Keepsakes",
  "Custom work",
];

function FilterChoice({
  active,
  children,
  count,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn("catalog-filter-choice", active && "is-active")}
    >
      <span className="catalog-filter-mark" aria-hidden="true" />
      <span>{children}</span>
      {count !== undefined && <span className="ml-auto text-[10px] opacity-55">{count}</span>}
    </button>
  );
}

function FilterPanel({
  categories,
  productTypes,
  products,
  category,
  productType,
  availability,
  customizableOnly,
  activeCount,
  onCategoryChange,
  onProductTypeChange,
  onAvailabilityChange,
  onCustomizableChange,
  onReset,
}: {
  categories: CatalogCategory[];
  productTypes: CatalogProductType[];
  products: CatalogProduct[];
  category: string;
  productType: string;
  availability: AvailabilityFilter;
  customizableOnly: boolean;
  activeCount: number;
  onCategoryChange: (value: string) => void;
  onProductTypeChange: (value: string) => void;
  onAvailabilityChange: (value: AvailabilityFilter) => void;
  onCustomizableChange: (value: boolean) => void;
  onReset: () => void;
}) {
  const countBy = (predicate: (product: CatalogProduct) => boolean) =>
    products.filter(predicate).length;

  return (
    <div className="catalog-filter-panel">
      <div className="flex items-center justify-between border-b border-brand-brown/15 pb-4">
        <p className="font-serif text-xl font-semibold text-brand-brown-900">
          Refine the collection
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-10 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-brand-brown-500 underline decoration-brand-brown/25 underline-offset-4"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      <fieldset className="catalog-filter-group">
        <legend>Collection</legend>
        <FilterChoice
          active={category === "all"}
          count={products.length}
          onClick={() => onCategoryChange("all")}
        >
          All collections
        </FilterChoice>
        {categories.map((item) => (
          <FilterChoice
            key={item.id}
            active={category === item.slug}
            count={countBy((product) => product.category.slug === item.slug)}
            onClick={() => onCategoryChange(item.slug)}
          >
            {item.name}
          </FilterChoice>
        ))}
      </fieldset>

      <fieldset className="catalog-filter-group">
        <legend>Floral form</legend>
        <FilterChoice active={productType === "all"} onClick={() => onProductTypeChange("all")}>
          Every form
        </FilterChoice>
        {productTypes.map((item) => (
          <FilterChoice
            key={item.id}
            active={productType === item.slug}
            count={countBy((product) => product.productType.slug === item.slug)}
            onClick={() => onProductTypeChange(item.slug)}
          >
            {item.name}
          </FilterChoice>
        ))}
      </fieldset>

      <fieldset className="catalog-filter-group">
        <legend>Availability</legend>
        <FilterChoice active={availability === "all"} onClick={() => onAvailabilityChange("all")}>
          All pieces
        </FilterChoice>
        <FilterChoice
          active={availability === "available"}
          count={countBy((product) => product.available)}
          onClick={() => onAvailabilityChange("available")}
        >
          Available now
        </FilterChoice>
        <FilterChoice
          active={availability === "made-to-order"}
          count={countBy((product) => !product.available)}
          onClick={() => onAvailabilityChange("made-to-order")}
        >
          Made to order
        </FilterChoice>
      </fieldset>

      <fieldset className="catalog-filter-group">
        <legend>Personalisation</legend>
        <FilterChoice
          active={customizableOnly}
          count={countBy((product) => product.customizable)}
          onClick={() => onCustomizableChange(!customizableOnly)}
        >
          Customisable pieces
        </FilterChoice>
      </fieldset>
    </div>
  );
}

function CatalogLoading() {
  return (
    <div
      className="catalog-product-grid grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Loading products"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="catalog-skeleton" aria-hidden="true">
          <div className="catalog-skeleton-image" />
          <div className="space-y-3 p-5">
            <span className="block h-2 w-20 bg-brand-beige-300/60" />
            <span className="block h-7 w-3/4 bg-brand-beige-300/55" />
            <span className="block h-3 w-full bg-brand-beige-300/45" />
            <span className="block h-3 w-2/3 bg-brand-beige-300/45" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CollectionsPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterDrawerRef = useRef<HTMLElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    if (requestedCategory) setCategory(requestedCategory);

    async function loadCatalog() {
      setLoading(true);
      setError(null);
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetch("/api/products", { signal: controller.signal }),
          fetch("/api/categories", { signal: controller.signal }),
        ]);
        const [productData, categoryData] = await Promise.all([
          productResponse.json(),
          categoryResponse.json(),
        ]);

        if (!productResponse.ok || !productData.success) {
          throw new Error(productData.message || "The collection could not be loaded.");
        }

        setProducts(productData.products);
        if (categoryResponse.ok && categoryData.success) setCategories(categoryData.categories);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "The collection is temporarily unavailable."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadCatalog();
    return () => controller.abort();
  }, [reloadToken]);

  useEffect(() => {
    if (!filtersOpen) return;
    const originalOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => filterCloseRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFiltersOpen(false);
        filterTriggerRef.current?.focus();
      }
      if (event.key === "Tab" && filterDrawerRef.current) {
        const focusable = Array.from(
          filterDrawerRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
          )
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [filtersOpen]);

  const productTypes = useMemo(() => {
    const types = new Map<string, CatalogProductType>();
    products.forEach((product) => types.set(product.productType.slug, product.productType));
    return Array.from(types.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          `${product.name} ${product.tagline || ""} ${product.description} ${product.category.name} ${product.productType.name}`
            .toLowerCase()
            .includes(term);
        const matchesCategory = category === "all" || product.category.slug === category;
        const matchesProductType =
          productType === "all" || product.productType.slug === productType;
        const matchesAvailability =
          availability === "all" ||
          (availability === "available" ? product.available : !product.available);
        const matchesCustomization = !customizableOnly || product.customizable;
        return (
          matchesSearch &&
          matchesCategory &&
          matchesProductType &&
          matchesAvailability &&
          matchesCustomization
        );
      }),
    [products, category, productType, availability, customizableOnly, search]
  );

  const activeCount =
    Number(category !== "all") +
    Number(productType !== "all") +
    Number(availability !== "all") +
    Number(customizableOnly);
  const hasDiscoveryQuery = activeCount > 0 || search.trim().length > 0;

  const resetFilters = () => {
    setCategory("all");
    setProductType("all");
    setAvailability("all");
    setCustomizableOnly(false);
    setSearch("");
  };

  const filterPanelProps = {
    categories,
    productTypes,
    products,
    category,
    productType,
    availability,
    customizableOnly,
    activeCount,
    onCategoryChange: setCategory,
    onProductTypeChange: setProductType,
    onAvailabilityChange: setAvailability,
    onCustomizableChange: setCustomizableOnly,
    onReset: resetFilters,
  };

  return (
    <main className="catalog-page">
      <section className="catalog-intro">
        <Container size="xl">
          <div className="catalog-intro-grid">
            <div>
              <p className="catalog-kicker">The Petal Craft atelier</p>
              <Heading as="h1" size="2xl" className="catalog-title">
                Flowers, in every form they can be remembered.
              </Heading>
            </div>
            <div className="catalog-intro-copy">
              <Text size="base" variant="muted">
                Discover floral objects made slowly in Kathmandu—from gestures for today to
                keepsakes designed to hold a memory for years.
              </Text>
              <p className="catalog-form-list">
                {PRODUCT_FORMS.map((form) => (
                  <span key={form}>{form}</span>
                ))}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="catalog-discovery">
        <Container size="xl">
          <div className="catalog-toolbar">
            <div className="catalog-search">
              <Search aria-hidden="true" />
              <label htmlFor="catalog-search" className="sr-only">
                Search the collection
              </label>
              <input
                id="catalog-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search the collection"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              ref={filterTriggerRef}
              type="button"
              className="catalog-mobile-filter"
              onClick={() => setFiltersOpen(true)}
              aria-expanded={filtersOpen}
              aria-controls="catalog-filter-drawer"
              disabled={loading}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && <span>{activeCount}</span>}
            </button>

            <p className="catalog-result-count" aria-live="polite">
              {loading
                ? "Gathering the collection"
                : `${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"}`}
            </p>
          </div>

          <div className="catalog-layout">
            <aside className="catalog-desktop-filters" aria-label="Product filters">
              {loading ? (
                <div className="catalog-filter-pending" aria-hidden="true">
                  <p>Refine the collection</p>
                  <span>Filter options will appear with the collection.</span>
                </div>
              ) : (
                <FilterPanel {...filterPanelProps} />
              )}
            </aside>

            <div className="min-w-0">
              {hasDiscoveryQuery && !loading && !error && (
                <div className="catalog-active-summary">
                  <span>
                    Showing {visibleProducts.length} of {products.length} pieces
                  </span>
                  <button type="button" onClick={resetFilters}>
                    Clear search and filters
                  </button>
                </div>
              )}

              {loading ? (
                <CatalogLoading />
              ) : error ? (
                <div className="catalog-state" role="alert">
                  <AlertCircle className="h-7 w-7 text-brand-pink-700" />
                  <Heading as="h2" size="md">
                    The collection is resting for a moment.
                  </Heading>
                  <Text size="sm" variant="muted">
                    {error} Please try again shortly.
                  </Text>
                  <button type="button" onClick={() => setReloadToken((value) => value + 1)}>
                    Try again <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="catalog-state">
                  <Flower2 className="h-7 w-7 text-brand-sage-700" />
                  <Heading as="h2" size="md">
                    New work is taking shape.
                  </Heading>
                  <Text size="sm" variant="muted">
                    The atelier has no published pieces just now. Please return soon or ask us about
                    a custom creation.
                  </Text>
                </div>
              ) : visibleProducts.length > 0 ? (
                <div className="catalog-product-grid grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      interactiveGallery
                      editorialIndex={index + 1}
                      variant="catalog"
                    />
                  ))}
                </div>
              ) : (
                <div className="catalog-state">
                  <Search className="h-7 w-7 text-brand-sage-700" />
                  <Heading as="h2" size="md">
                    No piece matches that combination.
                  </Heading>
                  <Text size="sm" variant="muted">
                    Try a broader search, another floral form, or return to the full collection.
                  </Text>
                  <button type="button" onClick={resetFilters}>
                    View the full collection <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <div
        className={cn("catalog-filter-overlay", filtersOpen && "is-open")}
        aria-hidden="true"
        onClick={() => {
          setFiltersOpen(false);
          filterTriggerRef.current?.focus();
        }}
      />
      <aside
        ref={filterDrawerRef}
        id="catalog-filter-drawer"
        className={cn("catalog-filter-drawer", filtersOpen && "is-open")}
        role="dialog"
        aria-modal="true"
        aria-label="Filter the collection"
        aria-hidden={!filtersOpen}
        inert={!filtersOpen}
      >
        <div className="catalog-drawer-header">
          <div>
            <span>Petal Craft collection</span>
            <strong>Filters</strong>
          </div>
          <button
            ref={filterCloseRef}
            type="button"
            onClick={() => {
              setFiltersOpen(false);
              filterTriggerRef.current?.focus();
            }}
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="catalog-drawer-content">
          <FilterPanel {...filterPanelProps} />
        </div>
        <div className="catalog-drawer-footer">
          <button
            type="button"
            onClick={() => {
              setFiltersOpen(false);
              filterTriggerRef.current?.focus();
            }}
          >
            Show {visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}
          </button>
        </div>
      </aside>
    </main>
  );
}
