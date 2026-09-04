import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";
import { CatalogProduct } from "@/lib/types/catalog";
import { cn, formatCurrency } from "@/lib/utils";
import { isRenderableImageUrl } from "@/lib/media/image-url";
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
        "product-luxe-card group flex h-full min-w-0 flex-col overflow-hidden border bg-[#fffdf9] transition duration-500",
        variant === "catalog" && "catalog-product-card"
      )}
      data-product-kind={product.productType.slug}
    >
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "product-photograph relative aspect-[4/5] overflow-hidden bg-brand-cream-100",
          variant === "catalog" && "catalog-product-photo"
        )}
      >
        {editorialIndex && (
          <span className="product-edition absolute left-3 top-3 z-[3] text-[9px] font-semibold uppercase tracking-[.2em] text-brand-brown-700">
            Object {String(editorialIndex).padStart(2, "0")}
          </span>
        )}
        {image && isRenderableImageUrl(image.url) ? (
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
        {secondaryImage && isRenderableImageUrl(secondaryImage.url) && (
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.alt || `${product.name}, alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="product-secondary-image object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
          />
        )}
      </Link>
      <div className="product-card-body flex flex-1 flex-col">
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
          className="product-card-title font-serif font-semibold text-brand-brown-900"
        >
          {product.name}
        </Link>
        <p className="product-card-description line-clamp-2 text-brand-brown-500">
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
        <div className="product-card-footer mt-auto flex items-end justify-between border-t border-brand-beige-200/70">
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
            className="product-card-cta inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-brand-brown"
          >
            {variant === "catalog" ? "View details" : "View piece"}{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
