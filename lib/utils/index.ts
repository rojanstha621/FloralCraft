import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for conditionally merging Tailwind CSS classes cleanly.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numerical price to Nepalese Rupee representation (e.g., Rs. 1,999)
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("en-NP", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rs. ${formatted}`;
}

/**
 * Formats a Date object or ISO string into a human-readable format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/**
 * Generates a clean URL slug from a title string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
