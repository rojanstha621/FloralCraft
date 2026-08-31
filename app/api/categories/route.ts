import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.productCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      categories,
    });

  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}