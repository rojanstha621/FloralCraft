import React from "react";
import { cn } from "@/lib/utils";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  variant?: "default" | "muted" | "subtle" | "brand";
  as?: "p" | "span" | "div";
}

export function Text({
  as: Component = "p",
  size = "base",
  variant = "default",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(
        "leading-relaxed",
        size === "xs" && "text-xs",
        size === "sm" && "text-sm",
        size === "base" && "text-base",
        size === "lg" && "text-lg",
        size === "xl" && "text-xl",
        variant === "default" && "text-brand-brown/90",
        variant === "muted" && "text-brand-brown-500",
        variant === "subtle" && "text-brand-brown-400",
        variant === "brand" && "text-brand-brown",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
