import React from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { ShopByOccasion } from "@/components/sections/shop-by-occasion";
import { BrandStorySection } from "@/components/sections/brand-story-section";
import { CraftProcessSection } from "@/components/sections/craft-process-section";
import { WhyPetalCraft } from "@/components/sections/why-petal-craft";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { InstagramShowcase } from "@/components/sections/instagram-showcase";
import { FinalCTA } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturedProducts />
      <ShopByOccasion />
      <BrandStorySection />
      <CraftProcessSection />
      <WhyPetalCraft />
      <ReviewsSection />
      <InstagramShowcase />
      <FinalCTA />
    </div>
  );
}
