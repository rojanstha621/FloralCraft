"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  Heart,
  Truck,
  Sparkles,
  Phone,
  Printer,
  ArrowRight,
  Package,
  Calendar,
} from "lucide-react";

const ORDER_TIMELINE = [
  { step: 1, label: "Order Received", status: "completed", desc: "Payment verified" },
  { step: 2, label: "Studio Production", status: "current", desc: "Artisans drying & arranging florals" },
  { step: 3, label: "Wax Seal Packaging", status: "upcoming", desc: "Rigid gift box & seal" },
  { step: 4, label: "Doorstep Delivery", status: "upcoming", desc: "Hand-delivered in Kathmandu" },
];

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get("orderNumber") || "PC-20250829-9482";
  const provider = searchParams?.get("provider") || "ESEWA";

  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("petalcraft_last_order");
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 md:py-20">
      <Container size="md">
        {/* Success Card */}
        <div className="rounded-4xl border border-brand-sage/40 bg-white p-8 md:p-12 shadow-card space-y-8">
          {/* Header Banner */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-sage-100 text-brand-sage-800 shadow-subtle">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <Badge variant="sage" className="gap-1">
              <Sparkles className="h-3 w-3 text-brand-sage-700" />
              <span>Order Successfully Placed</span>
            </Badge>

            <Heading as="h1" size="2xl" className="font-serif">
              Thank you for choosing Petal Craft
            </Heading>

            <Text size="base" variant="muted" className="max-w-md mx-auto">
              Your keepsake order <strong className="text-brand-brown font-mono font-bold">{orderNumber}</strong> has been received by our studio in Lalitpur, Kathmandu.
            </Text>
          </div>

          {/* Timeline Tracker */}
          <div className="rounded-3xl border border-brand-beige-300/80 bg-brand-cream-100/60 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-beige-200 pb-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-brand-brown" />
                <h3 className="font-serif font-semibold text-sm text-brand-brown">
                  Order Status: <span className="text-brand-sage-900 uppercase">In Production</span>
                </h3>
              </div>
              <span className="text-[11px] text-brand-brown-500">
                Est. Completion: 2-4 Days
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {ORDER_TIMELINE.map((step) => (
                <div key={step.step} className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        step.status === "completed"
                          ? "bg-brand-sage text-white"
                          : step.status === "current"
                          ? "bg-brand-pink-500 text-white animate-pulse"
                          : "bg-brand-beige-300 text-brand-brown-500"
                      }`}
                    >
                      {step.step}
                    </div>
                    <span className="text-xs font-bold text-brand-brown">{step.label}</span>
                  </div>
                  <p className="text-[10px] text-brand-brown-500 pl-8 hidden sm:block">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Breakdown */}
          {orderData && (
            <div className="space-y-4 border-t border-brand-beige-200 pt-6 text-xs text-brand-brown-700">
              <h4 className="font-serif font-semibold text-sm text-brand-brown">
                Keepsake Items Ordered
              </h4>

              <div className="space-y-4">
                {orderData.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 rounded-2xl bg-brand-cream-50 p-4 border border-brand-beige-200">
                    {item.customization?.photoUrl && (
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-brand-beige-300 bg-white">
                        <Image
                          src={item.customization.photoUrl}
                          alt="Custom Photo"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between font-semibold text-brand-brown">
                        <span>{item.productName}</span>
                        <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                      </div>
                      <p className="text-[11px] text-brand-brown-500">
                        Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                      {item.customization && (
                        <div className="text-[10px] text-brand-brown-600 space-y-0.5 pt-1">
                          {item.customization.frameColor && <div>Frame: {item.customization.frameColor}</div>}
                          {item.customization.flowerStyle && <div>Flowers: {item.customization.flowerStyle}</div>}
                          {item.customization.messageText && <div className="italic">&ldquo;{item.customization.messageText}&rdquo;</div>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Details */}
              <div className="rounded-2xl bg-brand-cream-50 p-4 border border-brand-beige-200 space-y-1">
                <span className="font-semibold text-brand-brown">Recipient &amp; Delivery:</span>
                <p>{orderData.customerName} • {orderData.customerPhone}</p>
                <p className="text-brand-brown-500">
                  {orderData.deliveryAddress?.streetAddress}, {orderData.deliveryAddress?.area}, {orderData.deliveryAddress?.city}
                </p>
                {orderData.deliveryNotes && (
                  <p className="italic text-brand-brown-500 pt-1">Note: {orderData.deliveryNotes}</p>
                )}
              </div>

              {/* Total Row */}
              <div className="flex justify-between text-sm font-bold text-brand-brown border-t border-brand-beige-200 pt-4">
                <span>Total Paid ({orderData.paymentMethod}):</span>
                <span className="font-serif text-lg">{formatCurrency(orderData.totalAmount)}</span>
              </div>
            </div>
          )}

          {/* Next Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-brand-beige-200">
            <Button variant="outline" size="md" className="w-full sm:w-auto gap-1.5" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              <span>Print Receipt</span>
            </Button>

            <a
              href="https://wa.me/9779800000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full border border-green-600/40 bg-green-50 px-5 py-2.5 text-xs font-semibold text-green-800 hover:bg-green-100 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>WhatsApp Studio Support</span>
            </a>

            <Link href="/shop" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full gap-1.5">
                <span>Back to Shop</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
