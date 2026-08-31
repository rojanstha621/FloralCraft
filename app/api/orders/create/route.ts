import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentGateway, SupportedPaymentProvider } from "@/lib/payments";

const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive(),
  customization: z
    .object({
      frameColor: z.string().optional(),
      flowerStyle: z.string().optional(),
      backgroundColor: z.string().optional(),
      photoUrl: z.string().optional(),
      photoFileName: z.string().optional(),
      messageText: z.string().optional(),
      recipientName: z.string().optional(),
      specialDate: z.string().optional(),
      sizeVariant: z.string().optional(),
    })
    .optional(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().min(10, "Valid 10-digit Nepal phone number required"),
  streetAddress: z.string().min(3, "Street address required"),
  city: z.string().default("Kathmandu"),
  area: z.string().min(2, "Area is required"),
  landmark: z.string().optional(),
  deliveryNotes: z.string().optional(),
  preferredDate: z.string().optional(),
  paymentMethod: z.enum(["ESEWA", "KHALTI", "FONEPAY", "CASH_ON_DELIVERY", "BANK_TRANSFER"]),
  couponCode: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item required in order"),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  discountAmount: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createOrderSchema.parse(body);

    // Generate human-friendly order number: PC-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PC-${dateStr}-${randomSuffix}`;
    const orderId = `ord_${Date.now()}_${randomSuffix}`;

    // Initiate payment via Nepal payment provider abstraction
    const paymentGateway = getPaymentGateway(validated.paymentMethod as SupportedPaymentProvider);
    const paymentResult = await paymentGateway.initiatePayment({
      orderId,
      orderNumber,
      amount: validated.totalAmount,
      customerName: validated.customerName,
      customerEmail: validated.customerEmail,
      customerPhone: validated.customerPhone,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/verify`,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/order-success`,
    });

    const orderRecord = {
      id: orderId,
      orderNumber,
      customerName: validated.customerName,
      customerEmail: validated.customerEmail,
      customerPhone: validated.customerPhone,
      deliveryAddress: {
        streetAddress: validated.streetAddress,
        city: validated.city,
        area: validated.area,
        landmark: validated.landmark,
      },
      deliveryNotes: validated.deliveryNotes,
      preferredDate: validated.preferredDate,
      paymentMethod: validated.paymentMethod,
      status: validated.paymentMethod === "CASH_ON_DELIVERY" ? "CONFIRMED" : "PAYMENT_PENDING",
      items: validated.items,
      subtotal: validated.subtotal,
      deliveryFee: validated.deliveryFee,
      discountAmount: validated.discountAmount,
      totalAmount: validated.totalAmount,
      couponCode: validated.couponCode,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      order: orderRecord,
      payment: paymentResult,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to process order" },
      { status: 500 }
    );
  }
}
