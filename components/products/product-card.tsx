import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogProduct } from "@/lib/types/catalog";
import { formatCurrency } from "@/lib/utils";
import { RatingSummary } from "./rating-summary";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const image = [...product.images].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))[0];

  return (
    <article className="product-luxe-card group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-[#fffdf9] shadow-[0_25px_60px_-42px_rgba(61,39,30,.65)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_35px_70px_-38px_rgba(61,39,30,.55)]">
      <Link
        href={`/products/${product.slug}`}
        className="relative m-2 aspect-[4/5] overflow-hidden rounded-[1.55rem] bg-brand-cream-100"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-brown-400">
            Image coming soon
          </div>
        )}
        {!product.available && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-brand-brown">
            Made to order
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 px-6 pb-6 pt-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-sage-800">
          {product.category.name}
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="font-serif text-2xl font-semibold leading-tight text-brand-brown-900 hover:text-brand-brown-600"
        >
          {product.name}
        </Link>
        <p className="line-clamp-2 text-xs leading-relaxed text-brand-brown-500">
          {product.tagline || product.description}
        </p>
        <RatingSummary
          rating={product.averageRating}
          count={product.reviewCount}
          className="mt-1"
        />
        <div className="mt-auto flex items-end justify-between border-t border-brand-beige-200/70 pt-4">
          <div>
            <span className="block text-[10px] text-brand-brown-400">From</span>
            <span className="font-serif text-lg font-bold text-brand-brown">
              {formatCurrency(product.price)}
            </span>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex min-h-11 items-center gap-1 rounded-full border border-brand-brown/10 bg-brand-cream-100 px-4 text-xs font-semibold text-brand-brown transition hover:bg-brand-brown hover:text-white"
          >
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
