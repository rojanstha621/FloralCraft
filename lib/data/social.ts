import { BUSINESS } from "@/lib/config/business";
import { mediaUrl } from "@/lib/config/media";

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
    imageUrl: mediaUrl("social/studio.jpg"),
    href: BUSINESS.instagramUrl,
  },
  {
    id: "details",
    type: "post",
    title: "Petal details",
    caption: "A closer look at preserved textures and thoughtful finishing.",
    imageUrl: mediaUrl("social/details.jpg"),
    href: BUSINESS.instagramUrl,
  },
  {
    id: "packing",
    type: "reel",
    title: "Packing an order",
    caption: "From our Kathmandu studio, wrapped and ready to gift.",
    imageUrl: mediaUrl("social/packing.jpg"),
    href: BUSINESS.instagramUrl,
  },
  {
    id: "new-work",
    type: "post",
    title: "Recent work",
    caption: "New botanical compositions and keepsakes from our latest drop.",
    imageUrl: mediaUrl("social/new-work.jpg"),
    href: BUSINESS.instagramUrl,
  },
];
