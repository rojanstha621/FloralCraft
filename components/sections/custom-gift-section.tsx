import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Camera, MessageSquare, Palette, Frame } from "lucide-react";

export function CustomGiftSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-brand-cream-100/50 via-brand-pink-50/40 to-brand-cream-100/50">
      <Container size="xl">
        <div className="rounded-4xl border border-brand-pink-300/50 bg-white/90 p-8 sm:p-12 lg:p-16 shadow-card">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:col-span-6">
              <Badge variant="pink" className="gap-1">
                <Sparkles className="h-3 w-3 text-brand-pink-600" />
                <span>Signature Bespoke Experience</span>
              </Badge>

              <Heading as="h2" size="2xl" className="font-serif">
                Your memory. Your message. <br />
                <span className="italic text-brand-brown-600">Your flowers.</span>
              </Heading>

              <Text size="base" variant="muted">
                Turn your favorite photograph, special dates, and words of love into a permanent 3D floral art piece. Choose the frame finishes, real preserved flower color themes, and delicate calligraphy.
              </Text>

              {/* Customizer Feature Pillars */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 rounded-2xl border border-brand-beige-300/60 bg-brand-cream-50/70 p-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-pink-100 text-brand-brown">
                    <Camera className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-brand-brown">Photo Upload</h4>
                    <p className="text-[11px] text-brand-brown-500">HD museum-grade print</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-brand-beige-300/60 bg-brand-cream-50/70 p-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-sage-100 text-brand-brown">
                    <Palette className="h-4 w-4 text-brand-sage-800" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-brand-brown">Flower Palettes</h4>
                    <p className="text-[11px] text-brand-brown-500">Blush, sage, ivory & more</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-brand-beige-300/60 bg-brand-cream-50/70 p-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-beige-200 text-brand-brown">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-brand-brown">Custom Messages</h4>
                    <p className="text-[11px] text-brand-brown-500">Personalized vows & dates</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-brand-beige-300/60 bg-brand-cream-50/70 p-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-pink-50 text-brand-brown">
                    <Frame className="h-4 w-4 text-brand-pink-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-brand-brown">Frame Finishes</h4>
                    <p className="text-[11px] text-brand-brown-500">Natural wood, white, black</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/customize">
                  <Button variant="primary" size="lg" className="gap-2 shadow-card hover:shadow-elevated">
                    <Sparkles className="h-4 w-4 text-brand-pink-400" />
                    <span>Create Your Own Keepsake</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Customizer Visual Preview */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl border border-brand-beige-300/80 bg-brand-cream-50 p-6 shadow-inner">
                {/* Customizer Mockup Window */}
                <div className="flex items-center justify-between border-b border-brand-beige-300/60 pb-3 text-xs text-brand-brown-500">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-pink-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-sage-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-beige-400" />
                  </div>
                  <span className="font-mono text-[10px] tracking-wider uppercase">Live Customizer Preview</span>
                </div>

                {/* Simulated Interactive Canvas */}
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-brand-beige-300 bg-white p-6 text-center space-y-4 shadow-subtle">
                  <div className="relative flex h-48 w-40 flex-col items-center justify-between rounded-xl border-4 border-brand-brown-700 bg-brand-cream-50 p-3 shadow-md">
                    {/* Corner Flower Indicator */}
                    <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-pink-200 text-brand-pink-800 text-[10px] shadow-xs">
                      🌸
                    </div>
                    <div className="h-20 w-full rounded-md bg-brand-pink-50 border border-brand-pink-200/60 flex items-center justify-center text-xs text-brand-brown-500">
                      <span>[Your Photo Here]</span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-serif text-[11px] font-semibold text-brand-brown leading-tight">
                        &ldquo;Forever and Always&rdquo;
                      </p>
                      <p className="text-[8px] tracking-wider uppercase text-brand-sage-700">
                        A & R • Oct 24, 2025
                      </p>
                    </div>
                  </div>

                  {/* Option Pills Preview */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[10px]">
                    <span className="rounded-full bg-brand-beige-200 px-2.5 py-1 font-medium text-brand-brown">
                      Frame: Natural Teak
                    </span>
                    <span className="rounded-full bg-brand-pink-100 px-2.5 py-1 font-medium text-brand-pink-900">
                      Flora: Blush Rose & Gypsophila
                    </span>
                    <span className="rounded-full bg-brand-sage-100 px-2.5 py-1 font-medium text-brand-sage-900">
                      Size: Medium (8x10&quot;)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
