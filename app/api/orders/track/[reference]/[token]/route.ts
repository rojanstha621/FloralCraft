import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import {
  publicTrackingOrderSelect,
  serializePublicTrackingOrder,
} from "@/lib/orders/public-tracking";
import { hashTrackingToken, isValidTrackingToken } from "@/lib/security/order-tracking";
import { checkRateLimit, clientAddress } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const privateHeaders = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };

function notFound() {
  return NextResponse.json(
    { success: false, message: "Order not found." },
    { status: 404, headers: privateHeaders }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string; token: string }> }
) {
  const limit = checkRateLimit(`order-track:${clientAddress(request)}`, 30, 5 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { ...privateHeaders, "Retry-After": String(limit.retryAfter) },
      }
    );
  }

  const { reference, token } = await params;
  if (!/^PC-[A-Z0-9-]{4,32}$/.test(reference) || !isValidTrackingToken(token)) return notFound();

  try {
    const order = await prisma.orderRequest.findFirst({
      where: { requestNumber: reference, trackingTokenHash: hashTrackingToken(token) },
      select: publicTrackingOrderSelect,
    });
    if (!order) return notFound();
    return NextResponse.json(
      { success: true, order: serializePublicTrackingOrder(order) },
      { headers: privateHeaders }
    );
  } catch {
    console.error("Order tracking lookup failed.");
    return NextResponse.json(
      { success: false, message: "Unable to load order." },
      { status: 500, headers: privateHeaders }
    );
  }
}

function methodNotAllowed() {
  return NextResponse.json(
    { success: false, message: "Method not allowed." },
    { status: 405, headers: { ...privateHeaders, Allow: "GET" } }
  );
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
