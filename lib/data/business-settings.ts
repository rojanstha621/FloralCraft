import "server-only";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/db/prisma";
import { BUSINESS, type PublicBusinessSettings } from "@/lib/config/business";

function readString(value: unknown, key: string) {
  return value && typeof value === "object" && key in value
    ? String((value as Record<string, unknown>)[key] || "")
    : "";
}

function readEnabled(value: unknown, key: string, fallback: boolean) {
  if (!value || typeof value !== "object") return fallback;
  const method = (value as Record<string, unknown>)[key];
  return method && typeof method === "object" && "enabled" in method
    ? Boolean((method as { enabled?: unknown }).enabled)
    : fallback;
}

export const getPublicBusinessSettings = unstable_cache(
  async (): Promise<PublicBusinessSettings> => {
    const settings = await prisma.businessSettings
      .findUnique({ where: { id: "default" } })
      .catch(() => null);
    if (!settings)
      return {
        ...BUSINESS,
        logoUrl: "",
        address: BUSINESS.location,
        openingHours: "",
        facebookUrl: "",
        otherSocialUrl: "",
        websiteOrderingEnabled: true,
        whatsappOrderingEnabled: true,
      };
    return {
      logoUrl: readString(settings.homepage, "logoUrl"),
      name: settings.businessName || BUSINESS.name,
      tagline: settings.tagline || BUSINESS.tagline,
      positioning: BUSINESS.positioning,
      whatsappNumber: settings.whatsappNumber || BUSINESS.whatsappNumber,
      phoneDisplay: settings.phone || BUSINESS.phoneDisplay,
      email: settings.email || BUSINESS.email,
      location: settings.address || BUSINESS.location,
      address: settings.address || BUSINESS.location,
      openingHours: readString(settings.openingHours, "display"),
      instagramUrl: readString(settings.socialLinks, "instagram") || BUSINESS.instagramUrl,
      facebookUrl: readString(settings.socialLinks, "facebook"),
      tiktokUrl: readString(settings.socialLinks, "tiktok") || BUSINESS.tiktokUrl,
      otherSocialUrl: readString(settings.socialLinks, "other"),
      websiteOrderingEnabled: readEnabled(settings.orderingMethods, "website", true),
      whatsappOrderingEnabled: readEnabled(settings.orderingMethods, "whatsapp", true),
    };
  },
  ["public-business-settings"],
  { revalidate: 300, tags: ["business-settings"] }
);
