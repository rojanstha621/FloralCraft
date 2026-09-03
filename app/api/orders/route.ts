import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z.string().trim().min(7).max(25),
  customerEmail: z.string().email().max(160).optional().or(z.literal("")),
  preferredChannel: z.enum(["WHATSAPP", "PHONE", "EMAIL"]),
  desiredDate: z.string().optional().or(z.literal("")),
  notes: z.string().trim().max(1500).optional().or(z.literal("")),
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
  customization: z.record(z.string().max(500)).optional(),
  website: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = orderSchema.parse(await request.json());
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
          { success: false, message: `${option.label} is required.` },
          { status: 400 }
        );
    }
    const requestNumber = `PC-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`;
    const order = await prisma.orderRequest.create({
      data: {
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
      },
    });
    return NextResponse.json(
      {
        success: true,
        requestNumber: order.requestNumber,
        message: "Your request has been received. We’ll contact you to confirm the details.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { success: false, message: error.errors[0]?.message || "Please check your details." },
        { status: 400 }
      );
    console.error("Order request failed", error);
    return NextResponse.json(
      { success: false, message: "We could not send your request right now." },
      { status: 500 }
    );
  }
}
