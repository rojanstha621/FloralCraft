import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-2xl border border-brand-beige-400/60 bg-white/70 px-4 py-2 text-sm text-brand-brown placeholder:text-brand-brown-400/60 focus-visible:outline-none focus-visible:border-brand-sage focus-visible:ring-2 focus-visible:ring-brand-sage/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm",
            error && "border-red-400 focus-visible:ring-red-200",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
