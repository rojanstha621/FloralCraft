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
        "font-serif tracking-tight text-brand-brown font-normal",
        italic && "italic",
        size === "hero" && "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08]",
        size === "2xl" && "text-3xl sm:text-4xl md:text-5xl leading-tight",
        size === "xl" && "text-2xl sm:text-3xl md:text-4xl leading-snug",
        size === "lg" && "text-xl sm:text-2xl md:text-3xl leading-snug",
        size === "md" && "text-lg sm:text-xl md:text-2xl leading-normal",
        size === "sm" && "text-base sm:text-lg font-medium",
        size === "xs" && "text-sm font-medium tracking-wide uppercase",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
