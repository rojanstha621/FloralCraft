import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        sortOrder: true,
      },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Collection fetch failed", error);
    return NextResponse.json(
      { success: false, message: "Collections are temporarily unavailable." },
      { status: 500 }
    );
  }
}
