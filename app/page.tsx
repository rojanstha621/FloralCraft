import React from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { ShopByOccasion } from "@/components/sections/shop-by-occasion";
import { CustomGiftSection } from "@/components/sections/custom-gift-section";
import { CraftProcessSection } from "@/components/sections/craft-process-section";
import { WhyPetalCraft } from "@/components/sections/why-petal-craft";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { InstagramShowcase } from "@/components/sections/instagram-showcase";
import { FinalCTA } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      {/* 1. Hero with 3D Interactive Keepsake */}
      <HeroSection />

      {/* 2. Featured Curated Gifts */}
      <FeaturedProducts />

      {/* 3. Shop by Occasion */}
      <ShopByOccasion />

      {/* 4. Custom Gift Customizer Showcase */}
      <CustomGiftSection />

      {/* 5. Handmade Artisan Journey (Choose -> Design -> Craft -> Deliver) */}
      <CraftProcessSection />

      {/* 6. Why Petal Craft Florals */}
      <WhyPetalCraft />

      {/* 7. Customer Reviews & Emotional Testimonials */}
      <ReviewsSection />

      {/* 8. Instagram & TikTok Community Showcase */}
      <InstagramShowcase />

      {/* 9. Final Emotional Call to Action */}
      <FinalCTA />
    </div>
  );
}
