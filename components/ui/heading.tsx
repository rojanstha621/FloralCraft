import React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "hero";
  italic?: boolean;
}

export function Heading({
  as: Component = "h2",
  size = "md",
  italic = false,
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "font-serif font-normal tracking-tight text-brand-brown",
        italic && "italic",
        size === "hero" && "text-4xl leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl",
        size === "2xl" && "text-3xl leading-tight sm:text-4xl md:text-5xl",
        size === "xl" && "text-2xl leading-snug sm:text-3xl md:text-4xl",
        size === "lg" && "text-xl leading-snug sm:text-2xl md:text-3xl",
        size === "md" && "text-lg leading-normal sm:text-xl md:text-2xl",
        size === "sm" && "text-base font-medium sm:text-lg",
        size === "xs" && "text-sm font-medium uppercase tracking-wide",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
