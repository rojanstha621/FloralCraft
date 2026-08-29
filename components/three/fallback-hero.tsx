import React from "react";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";

export function FallbackHero() {
  return (
    <div className="relative flex h-[420px] w-full max-w-[380px] flex-col items-center justify-center rounded-3xl border border-brand-beige-400/80 bg-gradient-to-b from-brand-cream-50 to-brand-cream-200 p-6 shadow-elevated transition-transform hover:scale-[1.01]">
      {/* Outer Luxury Wooden Frame Simulation */}
      <div className="relative flex h-full w-full flex-col items-center justify-between rounded-2xl border-4 border-brand-brown-600 bg-brand-cream-50 p-6 shadow-inner">
        {/* Decorative corner botanical badge */}
        <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full border border-brand-sage/50 bg-brand-sage-100 text-brand-sage-800 shadow-sm">
          <Sparkles className="h-4 w-4" />
        </div>

        {/* Center Keepsake Photograph Card */}
        <div className="relative mt-2 h-44 w-full overflow-hidden rounded-xl border border-brand-beige-300 bg-brand-cream-100 shadow-subtle">
          <Image
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop"
            alt="Handcrafted Floral Keepsake Frame"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />
          {/* Preserved Flower Overlay Accent */}
          <div className="absolute bottom-2 left-2 rounded-lg bg-brand-brown/80 px-2 py-1 text-[10px] font-medium text-brand-cream backdrop-blur-xs">
            Preserved Florals
          </div>
        </div>

        {/* Heartfelt Calligraphy Card */}
        <div className="w-full text-center space-y-1 pt-3">
          <p className="font-serif text-lg font-semibold text-brand-brown leading-tight">
            Forever Cherished
          </p>
          <p className="text-[11px] italic text-brand-brown-500 font-serif">
            &ldquo;More than just flowers... it&apos;s a feeling.&rdquo;
          </p>
          <div className="pt-1 flex items-center justify-center gap-1 text-[10px] tracking-wider uppercase text-brand-sage-700">
            <Heart className="h-3 w-3 fill-brand-pink text-brand-pink" />
            <span>Kathmandu Handmade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
