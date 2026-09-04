import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { createHash } from "node:crypto";
import { getPublicBusinessSettings } from "@/lib/data/business-settings";
import { readJsonBody, RequestBodyError } from "@/lib/security/request";
import { checkRateLimit, clientAddress } from "@/lib/security/rate-limit";

const orderSchema = z
  .object({
    customerName: z.string().trim().min(2, "Please enter your name.").max(100),
    customerPhone: z.string().trim().min(7, "Please enter a valid contact number.").max(25),
    customerEmail: z
      .string()
      .email("Please enter a valid email address.")
      .max(160)
      .optional()
      .or(z.literal("")),
    preferredChannel: z.enum(["WHATSAPP", "PHONE", "EMAIL"]),
    desiredDate: z
      .string()
      .refine(
        (value) =>
          !value ||
          (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
            !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime())),
        "Please choose a valid delivery date."
      )
      .optional()
      .or(z.literal("")),
    notes: z.string().trim().max(1500).optional().or(z.literal("")),
    productId: z.string().min(1, "Please choose a product."),
    quantity: z.number().int().min(1).max(20),
    customization: z.record(z.string().max(500)).optional(),
    website: z.string().max(0).optional(),
  })
  .superRefine((payload, context) => {
    if (payload.preferredChannel === "EMAIL" && !payload.customerEmail) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customerEmail"],
        message: "Email is required when it is your preferred contact method.",
      });
    }
  });

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(`order:${clientAddress(request)}`, 5, 10 * 60 * 1000);
    if (!limit.allowed)
      return NextResponse.json(
        { success: false, message: "Too many order requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    const payload = orderSchema.parse(await readJsonBody(request, 32 * 1024));
    const settings = await getPublicBusinessSettings();
    if (!settings.websiteOrderingEnabled)
      return NextResponse.json(
        { success: false, message: "Website order requests are currently paused." },
        { status: 409 }
      );
    const product = await prisma.product.findFirst({
      where: { id: payload.productId, archivedAt: null, available: true },
      include: { customizationOptions: { where: { active: true } } },
    });
    if (!product)
      return NextResponse.json(
        { success: false, message: "This product is not currently available." },
        { status: 404 }
      );

    for (const option of product.customizationOptions) {
      const value = payload.customization?.[option.key]?.trim();
      if (option.required && !value)
        return NextResponse.json(
          {
            success: false,
            message: "Please complete the required personalisation details.",
            errors: { [`custom-${option.key}`]: [`${option.label} is required.`] },
          },
          { status: 400 }
        );
    }
    const idempotencyKey = request.headers.get("idempotency-key")?.trim() || crypto.randomUUID();
    if (idempotencyKey.length > 128 || !/^[A-Za-z0-9._:-]+$/.test(idempotencyKey))
      return NextResponse.json(
        { success: false, message: "Invalid idempotency key." },
        { status: 400 }
      );
    const requestNumber = `PC-${createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 20).toUpperCase()}`;
    const orderData = {
      requestNumber,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail || null,
      preferredChannel: payload.preferredChannel,
      desiredDate: payload.desiredDate ? new Date(`${payload.desiredDate}T12:00:00Z`) : null,
      notes: payload.notes || null,
      items: {
        create: {
          productId: product.id,
          productNameSnapshot: product.name,
          unitPriceSnapshot: product.price,
          quantity: payload.quantity,
          customization: payload.customization || undefined,
        },
      },
    };
    let order;
    try {
      order = await prisma.orderRequest.create({ data: orderData });
    } catch (error) {
      if ((error as { code?: string }).code !== "P2002") throw error;
      const existing = await prisma.orderRequest.findUnique({
        where: { requestNumber },
        select: { requestNumber: true },
      });
      if (!existing) throw error;
      return NextResponse.json(
        {
          success: true,
          requestNumber: existing.requestNumber,
          message: "Your request has already been received.",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        requestNumber: order.requestNumber,
        message: "Your request has been received. We’ll contact you to confirm the details.",
      },
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
        {
          success: false,
          message: "Please review the highlighted details and try again.",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    if (error instanceof SyntaxError)
      return NextResponse.json(
        { success: false, message: "The order request could not be read." },
        { status: 400 }
      );
    console.error("Order request failed", error);
    return NextResponse.json(
      { success: false, message: "We could not send your request right now." },
      { status: 500 }
    );
  }
}
