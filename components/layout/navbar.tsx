"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useCart } from "@/lib/store/cart-context";

const NAV_LINKS = [
  { href: "/shop", label: "Shop Gifts" },
  { href: "/customize", label: "Customize", highlight: true },
  { href: "/occasions", label: "Occasions" },
  { href: "/about", label: "Our Story" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, openCartDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-beige-300/40 bg-brand-cream/90 backdrop-blur-md transition-all">
      {/* Top Notification Bar */}
      <div className="bg-brand-brown px-4 py-1.5 text-center text-[11px] font-medium tracking-wider text-brand-cream uppercase">
        <span>Handmade with love in Kathmandu, Nepal • Free Valley Delivery over Rs. 3,500</span>
      </div>

      <Container size="xl">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Logo variant="horizontal" size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center space-x-7 md:flex" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors duration-150 hover:text-brand-brown",
                    isActive ? "text-brand-brown font-semibold underline decoration-brand-pink decoration-2 underline-offset-8" : "text-brand-brown/75",
                    link.highlight && "inline-flex items-center gap-1 text-brand-brown-600 font-semibold"
                  )}
                >
                  {link.highlight && <Sparkles className="h-3.5 w-3.5 text-brand-pink-500" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Cart + CTA) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={openCartDrawer}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-brand-beige-400/50 bg-white/60 text-brand-brown transition-colors hover:bg-brand-cream-200"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink-500 text-[9px] font-bold text-white shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            <Link href="/customize" className="hidden lg:inline-flex">
              <Button variant="primary" size="sm">
                Create Gift
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-beige-400/50 bg-white/60 text-brand-brown md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-brand-beige-300 bg-brand-cream px-6 py-6 md:hidden animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-medium text-brand-brown py-2 border-b border-brand-beige-200"
              >
                <span>{link.label}</span>
                {link.highlight && <Sparkles className="h-4 w-4 text-brand-pink-500" />}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/customize" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="lg" className="w-full">
                  Create Custom Gift
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
