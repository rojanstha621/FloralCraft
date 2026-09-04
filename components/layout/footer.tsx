"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Heart, Instagram, MapPin, Mail, Phone } from "lucide-react";
import { useBusinessSettings } from "@/components/providers/business-provider";

export function Footer() {
  const business = useBusinessSettings();
  return (
    <footer className="border-t border-brand-beige-300/60 bg-brand-cream-100 pb-12 pt-16 text-brand-brown">
      <Container size="xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-2">
            <Logo variant="horizontal" size="md" />
            <Text size="sm" variant="muted" className="max-w-sm">
              Handcrafted floral keepsakes designed to preserve memories, celebrate love, and convey
              emotions. Made by hand with care in Kathmandu, Nepal.
            </Text>
            <div className="flex items-center space-x-3 pt-2 text-xs text-brand-brown-600">
              <MapPin className="h-4 w-4 text-brand-sage-700" />
              <span>{business.address}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-brand-brown-600">
              <Phone className="h-4 w-4 text-brand-sage-700" />
              <span>{business.phoneDisplay}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-brand-brown-600">
              <Mail className="h-4 w-4 text-brand-sage-700" />
              <span>{business.email}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <Heading as="h4" size="xs" className="font-semibold tracking-wider text-brand-brown">
              Collections
            </Heading>
            <ul className="space-y-2 text-sm text-brand-brown-500">
              <li>
                <Link href="/collections" className="transition-colors hover:text-brand-brown">
                  All Floral Gifts
                </Link>
              </li>
              <li>
                <Link
                  href="/collections?category=forever-bloom"
                  className="transition-colors hover:text-brand-brown"
                >
                  Forever Bloom
                </Link>
              </li>
              <li>
                <Link
                  href="/collections?category=our-story"
                  className="transition-colors hover:text-brand-brown"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/collections?category=dear-mom"
                  className="transition-colors hover:text-brand-brown"
                >
                  Dear Mom & Gratitude
                </Link>
              </li>
            </ul>
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <Heading as="h4" size="xs" className="font-semibold tracking-wider text-brand-brown">
              Experience
            </Heading>
            <ul className="space-y-2 text-sm text-brand-brown-500">
              <li>
                <Link href="/about" className="transition-colors hover:text-brand-brown">
                  Our Story & Craft
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="transition-colors hover:text-brand-brown">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-brand-brown">
                  FAQs & Care Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-brand-brown">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Socials */}
          <div className="space-y-3">
            <Heading as="h4" size="xs" className="font-semibold tracking-wider text-brand-brown">
              Policies & Connect
            </Heading>
            <ul className="space-y-2 text-sm text-brand-brown-500">
              <li>
                <Link href="/delivery-policy" className="transition-colors hover:text-brand-brown">
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="transition-colors hover:text-brand-brown">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="transition-colors hover:text-brand-brown">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-brand-brown">
                  Terms of Service
                </Link>
              </li>
            </ul>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-beige-300 bg-white/60 text-brand-brown transition-colors hover:bg-brand-pink-100"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={business.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-beige-300 bg-white/60 text-brand-brown transition-colors hover:bg-brand-pink-100"
                aria-label="TikTok"
              >
                <span className="font-sans text-xs font-bold">TT</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom brand line */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-brand-beige-300/40 pt-8 text-xs text-brand-brown-500 md:flex-row">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Petal Craft Florals. Made with</span>
            <Heart className="inline h-3.5 w-3.5 fill-brand-pink-500 text-brand-pink-500" />
            <span>in Kathmandu, Nepal.</span>
          </div>

          <span>Turning feelings into handmade keepsakes.</span>
        </div>
      </Container>
    </footer>
  );
}
