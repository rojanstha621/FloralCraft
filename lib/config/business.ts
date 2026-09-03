export const BUSINESS = {
  name: "Petal Craft Florals",
  tagline: "More than just flowers... it's a feeling.",
  positioning: "Turning feelings into handmade keepsakes.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9779828988214",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY || "+977 982-8988214",
  email: "hello@petalcraftflorals.com",
  location: "Kathmandu, Nepal",
  instagramUrl: "https://www.instagram.com/petalcraftflorals/",
  tiktokUrl: "https://tiktok.com/@petalcraftflorals",
} as const;

export function createWhatsAppUrl(message?: string): string {
  const defaultMessage = `Hi ${BUSINESS.name} 🌸\n\nI'd love to know more about your handmade floral keepsakes.`;
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message || defaultMessage)}`;
}

export function createProductWhatsAppMessage(name: string, price: string): string {
  return `Hi ${BUSINESS.name} 🌸\n\nI'm interested in:\n${name}\n\nPrice:\n${price}\n\nCould you please tell me about availability and ordering?`;
}
