export interface ProductData {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  story: string;
  basePrice: number;
  compareAtPrice?: number;
  category: string;
  categorySlug: string;
  occasion: string[];
  isCustomizable: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  dimensions: string;
  materials: string;
  prepTimeDays: number;
  images: {
    url: string;
    altText: string;
    isPrimary: boolean;
  }[];
  customizationDefaults?: {
    frameColor: string;
    flowerStyle: string;
    backgroundColor: string;
    sizeVariant: string;
  };
}

export const CATEGORIES = [
  { id: "cat-1", name: "All Categories", slug: "all" },
  { id: "cat-2", name: "Forever Bloom", slug: "forever-bloom", description: "Everlasting pressed and preserved floral compositions in museum glass." },
  { id: "cat-3", name: "Our Story", slug: "our-story", description: "Photo-infused botanical keepsakes celebrating milestones and love." },
  { id: "cat-4", name: "Dear Mom", slug: "dear-mom", description: "Heartfelt gratitude gifts with preserved roses and delicate greenery." },
  { id: "cat-5", name: "With Gratitude", slug: "with-gratitude", description: "Enchanted floral domes and shadowboxes designed to say thank you." },
  { id: "cat-6", name: "Memory Lane", slug: "memory-lane", description: "Archival shadowboxes preserving dates, vows, and treasured moments." },
  { id: "cat-7", name: "Made For You", slug: "made-for-you", description: "Completely bespoke handcrafted creations tailored to your vision." },
];

export const OCCASIONS_LIST = [
  "all",
  "birthdays",
  "anniversaries",
  "couples",
  "parents",
  "teachers",
  "special-moments",
];

export const PRODUCTS: ProductData[] = [
  {
    id: "prod-1",
    name: "Forever Bloom Botanical Frame",
    slug: "forever-bloom-botanical-frame",
    tagline: "Preserved baby's breath and pastel blush roses in natural teak.",
    description:
      "The Forever Bloom Botanical Frame captures the fleeting beauty of fresh flowers and freezes it in time. Using organically dried baby's breath, preserved blush mini roses, and wild mountain foliage from the hills surrounding Kathmandu, each frame is a delicate work of art designed to last for years without water or maintenance.",
    story:
      "Handcrafted in our Lalitpur studio, this design was inspired by the springtime wildflower blooms across the Kathmandu valley hillsides. Every single stem is chosen by hand and set in a sustainable teak frame.",
    basePrice: 2499,
    compareAtPrice: 2899,
    category: "Forever Bloom",
    categorySlug: "forever-bloom",
    occasion: ["birthdays", "anniversaries", "special-moments"],
    isCustomizable: true,
    isFeatured: true,
    isAvailable: true,
    dimensions: "8\" x 10\" x 1.2\" (20cm x 25cm x 3cm)",
    materials: "Real preserved flowers, natural teak wood, UV-filtered glass, acid-free cotton paper.",
    prepTimeDays: 3,
    images: [
      {
        url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
        altText: "Forever Bloom Botanical Frame front angle",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop",
        altText: "Detail view of preserved rose petals and gypsophila",
        isPrimary: false,
      },
      {
        url: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop",
        altText: "Gift packaged in luxury box with wax seal",
        isPrimary: false,
      },
    ],
    customizationDefaults: {
      frameColor: "Natural Teak",
      flowerStyle: "Pastel Blush & Rose",
      backgroundColor: "Warm Cream",
      sizeVariant: "Medium (8x10\")",
    },
  },
  {
    id: "prod-2",
    name: "Our Story Customized Keepsake",
    slug: "our-story-customized-keepsake",
    tagline: "Your favorite photo surrounded by dried hydrangeas and custom calligraphy.",
    description:
      "Preserve your most precious memory inside a handcrafted botanical sanctuary. Upload your photograph, and our studio prints it on archival museum paper before surrounding the picture with hand-arranged preserved hydrangeas, eucalyptus sprigs, and custom gold-leaf calligraphy.",
    story:
      "Designed specifically for couples, weddings, and anniversaries. Customers often send us travel photos from Pokhara, wedding portraits, or candid first-date memories.",
    basePrice: 3299,
    category: "Our Story",
    categorySlug: "our-story",
    occasion: ["anniversaries", "couples", "special-moments"],
    isCustomizable: true,
    isFeatured: true,
    isAvailable: true,
    dimensions: "9\" x 11\" x 1.5\" (23cm x 28cm x 4cm)",
    materials: "Solid timber frame, archival photo print, preserved hydrangeas and gypsophila, acrylic front.",
    prepTimeDays: 4,
    images: [
      {
        url: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop",
        altText: "Our Story Customized Keepsake with photo and flowers",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
        altText: "Angle view showing flower depth and calligraphy",
        isPrimary: false,
      },
    ],
    customizationDefaults: {
      frameColor: "Nordic White",
      flowerStyle: "Blush Pink & White",
      backgroundColor: "Warm Cream",
      sizeVariant: "Medium (8x10\")",
    },
  },
  {
    id: "prod-3",
    name: "Dear Mom Preserved Rose Shadowbox",
    slug: "dear-mom-preserved-rose-shadowbox",
    tagline: "A heartfelt gratitude gift with everlasting dried carnations and roses.",
    description:
      "A tribute to unconditional love. Features an arrangement of preserved pink roses, delicate white statice, and wild chamomile, accompanied by an embossed note of gratitude that will never fade.",
    story:
      "Our most requested Mother's Day and birthday gift for mothers across Nepal. Packaged in our signature sage-green gift box.",
    basePrice: 2899,
    category: "Dear Mom",
    categorySlug: "dear-mom",
    occasion: ["parents", "birthdays", "special-moments"],
    isCustomizable: true,
    isFeatured: true,
    isAvailable: true,
    dimensions: "8\" x 8\" x 2\" (20cm x 20cm x 5cm)",
    materials: "Preserved roses, dried carnations, pine shadowbox frame, textured parchment paper.",
    prepTimeDays: 3,
    images: [
      {
        url: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop",
        altText: "Dear Mom Preserved Rose Shadowbox",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
        altText: "Close-up of preserved carnations and handwritten note",
        isPrimary: false,
      },
    ],
    customizationDefaults: {
      frameColor: "Natural Teak",
      flowerStyle: "Pastel Blush & Rose",
      backgroundColor: "Warm Cream",
      sizeVariant: "Small (6x8\")",
    },
  },
  {
    id: "prod-4",
    name: "With Gratitude Floral Glass Dome",
    slug: "with-gratitude-floral-glass-dome",
    tagline: "Enchanted glass bell jar housing dried everlasting wildflowers.",
    description:
      "An enchanting 360-degree glass bell jar filled with a miniature botanical garden of dried wildflowers, moss, and everlasting Ecuadorian rose buds resting on a handcrafted wooden base.",
    story:
      "Every dome is individually sculpted under glass, creating a serene, fairytale-like centerpiece for desks, nightstands, and living room consoles.",
    basePrice: 3599,
    compareAtPrice: 3999,
    category: "With Gratitude",
    categorySlug: "with-gratitude",
    occasion: ["teachers", "birthdays", "special-moments"],
    isCustomizable: false,
    isFeatured: true,
    isAvailable: true,
    dimensions: "6\" diameter x 9\" height (15cm x 23cm)",
    materials: "Borosilicate glass dome, solid beech base, preserved roses, treated moss.",
    prepTimeDays: 2,
    images: [
      {
        url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
        altText: "With Gratitude Floral Glass Dome",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop",
        altText: "Glass dome detail with miniature wildflowers",
        isPrimary: false,
      },
    ],
  },
  {
    id: "prod-5",
    name: "Memory Lane Arch Keepsake",
    slug: "memory-lane-arch-keepsake",
    tagline: "Arched wooden frame preserving your special dates, vows, and botanicals.",
    description:
      "Our modern architectural arch frame features an elegant silhouette that adds contemporary warmth to any room. Customize with your significant milestone date, vows, or lyrics surrounded by floating dried florals.",
    story:
      "Crafted for lovers of minimalist Scandinavian and Japandi interior design who want an emotional, personal touch.",
    basePrice: 3899,
    category: "Memory Lane",
    categorySlug: "memory-lane",
    occasion: ["anniversaries", "couples", "birthdays"],
    isCustomizable: true,
    isFeatured: true,
    isAvailable: true,
    dimensions: "9\" x 13\" x 1.5\" (23cm x 33cm x 4cm)",
    materials: "Arched solid ash frame, museum acrylic, preserved botanicals, cotton cardstock.",
    prepTimeDays: 4,
    images: [
      {
        url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop",
        altText: "Memory Lane Arch Keepsake",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800&auto=format&fit=crop",
        altText: "Arch silhouette and floral details",
        isPrimary: false,
      },
    ],
    customizationDefaults: {
      frameColor: "Natural Teak",
      flowerStyle: "Sage & Ivory Meadow",
      backgroundColor: "Warm Cream",
      sizeVariant: "Large (10x12\")",
    },
  },
  {
    id: "prod-6",
    name: "Bespoke Couple Blossom Frame",
    slug: "bespoke-couple-blossom-frame",
    tagline: "Tailored to your love story with customizable flower palettes and initials.",
    description:
      "Celebrate your connection with two hand-lettered initials connected by a botanical heart garland. Crafted with miniature preserved blossom buds and golden wire accents.",
    story:
      "A timeless engagement, wedding, or anniversary keepsake that brings warmth to your home for years to come.",
    basePrice: 2999,
    category: "Made For You",
    categorySlug: "made-for-you",
    occasion: ["couples", "anniversaries", "special-moments"],
    isCustomizable: true,
    isFeatured: true,
    isAvailable: true,
    dimensions: "8\" x 10\" x 1.2\" (20cm x 25cm x 3cm)",
    materials: "Natural pine frame, metallic gold accents, preserved hydrangea petals, cotton paper.",
    prepTimeDays: 3,
    images: [
      {
        url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800&auto=format&fit=crop",
        altText: "Bespoke Couple Blossom Frame",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
        altText: "Detail view of monogram initials and flowers",
        isPrimary: false,
      },
    ],
    customizationDefaults: {
      frameColor: "Midnight Black",
      flowerStyle: "Pastel Blush & Rose",
      backgroundColor: "Warm Cream",
      sizeVariant: "Medium (8x10\")",
    },
  },
];
