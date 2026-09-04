"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Flower2 } from "lucide-react";
import { CatalogImage } from "@/lib/types/catalog";
import { cn } from "@/lib/utils";
import { isRenderableImageUrl } from "@/lib/media/image-url";

export function ProductGallery({ images, name }: { images: CatalogImage[]; name: string }) {
  const sorted = [...images].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const [selected, setSelected] = useState(0);
  const touchStart = useRef<number | null>(null);
  const active = sorted[selected];
  const hasMultiple = sorted.length > 1;

  const selectPrevious = () => {
    if (!hasMultiple) return;
    setSelected((current) => (current === 0 ? sorted.length - 1 : current - 1));
  };

  const selectNext = () => {
    if (!hasMultiple) return;
    setSelected((current) => (current === sorted.length - 1 ? 0 : current + 1));
  };

  return (
    <figure className="product-gallery">
      <div
        className="product-gallery-stage"
        role="group"
        aria-roledescription={hasMultiple ? "carousel" : undefined}
        aria-label={`${name} product photography`}
        tabIndex={hasMultiple ? 0 : -1}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") selectPrevious();
          if (event.key === "ArrowRight") selectNext();
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const end = event.changedTouches[0]?.clientX ?? touchStart.current;
          const distance = end - touchStart.current;
          if (Math.abs(distance) > 45) {
            if (distance > 0) selectPrevious();
            else selectNext();
          }
          touchStart.current = null;
        }}
      >
        {active ? (
          isRenderableImageUrl(active.url) ? (
            <Image
              key={active.id || active.url}
              src={active.url}
              alt={active.alt?.trim() || `${name}, studio photograph ${selected + 1}`}
              fill
              priority={selected === 0}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="product-gallery-image object-cover"
              draggable={false}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-brand-brown-400">
              Image unavailable
            </div>
          )
        ) : (
          <div className="product-gallery-fallback">
            <Flower2 aria-hidden="true" />
            <span>Photography for this piece is being prepared.</span>
          </div>
        )}

        <div className="product-gallery-frame" aria-hidden="true" />

        {hasMultiple && (
          <div className="product-gallery-arrows">
            <button type="button" onClick={selectPrevious} aria-label="View previous photograph">
              <ArrowLeft />
            </button>
            <button type="button" onClick={selectNext} aria-label="View next photograph">
              <ArrowRight />
            </button>
          </div>
        )}
      </div>

      <figcaption className="product-gallery-caption">
        <span>Studio view</span>
        <span>
          {sorted.length
            ? `${String(selected + 1).padStart(2, "0")} / ${String(sorted.length).padStart(2, "0")}`
            : "Image forthcoming"}
        </span>
      </figcaption>

      {hasMultiple && (
        <div className="product-gallery-thumbnails" role="tablist" aria-label="Choose a photograph">
          {sorted.map((image, index) => (
            <button
              key={image.id || image.url}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-label={`View ${name} photograph ${index + 1} of ${sorted.length}`}
              onClick={() => setSelected(index)}
              className={cn(selected === index && "is-active")}
            >
              {isRenderableImageUrl(image.url) ? (
                <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
              ) : (
                <span className="text-xs">Unavailable</span>
              )}
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      )}

      {hasMultiple && (
        <span className="sr-only" aria-live="polite">
          Showing photograph {selected + 1} of {sorted.length}
        </span>
      )}
    </figure>
  );
}
