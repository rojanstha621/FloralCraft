import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        tagline: true,
        description: true,
        price: true,
        compareAtPrice: true,
        available: true,
        featured: true,
        customizable: true,
        customizationSummary: true,
        dimensions: true,
        materials: true,
        preparationDays: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        images: {
          select: { id: true, url: true, alt: true, sortOrder: true, primary: true },
          orderBy: { sortOrder: "asc" },
        },
        category: { select: { id: true, name: true, slug: true } },
        productType: { select: { id: true, name: true, slug: true } },
        reviews: { where: { status: "APPROVED" }, select: { rating: true } },
      },
      where: { archivedAt: null },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({
      success: true,
      products: products.map(({ reviews, ...product }) => ({
        ...product,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        reviewCount: reviews.length,
        averageRating: reviews.length
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0,
      })),
    });
  } catch (error) {
    console.error("Product catalog fetch failed", error);
    return NextResponse.json(
      { success: false, message: "The catalog is temporarily unavailable." },
      { status: 500 }
    );
  }
}
