import { NextRequest, NextResponse } from "next/server";
import { getPaymentGateway, SupportedPaymentProvider } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, provider, transactionRef, providerData } = body;

    if (!orderId || !provider) {
      return NextResponse.json(
        { success: false, message: "Missing orderId or provider" },
        { status: 400 }
      );
    }

    const gateway = getPaymentGateway(provider as SupportedPaymentProvider);
    const result = await gateway.verifyPayment({
      orderId,
      transactionRef,
      providerData,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    );
  }
}
