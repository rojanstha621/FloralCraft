import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { getPublicBusinessSettings } from "@/lib/data/business-settings";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#F9F6EF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Petal Craft Florals | Handmade Floral Keepsakes & Gifts in Kathmandu",
    template: "%s | Petal Craft Florals",
  },
  description:
    "More than just flowers... it's a feeling. Discover bespoke handmade floral frames, customized flower gifts, and preserved memory keepsakes in Kathmandu, Nepal.",
  keywords: [
    "handmade floral gifts",
    "customized flower frames",
    "flower delivery kathmandu",
    "personalized gifts nepal",
    "petal craft florals",
    "preserved flowers",
    "anniversary gifts nepal",
    "birthday keepsakes",
  ],
  authors: [{ name: "Petal Craft Florals" }],
  creator: "Petal Craft Florals",
  publisher: "Petal Craft Florals",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://petalcraftflorals.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Petal Craft Florals — Handmade Gifts in Kathmandu",
    description:
      "More than just flowers... it's a feeling. Custom handmade floral keepsakes that preserve your cherished moments.",
    url: "/",
    siteName: "Petal Craft Florals",
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Petal Craft Florals — Handmade Keepsakes",
    description:
      "Handcrafted floral gifts made to preserve the moments and people you never want to forget.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const businessSettings = await getPublicBusinessSettings();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}
    >
      <body className="bg-paper-texture flex min-h-screen flex-col bg-brand-cream text-brand-brown antialiased selection:bg-brand-pink-200">
        <SiteShell businessSettings={businessSettings}>{children}</SiteShell>
      </body>
    </html>
  );
}
