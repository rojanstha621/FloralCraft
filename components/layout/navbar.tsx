"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { createWhatsAppUrl } from "@/lib/config/business";

const NAV_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/order", label: "Order" },
  { href: "/about", label: "Our Story" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-brown/10 bg-[#faf6ef]/80 shadow-[0_10px_40px_rgba(62,39,30,.04)] backdrop-blur-xl transition-all">
      {/* Top Notification Bar */}
      <div className="bg-brand-brown-900 px-4 py-2 text-center text-[9px] font-semibold uppercase tracking-[.22em] text-brand-cream">
        <span>Complimentary message card with every keepsake · Handmade in Kathmandu</span>
      </div>

      <Container size="xl">
        <div className="flex h-[76px] items-center justify-between">
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
                    "relative py-2 text-[13px] font-semibold tracking-wide transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-brand-pink-600 after:transition-transform hover:text-brand-brown hover:after:scale-x-100",
                    isActive ? "text-brand-brown after:scale-x-100" : "text-brand-brown/75"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right conversion action */}
          <div className="flex items-center space-x-3">
            <a
              href={createWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex"
            >
              <Button variant="primary" size="sm" className="gap-2" tabIndex={-1}>
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </Button>
            </a>

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
        <div className="animate-fadeIn border-b border-brand-beige-300 bg-brand-cream px-6 py-6 md:hidden">
          <nav className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-brand-beige-200 py-2 text-base font-medium text-brand-brown"
              >
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="pt-4">
              <a
                href={createWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="primary" size="lg" className="w-full gap-2" tabIndex={-1}>
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
