"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/store/cart-context";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  Lock,
  CreditCard,
  Building,
  Sparkles,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    discountAmount,
    couponCode,
    totalAmount,
    clearCart,
  } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [city, setCity] = useState("Kathmandu");
  const [area, setArea] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "ESEWA" | "KHALTI" | "FONEPAY" | "CASH_ON_DELIVERY" | "BANK_TRANSFER"
  >("ESEWA");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = "Please enter your full name.";
    if (!customerPhone.trim() || customerPhone.length < 10) {
      errs.customerPhone = "Please enter a valid 10-digit Nepal mobile number.";
    }
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      errs.customerEmail = "Please enter a valid email address.";
    }
    if (!area.trim()) errs.area = "Please specify your neighborhood/area in Kathmandu Valley.";
    if (!streetAddress.trim()) errs.streetAddress = "Please enter your street address.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        streetAddress,
        city,
        area,
        landmark,
        preferredDate,
        deliveryNotes,
        paymentMethod,
        couponCode: couponCode || undefined,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          customization: item.customization,
        })),
        subtotal,
        deliveryFee,
        discountAmount,
        totalAmount,
      };

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        // Save order receipt into session storage for order success view
        sessionStorage.setItem("petalcraft_last_order", JSON.stringify(data.order));
        clearCart();

        // Redirect to success page or external payment gateway URL
        if (data.payment?.redirectUrl && !data.payment.isMock) {
          window.location.href = data.payment.redirectUrl;
        } else {
          router.push(
            `/order-success?orderNumber=${data.order.orderNumber}&provider=${paymentMethod}`
          );
        }
      } else {
        alert(data.message || "Could not complete order. Please check details.");
      }
    } catch {
      alert("Network error while placing order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <Container size="sm">
          <div className="rounded-3xl border border-brand-beige-300 bg-white p-12 space-y-4 shadow-card">
            <Heading as="h2" size="xl" className="font-serif">
              Your bag is empty
            </Heading>
            <Text size="sm" variant="muted">
              Add some botanical keepsakes to your bag before checking out.
            </Text>
            <Link href="/shop">
              <Button variant="primary" size="md">
                Browse Shop
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16">
      <Container size="xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-brand-brown-500 hover:text-brand-brown transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Bag</span>
          </Link>
        </div>

        <div className="mb-8">
          <Badge variant="pink">Safe &amp; Secure Checkout</Badge>
          <Heading as="h1" size="2xl" className="font-serif mt-1">
            Complete Your Gifting Order
          </Heading>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Form: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="rounded-3xl border border-brand-beige-300 bg-white p-6 space-y-4 shadow-card">
              <div className="flex items-center gap-2 border-b border-brand-beige-200 pb-3">
                <User className="h-4 w-4 text-brand-brown" />
                <h3 className="font-serif text-base font-semibold text-brand-brown">
                  1. Contact Information
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-brand-brown mb-1">
                    Your Full Name *
                  </label>
                  <Input
                    placeholder="e.g. Suman Shakya"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    error={errors.customerName}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-brand-brown-500" />
                      <span>Mobile Number (Nepal) *</span>
                    </label>
                    <Input
                      placeholder="98XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      error={errors.customerPhone}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-brand-brown-500" />
                      <span>Email Address *</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="name@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      error={errors.customerEmail}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Delivery Address (Kathmandu Valley Focus) */}
            <div className="rounded-3xl border border-brand-beige-300 bg-white p-6 space-y-4 shadow-card">
              <div className="flex items-center gap-2 border-b border-brand-beige-200 pb-3">
                <MapPin className="h-4 w-4 text-brand-brown" />
                <h3 className="font-serif text-base font-semibold text-brand-brown">
                  2. Delivery Address in Kathmandu Valley
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1">
                      City / District *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-11 w-full rounded-2xl border border-brand-beige-400/60 bg-white/70 px-4 text-sm text-brand-brown focus-visible:border-brand-sage focus-visible:outline-none"
                    >
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                      <option value="Outside Valley">Outside Valley (Courier)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1">
                      Area / Neighborhood *
                    </label>
                    <Input
                      placeholder="e.g. Jhamsikhel, Sanepa, Baneshwor"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      error={errors.area}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-brown mb-1">
                    Street Address &amp; House Details *
                  </label>
                  <Input
                    placeholder="e.g. Ward No. 3, Near Ganesh Temple Road"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    error={errors.streetAddress}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1">
                      Nearby Landmark (Optional)
                    </label>
                    <Input
                      placeholder="e.g. Opposite Bhatbhateni Supermarket"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-brown mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-brand-brown-500" />
                      <span>Preferred Delivery Date (Optional)</span>
                    </label>
                    <Input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-brown mb-1">
                    Gift Notes &amp; Special Delivery Instructions
                  </label>
                  <Textarea
                    placeholder="e.g. This is a surprise anniversary delivery! Please do not call the recipient beforehand."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Nepal Payment Provider Selection */}
            <div className="rounded-3xl border border-brand-beige-300 bg-white p-6 space-y-4 shadow-card">
              <div className="flex items-center gap-2 border-b border-brand-beige-200 pb-3">
                <CreditCard className="h-4 w-4 text-brand-brown" />
                <h3 className="font-serif text-base font-semibold text-brand-brown">
                  3. Payment Method
                </h3>
              </div>

              <div className="space-y-3">
                {/* eSewa Option */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    paymentMethod === "ESEWA"
                      ? "border-green-600 bg-green-50/50 shadow-subtle"
                      : "border-brand-beige-300 bg-white hover:bg-brand-cream-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "ESEWA"}
                      onChange={() => setPaymentMethod("ESEWA")}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-brand-brown">eSewa Mobile Wallet</span>
                        <span className="rounded bg-green-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                          Nepal ePay
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-brown-500">
                        Instant, secure payment via your eSewa ID or mobile app.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Khalti Option */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    paymentMethod === "KHALTI"
                      ? "border-purple-600 bg-purple-50/50 shadow-subtle"
                      : "border-brand-beige-300 bg-white hover:bg-brand-cream-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "KHALTI"}
                      onChange={() => setPaymentMethod("KHALTI")}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-brand-brown">Khalti Digital Wallet</span>
                        <span className="rounded bg-purple-700 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                          Khalti v2
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-brown-500">
                        Pay using Khalti wallet, e-banking, or mobile banking.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Fonepay QR Option */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    paymentMethod === "FONEPAY"
                      ? "border-red-600 bg-red-50/50 shadow-subtle"
                      : "border-brand-beige-300 bg-white hover:bg-brand-cream-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "FONEPAY"}
                      onChange={() => setPaymentMethod("FONEPAY")}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-brand-brown">Fonepay Direct QR</span>
                        <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                          Any Bank App
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-brown-500">
                        Scan with NIC Asia, Nabil, Global IME, Prabhu or any Nepal bank app.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-brand-brown bg-brand-cream-200 shadow-subtle"
                      : "border-brand-beige-300 bg-white hover:bg-brand-cream-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      className="h-4 w-4 text-brand-brown focus:ring-brand-brown"
                    />
                    <div>
                      <span className="font-bold text-sm text-brand-brown">Cash on Delivery (COD)</span>
                      <p className="text-[11px] text-brand-brown-500">
                        Pay cash upon receiving your keepsake frame at your doorstep in Kathmandu Valley.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-brand-brown bg-brand-cream-200 shadow-subtle"
                      : "border-brand-beige-300 bg-white hover:bg-brand-cream-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "BANK_TRANSFER"}
                      onChange={() => setPaymentMethod("BANK_TRANSFER")}
                      className="h-4 w-4 text-brand-brown focus:ring-brand-brown"
                    />
                    <div>
                      <span className="font-bold text-sm text-brand-brown flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5" />
                        <span>Direct Bank Transfer / ConnectIPS</span>
                      </span>
                      <p className="text-[11px] text-brand-brown-500">
                        Transfer to our studio business account and share payment slip.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 rounded-3xl border border-brand-beige-300 bg-white p-6 shadow-card space-y-6">
              <h3 className="font-serif text-base font-semibold text-brand-brown border-b border-brand-beige-200 pb-3">
                Order Items ({itemCount})
              </h3>

              {/* Items Mini List */}
              <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-brand-beige-100 last:border-0 last:pb-0">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-brand-beige-300 bg-brand-cream-100">
                      <Image
                        src={item.customization?.photoUrl || item.product.images[0]?.url || ""}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 text-xs">
                      <h4 className="font-serif font-semibold text-brand-brown leading-tight">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-brand-brown-500 mt-0.5">
                        Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                      {item.customization && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-brand-sage-800">
                          <Sparkles className="h-3 w-3" />
                          <span>Customized Keepsake</span>
                        </div>
                      )}
                    </div>

                    <span className="font-serif font-bold text-xs text-brand-brown">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 text-xs text-brand-brown-600 border-t border-brand-beige-200 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-brown">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-pink-700">
                    <span>Discount ({couponCode})</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Kathmandu Valley Delivery</span>
                  <span className="font-semibold text-brand-brown">
                    {deliveryFee === 0 ? <span className="text-green-700">FREE</span> : formatCurrency(deliveryFee)}
                  </span>
                </div>

                <div className="pt-3 border-t border-brand-beige-200 flex justify-between text-sm font-bold text-brand-brown">
                  <span>Total Due</span>
                  <span className="font-serif text-2xl">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full gap-2 shadow-card hover:shadow-elevated text-base"
                isLoading={isSubmitting}
              >
                <Lock className="h-4 w-4" />
                <span>Place Order • {formatCurrency(totalAmount)}</span>
              </Button>

              <div className="space-y-2 pt-2 border-t border-brand-beige-200 text-[10px] text-brand-brown-500 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-sage-700" />
                  <span>256-Bit SSL Encrypted &amp; Nepal Payment Protection</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-brand-sage-700" />
                  <span>Handcrafted in Kathmandu Valley</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
