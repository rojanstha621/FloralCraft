import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Heart, Instagram, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-brand-beige-300/60 bg-brand-cream-100 text-brand-brown pt-16 pb-12">
      <Container size="xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="horizontal" size="md" />
            <Text size="sm" variant="muted" className="max-w-sm">
              Handcrafted floral keepsakes designed to preserve memories, celebrate love, and convey emotions. Made by hand with care in Kathmandu, Nepal.
            </Text>
            <div className="pt-2 flex items-center space-x-3 text-xs text-brand-brown-600">
              <MapPin className="h-4 w-4 text-brand-sage-700" />
              <span>Kathmandu, Nepal</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-brand-brown-600">
              <Phone className="h-4 w-4 text-brand-sage-700" />
              <span>+977 980-0000000</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-brand-brown-600">
              <Mail className="h-4 w-4 text-brand-sage-700" />
              <span>hello@petalcraftflorals.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <Heading as="h4" size="xs" className="font-semibold tracking-wider text-brand-brown">
              Collections
            </Heading>
            <ul className="space-y-2 text-sm text-brand-brown-500">
              <li>
                <Link href="/shop" className="hover:text-brand-brown transition-colors">
                  All Floral Gifts
                </Link>
              </li>
              <li>
                <Link href="/customize" className="hover:text-brand-brown transition-colors">
                  Personalized Frames
                </Link>
              </li>
              <li>
                <Link href="/shop?category=forever-bloom" className="hover:text-brand-brown transition-colors">
                  Forever Bloom
                </Link>
              </li>
              <li>
                <Link href="/shop?category=our-story" className="hover:text-brand-brown transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/shop?category=dear-mom" className="hover:text-brand-brown transition-colors">
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
                <Link href="/about" className="hover:text-brand-brown transition-colors">
                  Our Story & Craft
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-brand-brown transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-brown transition-colors">
                  FAQs & Care Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-brown transition-colors">
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-brown transition-colors">
                  Admin Portal
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
                <Link href="/delivery-policy" className="hover:text-brand-brown transition-colors">
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-brand-brown transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-brown transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-brown transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-beige-300 bg-white/60 text-brand-brown hover:bg-brand-pink-100 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-beige-300 bg-white/60 text-brand-brown hover:bg-brand-pink-100 transition-colors"
                aria-label="TikTok"
              >
                <span className="text-xs font-bold font-sans">TT</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom divider with Nepal payment badges */}
        <div className="mt-12 border-t border-brand-beige-300/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-brown-500">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Petal Craft Florals. Made with</span>
            <Heart className="h-3.5 w-3.5 fill-brand-pink-500 text-brand-pink-500 inline" />
            <span>in Kathmandu, Nepal.</span>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-wider text-brand-brown-400">Accepted:</span>
            <span className="rounded-md border border-brand-sage/30 bg-white px-2 py-0.5 text-[10px] font-semibold text-green-700">eSewa</span>
            <span className="rounded-md border border-purple-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-purple-700">Khalti</span>
            <span className="rounded-md border border-red-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-red-600">Fonepay</span>
            <span className="rounded-md border border-brand-beige-400 bg-white px-2 py-0.5 text-[10px] font-semibold text-brand-brown">COD</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
