import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-2xl border border-brand-beige-400/60 bg-white/70 px-4 py-3 text-sm text-brand-brown placeholder:text-brand-brown-400/60 focus-visible:outline-none focus-visible:border-brand-sage focus-visible:ring-2 focus-visible:ring-brand-sage/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm",
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
Textarea.displayName = "Textarea";

export { Textarea };
