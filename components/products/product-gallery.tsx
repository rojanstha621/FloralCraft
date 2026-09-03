"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CatalogImage } from "@/lib/types/catalog";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: CatalogImage[]; name: string }) {
  const sorted = [...images].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const [selected, setSelected] = useState(0);
  const active = sorted[selected];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-brand-beige-300 bg-brand-cream-100 shadow-card">
        {active ? (
          <Image
            src={active.url}
            alt={active.alt || name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-brown-400">
            Image coming soon
          </div>
        )}
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sorted.map((image, index) => (
            <button
              key={image.id || image.url}
              onClick={() => setSelected(index)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2",
                selected === index ? "border-brand-brown" : "border-transparent opacity-70"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${name} image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
