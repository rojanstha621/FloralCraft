import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";
import { CatalogProduct } from "@/lib/types/catalog";
import { cn, formatCurrency } from "@/lib/utils";
import { RatingSummary } from "./rating-summary";

export function ProductCard({
  product,
  interactiveGallery = false,
  editorialIndex,
  variant = "default",
}: {
  product: CatalogProduct;
  interactiveGallery?: boolean;
  editorialIndex?: number;
  variant?: "default" | "catalog";
}) {
  const images = [...product.images].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const image = images[0];
  const secondaryImage = interactiveGallery ? images[1] : undefined;

  return (
    <article
      className={cn(
        "product-luxe-card group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-[#fffdf9] shadow-[0_25px_60px_-42px_rgba(61,39,30,.65)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_35px_70px_-38px_rgba(61,39,30,.55)]",
        variant === "catalog" && "catalog-product-card"
      )}
      data-product-kind={product.productType.slug}
    >
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "product-photograph relative m-2 aspect-[4/5] overflow-hidden rounded-[1.55rem] bg-brand-cream-100",
          variant === "catalog" && "catalog-product-photo"
        )}
      >
        {editorialIndex && (
          <span className="product-edition absolute left-3 top-3 z-[3] text-[9px] font-semibold uppercase tracking-[.2em] text-brand-brown-700">
            Object {String(editorialIndex).padStart(2, "0")}
          </span>
        )}
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <>
            {variant === "catalog" ? (
              <div className="product-image-fallback flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-sm text-brand-brown-400">
                <Flower2 className="h-7 w-7 text-brand-sage-600" aria-hidden="true" />
                <span>Photography being prepared</span>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-brand-brown-400">
                Image coming soon
              </div>
            )}
          </>
        )}
        {secondaryImage && (
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.alt || `${product.name}, alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="product-secondary-image object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 px-6 pb-6 pt-4">
        <div className="flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-[0.18em]">
          <span className="text-brand-sage-800">{product.productType.name}</span>
          <span className="font-medium text-brand-brown-400">
            {variant === "catalog" ? (
              <>
                {product.available ? "Available" : "Made to order"}
                {product.customizable && " · Customisable"}
              </>
            ) : product.customizable ? (
              "Customisable"
            ) : product.available ? (
              "Studio piece"
            ) : (
              "Made to order"
            )}
          </span>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="font-serif text-2xl font-semibold leading-tight text-brand-brown-900 hover:text-brand-brown-600"
        >
          {product.name}
        </Link>
        <p className="line-clamp-2 text-xs leading-relaxed text-brand-brown-500">
          {product.tagline || product.description}
        </p>
        {product.reviewCount > 0 ? (
          <RatingSummary
            rating={product.averageRating}
            count={product.reviewCount}
            className="mt-1"
          />
        ) : (
          <span className="mt-1 text-[10px] italic text-brand-brown-400">New studio work</span>
        )}
        <div className="mt-auto flex items-end justify-between border-t border-brand-beige-200/70 pt-4">
          <div>
            <span className="block text-[10px] text-brand-brown-400">
              {product.customizable ? "Made from" : "From"}
            </span>
            <span className="font-serif text-lg font-bold text-brand-brown">
              {formatCurrency(product.price)}
            </span>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex min-h-11 items-center gap-1 rounded-full border border-brand-brown/10 bg-brand-cream-100 px-4 text-xs font-semibold text-brand-brown transition hover:bg-brand-brown hover:text-white"
          >
            {variant === "catalog" ? "View details" : "View piece"}{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
