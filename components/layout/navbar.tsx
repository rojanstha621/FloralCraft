"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { createWhatsAppUrl } from "@/lib/config/business";
import { useBusinessSettings } from "@/components/providers/business-provider";

const NAV_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/order", label: "Order" },
  { href: "/about", label: "Our Story" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const business = useBusinessSettings();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-brand-brown/10 transition-[background-color,box-shadow] duration-500",
        isHome
          ? scrolled
            ? "bg-[#faf6ef]/95 shadow-[0_12px_35px_rgba(62,39,30,.07)] backdrop-blur-xl"
            : "bg-[#faf6ef]/95 shadow-none"
          : "bg-[#faf6ef]/80 shadow-[0_10px_40px_rgba(62,39,30,.04)] backdrop-blur-xl"
      )}
    >
      {/* Top Notification Bar */}
      <div
        className={cn(
          "overflow-hidden bg-brand-brown-900 px-4 text-center text-[9px] font-semibold uppercase tracking-[.22em] text-brand-cream transition-[max-height,padding] duration-500",
          isHome && scrolled ? "max-h-0 py-0" : "max-h-10 py-2"
        )}
      >
        <span>Handmade in Kathmandu · Complimentary message card</span>
      </div>

      <Container size="xl">
        <div
          className={cn(
            "flex items-center justify-between transition-[height] duration-500",
            isHome && scrolled ? "h-16" : "h-[76px]"
          )}
        >
          {/* Brand Logo */}
          <div className="flex items-center">
            <Logo variant="horizontal" size="md" imageUrl={business.logoUrl} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Main Navigation">
            {NAV_LINKS.filter(
              (link) => link.href !== "/order" || business.websiteOrderingEnabled
            ).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-3 text-[12px] font-semibold tracking-[.055em] transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-brand-pink-600 after:transition-transform after:duration-300 hover:text-brand-brown hover:after:scale-x-100",
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
            {business.whatsappOrderingEnabled && (
              <a
                href={createWhatsAppUrl(undefined, business.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex"
              >
                <Button variant="primary" size="sm" className="gap-2" tabIndex={-1}>
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </Button>
              </a>
            )}

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
      <div
        className={cn(
          "grid border-b bg-brand-cream transition-[grid-template-rows,opacity,border-color] duration-500 md:hidden",
          mobileMenuOpen
            ? "pointer-events-auto grid-rows-[1fr] border-brand-beige-300 opacity-100"
            : "pointer-events-none grid-rows-[0fr] border-transparent opacity-0"
        )}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col space-y-4 px-6 py-6">
            {NAV_LINKS.filter(
              (link) => link.href !== "/order" || business.websiteOrderingEnabled
            ).map((link) => (
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
              {business.whatsappOrderingEnabled && (
                <a
                  href={createWhatsAppUrl(undefined, business.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="primary" size="lg" className="w-full gap-2" tabIndex={-1}>
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </Button>
                </a>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
