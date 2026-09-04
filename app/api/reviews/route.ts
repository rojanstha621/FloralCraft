import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { readJsonBody, RequestBodyError } from "@/lib/security/request";
import { checkRateLimit, clientAddress } from "@/lib/security/rate-limit";

const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  email: z.string().email().max(160).optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(1200),
  imageUrl: z.string().url().max(500).optional().or(z.literal("")),
  website: z.string().max(0).optional(),
});

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED", ...(productId ? { productId } : {}) },
    select: {
      id: true,
      reviewerName: true,
      rating: true,
      body: true,
      imageUrl: true,
      verified: true,
      createdAt: true,
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, reviews });
}

export async function POST(request: NextRequest) {
  try {
    const payload = reviewSchema.parse(await readJsonBody(request, 16 * 1024));
    const limit = checkRateLimit(`review:${clientAddress(request)}`, 3, 60 * 60 * 1000);
    if (!limit.allowed)
      return NextResponse.json(
        { success: false, message: "Too many review submissions. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );

    const product = await prisma.product.findUnique({
      where: { id: payload.productId },
      select: { id: true },
    });
    if (!product)
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });

    await prisma.review.create({
      data: {
        productId: payload.productId,
        reviewerName: payload.name,
        reviewerEmail: payload.email || null,
        rating: payload.rating,
        body: payload.comment,
        imageUrl: payload.imageUrl || null,
        status: "PENDING",
        verified: false,
      },
    });
    return NextResponse.json(
      { success: true, message: "Thank you. Your review will appear after moderation." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof RequestBodyError)
      return NextResponse.json(
        {
          success: false,
          message: error.kind === "too_large" ? "Request is too large." : "Invalid request body.",
        },
        { status: 400 }
      );
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { success: false, message: error.errors[0]?.message || "Please check your review." },
        { status: 400 }
      );
    return NextResponse.json(
      { success: false, message: "We could not submit your review right now." },
      { status: 500 }
    );
  }
}
