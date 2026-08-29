import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "full" | "circular" | "monogram" | "horizontal" | "icon";
  size?: "sm" | "md" | "lg" | "xl";
  asLink?: boolean;
}

export function Logo({
  variant = "horizontal",
  size = "md",
  asLink = true,
  className,
  ...props
}: LogoProps) {
  const content = (
    <div
      className={cn(
        "inline-flex items-center select-none text-brand-brown transition-opacity hover:opacity-90",
        className
      )}
      {...props}
    >
      {variant === "monogram" && (
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full border border-brand-sage/40 bg-brand-cream/80 font-serif font-semibold italic text-brand-brown shadow-subtle",
            size === "sm" && "h-8 w-8 text-xs",
            size === "md" && "h-10 w-10 text-sm",
            size === "lg" && "h-14 w-14 text-lg",
            size === "xl" && "h-20 w-20 text-2xl"
          )}
        >
          <span>PC</span>
          <span className="absolute -bottom-0.5 text-[8px] text-brand-pink-500">♥</span>
        </div>
      )}

      {variant === "icon" && (
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "text-brand-brown",
            size === "sm" && "h-7 w-7",
            size === "md" && "h-9 w-9",
            size === "lg" && "h-12 w-12",
            size === "xl" && "h-16 w-16"
          )}
        >
          {/* Subtle Botanical Circle */}
          <circle cx="20" cy="20" r="18" stroke="#A7B89F" strokeWidth="1" strokeDasharray="2 2" />
          <path
            d="M20 6C17 11 11 16 11 20C11 25 15 29 20 29C25 29 29 25 29 20C29 16 23 11 20 6Z"
            fill="#E8B8B8"
            fillOpacity="0.45"
          />
          <path
            d="M20 12C20 18 15 22 15 25C18 25 22 23 23 20"
            stroke="#7A5B4F"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <text
            x="20"
            y="23"
            textAnchor="middle"
            fontFamily="serif"
            fontSize="10"
            fontWeight="bold"
            fill="#7A5B4F"
          >
            PC
          </text>
        </svg>
      )}

      {variant === "circular" && (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-full border border-brand-sage/30 bg-brand-cream/60 p-4 text-center shadow-card",
            size === "sm" && "h-24 w-24 p-2",
            size === "md" && "h-32 w-32",
            size === "lg" && "h-44 w-44",
            size === "xl" && "h-56 w-56"
          )}
        >
          {/* Decorative botanical ring */}
          <svg className="absolute inset-0 h-full w-full animate-spin-slow" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#A7B89F"
              strokeWidth="0.8"
              strokeDasharray="4 3"
            />
          </svg>
          <span className="font-serif text-lg font-bold tracking-widest text-brand-brown">PC</span>
          <div className="my-0.5 h-[1px] w-6 bg-brand-pink" />
          <span className="font-serif text-[10px] tracking-wider uppercase text-brand-brown/90">
            Petal Craft
          </span>
          <span className="text-[7px] tracking-widest text-brand-sage-600 uppercase">Florals</span>
          <span className="mt-1 text-[8px] text-brand-pink-500">♥</span>
        </div>
      )}

      {variant === "horizontal" && (
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-sage/40 bg-brand-cream/90 text-brand-brown shadow-subtle">
            <span className="font-serif text-sm font-semibold tracking-wider">PC</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold tracking-wide text-brand-brown leading-tight">
              Petal Craft
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase text-brand-sage-700">
              Florals • Kathmandu
            </span>
          </div>
        </div>
      )}

      {variant === "full" && (
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-brand-sage/40 bg-brand-cream/80 text-brand-brown shadow-card">
            <span className="font-serif text-xl font-bold tracking-wider">PC</span>
          </div>
          <span className="font-serif text-2xl font-semibold tracking-wide text-brand-brown">
            Petal Craft Florals
          </span>
          <span className="mt-0.5 text-xs italic text-brand-brown/80 font-serif">
            &ldquo;More than just flowers... it&apos;s a feeling.&rdquo;
          </span>
          <span className="mt-1 text-[10px] tracking-widest uppercase text-brand-sage-700">
            Handmade in Kathmandu, Nepal
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" aria-label="Petal Craft Florals Home">
        {content}
      </Link>
    );
  }

  return content;
}
