import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-brown text-brand-cream-50",
        sage: "bg-brand-sage-100 text-brand-sage-800 border border-brand-sage-300",
        pink: "bg-brand-pink-100 text-brand-pink-900 border border-brand-pink-300",
        cream: "bg-brand-cream-200 text-brand-brown-800 border border-brand-beige-300",
        outline: "border border-brand-brown-300 text-brand-brown",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
