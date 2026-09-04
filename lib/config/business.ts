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

export type PublicBusinessSettings = {
  name: string;
  tagline: string;
  positioning: string;
  whatsappNumber: string;
  phoneDisplay: string;
  email: string;
  location: string;
  address: string;
  openingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  otherSocialUrl: string;
  websiteOrderingEnabled: boolean;
  whatsappOrderingEnabled: boolean;
};

export function createWhatsAppUrl(
  message?: string,
  whatsappNumber = BUSINESS.whatsappNumber
): string {
  const defaultMessage = `Hi ${BUSINESS.name} 🌸\n\nI'd love to know more about your handmade floral keepsakes.`;
  return `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message || defaultMessage)}`;
}

export function createProductWhatsAppMessage(name: string, price: string): string {
  return `Hi ${BUSINESS.name} 🌸\n\nI'm interested in:\n${name}\n\nPrice:\n${price}\n\nCould you please tell me about availability and ordering?`;
}

type OrderWhatsAppContext = {
  productName?: string;
  quantity?: number;
  customization?: string[];
  deliveryArea?: string;
  desiredDate?: string;
  notes?: string;
  requestNumber?: string;
};

export function createOrderWhatsAppMessage(context: OrderWhatsAppContext): string {
  const lines = [`Hi ${BUSINESS.name} 🌸`, "", "I'd like to enquire about an order request."];

  if (context.requestNumber) lines.push("", `Reference: ${context.requestNumber}`);
  if (context.productName) lines.push("", `Product: ${context.productName}`);
  if (context.quantity) lines.push(`Quantity: ${context.quantity}`);
  if (context.customization?.length) {
    lines.push("", "Personalisation:", ...context.customization.map((item) => `- ${item}`));
  }
  if (context.deliveryArea) lines.push("", `Delivery area / pickup: ${context.deliveryArea}`);
  if (context.desiredDate) lines.push(`Preferred date: ${context.desiredDate}`);
  if (context.notes) lines.push("", `Note: ${context.notes}`);
  lines.push("", "Could you please confirm availability and the final price?");

  return lines.join("\n");
}
