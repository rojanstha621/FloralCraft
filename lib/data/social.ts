import { BUSINESS } from "@/lib/config/business";

export type SocialContentType = "post" | "reel" | "story-link";

export interface SocialContentItem {
  id: string;
  type: SocialContentType;
  title: string;
  caption: string;
  imageUrl: string;
  href: string;
}

// Manually curated previews. These are links, not a live Instagram feed.
// The shape can later be populated by an official Meta API integration.
export const SOCIAL_CONTENT: SocialContentItem[] = [
  {
    id: "studio",
    type: "story-link",
    title: "In the studio",
    caption: "See how each keepsake comes together by hand.",
    imageUrl:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop",
    href: BUSINESS.instagramUrl,
  },
  {
    id: "details",
    type: "post",
    title: "Petal details",
    caption: "A closer look at preserved textures and thoughtful finishing.",
    imageUrl:
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop",
    href: BUSINESS.instagramUrl,
  },
  {
    id: "packing",
    type: "reel",
    title: "Packing an order",
    caption: "From our Kathmandu studio, wrapped and ready to gift.",
    imageUrl:
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=600&auto=format&fit=crop",
    href: BUSINESS.instagramUrl,
  },
  {
    id: "new-work",
    type: "post",
    title: "Recent work",
    caption: "New botanical compositions and keepsakes from our latest drop.",
    imageUrl:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=600&auto=format&fit=crop",
    href: BUSINESS.instagramUrl,
  },
];
