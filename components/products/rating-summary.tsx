import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingSummary({
  rating,
  count,
  className,
}: {
  rating: number;
  count: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-2 text-xs", className)}
      aria-label={`${rating.toFixed(1)} out of 5 stars from ${count} reviews`}
    >
      <div className="flex items-center gap-0.5 text-amber-500" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn("h-3.5 w-3.5", index < Math.round(rating) && "fill-amber-400")}
          />
        ))}
      </div>
      <span className="font-semibold text-brand-brown">
        {count > 0 ? rating.toFixed(1) : "New"}
      </span>
      <span className="text-brand-brown-400">({count})</span>
    </div>
  );
}
