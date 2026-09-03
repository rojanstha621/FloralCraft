import { MetadataRoute } from "next";
import prisma from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://petalcraftflorals.com";
  const routes = [
    "",
    "/collections",
    "/reviews",
    "/about",
    "/faq",
    "/contact",
    "/order",
    "/privacy-policy",
    "/terms",
  ];
  const products = await prisma.product
    .findMany({
      where: { available: true, archivedAt: null },
      select: { slug: true, updatedAt: true },
    })
    .catch(() => []);
  return [
    ...routes.map((route, index) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: index < 2 ? ("daily" as const) : ("monthly" as const),
      priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.6,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
