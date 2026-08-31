import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      slug,
      tagline,
      description,
      story,
      basePrice,
      compareAtPrice,
      isCustomizable,
      isFeatured,
      isAvailable,
      dimensions,
      materials,
      prepTimeDays,
      categoryId,
      images,
    } = body;

    // Validate required fields
    if (!name || !slug || !description || !basePrice || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        tagline,
        description,
        story,
        basePrice: parseFloat(basePrice),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        isCustomizable: isCustomizable ?? true,
        isFeatured: isFeatured ?? false,
        isAvailable: isAvailable ?? true,
        dimensions,
        materials,
        prepTimeDays: prepTimeDays ?? 3,
        categoryId,
      },
    });

    // Create product images
    if (images && Array.isArray(images) && images.length > 0) {
      await Promise.all(
        images.map((image: any, index: number) =>
          prisma.productImage.create({
            data: {
              productId: product.id,
              url: image.url,
              altText: image.alt || `${name} - Image ${index + 1}`,
              sortOrder: image.sortOrder || index,
              isPrimary: image.isPrimary || index === 0,
            },
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        basePrice: product.basePrice,
      },
    });

  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      products,
    });

  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}