"use client";

import React, { useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PRODUCTS } from "@/lib/data/products";
import { useCart, CustomizationData } from "@/lib/store/cart-context";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  Upload,
  Camera,
  Check,
  Heart,
  Calendar,
  User,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

const FRAME_OPTIONS = [
  { id: "teak", name: "Natural Teak", borderClass: "border-[#7A5B4F] bg-[#6E4B3E]", colorHex: "#7A5B4F" },
  { id: "white", name: "Nordic White", borderClass: "border-[#EDE8DF] bg-[#F7F5F0]", colorHex: "#FFFFFF" },
  { id: "black", name: "Midnight Black", borderClass: "border-[#2D2421] bg-[#1E1917]", colorHex: "#2D2421" },
];

const FLOWER_STYLES = [
  {
    id: "blush",
    name: "Pastel Blush & Rose",
    description: "Preserved baby's breath, mini pink roses, and sage greenery",
    accentColor: "#E8B8B8",
    leafColor: "#A7B89F",
  },
  {
    id: "ivory",
    name: "Ivory & Baby's Breath",
    description: "Pure white dried hydrangeas, cream statice, and silver eucalyptus",
    accentColor: "#FAF7F2",
    leafColor: "#BDCBB7",
  },
  {
    id: "vibrant",
    name: "Vibrant Meadow",
    description: "Sun-dried wildflower palette with peach, lavender, and buttercup",
    accentColor: "#D99E9E",
    leafColor: "#8FA386",
  },
  {
    id: "sage",
    name: "Sage & Forest Bloom",
    description: "Earthy botanical mosses, dried mountain ferns, and olive foliage",
    accentColor: "#A7B89F",
    leafColor: "#5B6C55",
  },
];

const BACKGROUND_OPTIONS = [
  { id: "cream", name: "Warm Cream", bgClass: "bg-[#F9F6EF]", hex: "#F9F6EF" },
  { id: "white", name: "Pristine White", bgClass: "bg-[#FFFFFF]", hex: "#FFFFFF" },
  { id: "parchment", name: "Textured Beige", bgClass: "bg-[#EFE9DF]", hex: "#EFE9DF" },
];

const SIZE_OPTIONS = [
  { id: "small", name: "Small (6\" x 8\")", priceDelta: -200, desc: "Delicate desktop size" },
  { id: "medium", name: "Medium (8\" x 10\")", priceDelta: 0, desc: "Most popular keepsake size" },
  { id: "large", name: "Large (10\" x 12\")", priceDelta: 400, desc: "Statement centerpiece" },
];

function CustomizerContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams?.get("product") || "our-story-customized-keepsake";
  const baseProduct = PRODUCTS.find((p) => p.slug === productSlug) || PRODUCTS[1] || PRODUCTS[0]!;

  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Customization State
  const [selectedFrame, setSelectedFrame] = useState(FRAME_OPTIONS[0]!);
  const [selectedFlowerStyle, setSelectedFlowerStyle] = useState(FLOWER_STYLES[0]!);
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUND_OPTIONS[0]!);
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[1]!);

  // Form Fields
  const [photoPreview, setPhotoPreview] = useState<string>(
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
  );
  const [photoFileName, setPhotoFileName] = useState<string>("default_sample_photo.jpg");
  const [messageText, setMessageText] = useState<string>("Forever and always, in every lifetime.");
  const [recipientName, setRecipientName] = useState<string>("Aaila & Prashant");
  const [specialDate, setSpecialDate] = useState<string>("24th October 2025");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Price Calculation
  const totalPrice = baseProduct.basePrice + selectedSize.priceDelta;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Photo size exceeds 10MB limit. Please choose a smaller photo.");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoPreview(reader.result);
        setPhotoFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddToBag = () => {
    const customData: CustomizationData = {
      frameColor: selectedFrame.name,
      flowerStyle: selectedFlowerStyle.name,
      backgroundColor: selectedBackground.name,
      photoUrl: photoPreview,
      photoFileName,
      messageText,
      recipientName,
      specialDate,
      sizeVariant: selectedSize.name,
    };

    addToCart(baseProduct, 1, customData);
  };

  return (
    <div className="py-10 md:py-16">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs text-brand-brown-500 hover:text-brand-brown transition-colors mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Catalog</span>
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="pink">3D Customizer Studio</Badge>
              <span className="text-xs text-brand-brown-400">• Kathmandu Artisans</span>
            </div>
            <Heading as="h1" size="2xl" className="font-serif mt-1">
              Design Your Personalized Keepsake
            </Heading>
          </div>

          <div className="flex items-baseline gap-3 rounded-2xl border border-brand-beige-300 bg-white px-5 py-3 shadow-subtle">
            <span className="text-xs text-brand-brown-500 font-medium">Total:</span>
            <span className="font-serif text-2xl font-bold text-brand-brown">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>

        {/* 2-Column Workbench: Left Live Preview, Right Controls */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Live Visual Canvas */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 self-start space-y-4">
            <div className="rounded-3xl border border-brand-beige-300 bg-brand-cream-100/60 p-6 md:p-8 shadow-card text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-brown-400 block mb-4">
                Real-Time Keepsake Preview
              </span>

              {/* Dynamic Keepsake Frame Simulation */}
              <div
                className={`relative mx-auto flex flex-col items-center justify-between rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
                  selectedFrame.id === "teak"
                    ? "border-[14px] border-[#7A5B4F] bg-[#F9F6EF]"
                    : selectedFrame.id === "white"
                    ? "border-[14px] border-[#EDE8DF] bg-[#FFFFFF]"
                    : "border-[14px] border-[#2D2421] bg-[#F9F6EF]"
                }`}
                style={{
                  maxWidth: selectedSize.id === "small" ? "300px" : selectedSize.id === "large" ? "380px" : "340px",
                  minHeight: selectedSize.id === "small" ? "400px" : selectedSize.id === "large" ? "500px" : "450px",
                  backgroundColor: selectedBackground.hex,
                }}
              >
                {/* Botanical Corner Clusters */}
                <div
                  className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-md text-sm border border-white/60"
                  style={{ backgroundColor: selectedFlowerStyle.accentColor }}
                >
                  🌸
                </div>
                <div
                  className="absolute -bottom-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full shadow-md text-sm border border-white/60"
                  style={{ backgroundColor: selectedFlowerStyle.accentColor }}
                >
                  🌿
                </div>

                {/* Photo Inset Frame */}
                <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-beige-300/80 bg-brand-cream-200 shadow-inner">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Custom Photo Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-brand-brown-400 p-4">
                      <Camera className="h-8 w-8 mb-1 opacity-60" />
                      <span className="text-xs">Your Photo Will Appear Here</span>
                    </div>
                  )}
                  {/* Subtle glass reflection overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
                </div>

                {/* Calligraphy Engraving Section */}
                <div className="mt-4 w-full space-y-1.5 px-2 text-center">
                  {messageText && (
                    <p className="font-serif text-sm italic text-brand-brown leading-snug">
                      &ldquo;{messageText}&rdquo;
                    </p>
                  )}
                  {recipientName && (
                    <p className="font-serif text-xs font-bold text-brand-brown tracking-wider">
                      {recipientName}
                    </p>
                  )}
                  {specialDate && (
                    <p className="text-[9px] uppercase tracking-widest text-brand-sage-800">
                      {specialDate}
                    </p>
                  )}
                </div>

                {/* Bottom Authenticity Seal */}
                <div className="mt-4 pt-2 border-t border-brand-beige-300/50 w-full flex items-center justify-center gap-1 text-[8px] uppercase tracking-wider text-brand-brown-400">
                  <Heart className="h-2.5 w-2.5 fill-brand-pink-400 text-brand-pink-400" />
                  <span>Petal Craft Florals • Kathmandu</span>
                </div>
              </div>

              {/* Specs Summary Pill */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-brand-brown-600">
                <span className="rounded-full bg-white px-3 py-1 border border-brand-beige-300">
                  {selectedFrame.name}
                </span>
                <span className="rounded-full bg-white px-3 py-1 border border-brand-beige-300">
                  {selectedFlowerStyle.name}
                </span>
                <span className="rounded-full bg-white px-3 py-1 border border-brand-beige-300">
                  {selectedSize.name}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-6 space-y-8">
            {/* Step 1: Frame Finish */}
            <div className="rounded-3xl border border-brand-beige-300/80 bg-white/80 p-6 space-y-4 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-semibold text-brand-brown">
                  1. Choose Frame Finish
                </h3>
                <span className="text-xs text-brand-brown-500 font-medium">{selectedFrame.name}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {FRAME_OPTIONS.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all ${
                      selectedFrame.id === frame.id
                        ? "border-brand-brown bg-brand-cream-200/50 shadow-subtle"
                        : "border-brand-beige-200 bg-white hover:border-brand-beige-400"
                    }`}
                  >
                    <div
                      className="h-8 w-8 rounded-full border border-black/10 shadow-xs mb-2 flex items-center justify-center text-white"
                      style={{ backgroundColor: frame.colorHex }}
                    >
                      {selectedFrame.id === frame.id && (
                        <Check className={`h-4 w-4 ${frame.id === "white" ? "text-brand-brown" : "text-white"}`} />
                      )}
                    </div>
                    <span className="text-xs font-medium text-brand-brown">{frame.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Flower Style & Color Palette */}
            <div className="rounded-3xl border border-brand-beige-300/80 bg-white/80 p-6 space-y-4 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-semibold text-brand-brown">
                  2. Flower Palette &amp; Arrangement
                </h3>
              </div>

              <div className="space-y-2.5">
                {FLOWER_STYLES.map((flower) => (
                  <button
                    key={flower.id}
                    onClick={() => setSelectedFlowerStyle(flower)}
                    className={`flex w-full items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                      selectedFlowerStyle.id === flower.id
                        ? "border-brand-brown bg-brand-cream-200/40 shadow-subtle"
                        : "border-brand-beige-200 bg-white hover:border-brand-beige-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: flower.accentColor }}
                        />
                        <span className="text-xs font-bold text-brand-brown">{flower.name}</span>
                      </div>
                      <p className="text-[11px] text-brand-brown-500">{flower.description}</p>
                    </div>

                    {selectedFlowerStyle.id === flower.id && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-brown text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2b: Background Parchment Tone */}
            <div className="rounded-3xl border border-brand-beige-300/80 bg-white/80 p-6 space-y-4 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-semibold text-brand-brown">
                  3. Canvas &amp; Background Tone
                </h3>
                <span className="text-xs text-brand-brown-500 font-medium">{selectedBackground.name}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg)}
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all ${
                      selectedBackground.id === bg.id
                        ? "border-brand-brown bg-brand-cream-200/50 shadow-subtle font-semibold"
                        : "border-brand-beige-200 bg-white hover:border-brand-beige-400"
                    }`}
                  >
                    <div
                      className="h-7 w-7 rounded-full border border-brand-beige-400 shadow-xs mb-1.5 flex items-center justify-center text-brand-brown"
                      style={{ backgroundColor: bg.hex }}
                    >
                      {selectedBackground.id === bg.id && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className="text-xs text-brand-brown">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Photo Upload */}
            <div className="rounded-3xl border border-brand-beige-300/80 bg-white/80 p-6 space-y-4 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-semibold text-brand-brown">
                  3. Upload Cherished Photo
                </h3>
                <span className="text-xs text-brand-brown-500 font-medium">JPG, PNG, WebP (Max 10MB)</span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-beige-400 bg-brand-cream-50/50 p-6 text-center transition-colors hover:bg-brand-cream-100/60"
              >
                <Upload className="h-8 w-8 text-brand-brown-400 mb-2" />
                <p className="text-xs font-semibold text-brand-brown">
                  Click to select photo from device
                </p>
                <p className="text-[10px] text-brand-brown-400 mt-1">
                  Attached file: {photoFileName}
                </p>
              </div>

              {uploadError && (
                <p className="text-xs text-red-500 font-medium">{uploadError}</p>
              )}
            </div>

            {/* Step 4: Personal Message & Engraving */}
            <div className="rounded-3xl border border-brand-beige-300/80 bg-white/80 p-6 space-y-4 shadow-card">
              <h3 className="font-serif text-base font-semibold text-brand-brown">
                4. Custom Inscription &amp; Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-brand-brown mb-1.5">
                    Personalized Message / Vows (Max 140 chars)
                  </label>
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value.slice(0, 140))}
                    placeholder="e.g. Happy 2nd Anniversary to my favorite person."
                    className="min-h-[80px]"
                  />
                  <span className="text-[10px] text-brand-brown-400 text-right block mt-1">
                    {messageText.length} / 140 characters
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1.5 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-brand-brown-500" />
                      <span>Names / Initials</span>
                    </label>
                    <Input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Aaila & Prashant"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1.5 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-brand-brown-500" />
                      <span>Special Date</span>
                    </label>
                    <Input
                      value={specialDate}
                      onChange={(e) => setSpecialDate(e.target.value)}
                      placeholder="e.g. October 24, 2025"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Size Selection */}
            <div className="rounded-3xl border border-brand-beige-300/80 bg-white/80 p-6 space-y-4 shadow-card">
              <h3 className="font-serif text-base font-semibold text-brand-brown">
                5. Select Frame Dimensions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`flex flex-col items-center justify-between rounded-2xl border p-3.5 text-center transition-all ${
                      selectedSize.id === size.id
                        ? "border-brand-brown bg-brand-cream-200/50 shadow-subtle font-semibold"
                        : "border-brand-beige-200 bg-white hover:border-brand-beige-300"
                    }`}
                  >
                    <span className="text-xs text-brand-brown">{size.name}</span>
                    <span className="text-[10px] text-brand-brown-400 mt-0.5">{size.desc}</span>
                    <span className="mt-2 font-serif text-xs font-bold text-brand-brown">
                      {size.priceDelta === 0 ? "Standard" : size.priceDelta > 0 ? `+${formatCurrency(size.priceDelta)}` : `-${formatCurrency(Math.abs(size.priceDelta))}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Bag CTA */}
            <div className="p-6 rounded-3xl border border-brand-pink-300 bg-gradient-to-b from-brand-pink-50 to-white shadow-elevated space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-brand-brown-500 font-medium">Bespoke Keepsake Total:</span>
                  <div className="font-serif text-2xl font-bold text-brand-brown">
                    {formatCurrency(totalPrice)}
                  </div>
                </div>
                <div className="text-right text-[11px] text-brand-sage-800 font-medium">
                  <span>3-4 Days Kathmandu Handcrafting</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2 shadow-card hover:shadow-elevated text-base"
                onClick={handleAddToBag}
              >
                <Sparkles className="h-4 w-4 text-brand-pink-300" />
                <span>Add Customized Keepsake to Bag</span>
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function CustomizerPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading customizer...</div>}>
      <CustomizerContent />
    </Suspense>
  );
}
