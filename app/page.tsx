import React from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { BrandStorySection } from "@/components/sections/brand-story-section";
import { CraftProcessSection } from "@/components/sections/craft-process-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { InstagramShowcase } from "@/components/sections/instagram-showcase";
import { FinalCTA } from "@/components/sections/final-cta";
import { HomeExperience } from "@/components/home/home-experience";

export default function HomePage() {
  return (
    <HomeExperience>
      <HeroSection />
      <FeaturedProducts />
      <BrandStorySection />
      <CraftProcessSection />
      <ReviewsSection />
      <InstagramShowcase />
      <FinalCTA />
    </HomeExperience>
  );
}
