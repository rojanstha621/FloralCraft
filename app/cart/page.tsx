"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/store/cart-context";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    discountAmount,
    couponCode,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMessage({ success: res.success, text: res.message });
    if (res.success) {
      setInputCoupon("");
    }
  };

  return (
    <div className="py-10 md:py-16">
      <Container size="xl">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-brand-brown-500 hover:text-brand-brown transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge variant="pink">Review Your Order</Badge>
            <Heading as="h1" size="2xl" className="font-serif mt-1">
              Your Shopping Bag
            </Heading>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-500 hover:underline font-medium"
            >
              Clear Entire Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-4xl border border-brand-beige-300 bg-white/70 p-12 md:p-20 text-center space-y-4 shadow-card">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-pink-100 text-brand-brown">
              <ShoppingBag className="h-10 w-10 opacity-70" />
            </div>
            <Heading as="h2" size="xl" className="font-serif">
              Your shopping bag is empty
            </Heading>
            <Text size="sm" variant="muted" className="max-w-md">
              Discover our collection of handcrafted floral frames, preserved memory keepsakes, and bespoke gifts.
            </Text>
            <div className="pt-2">
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Explore Curated Gifts
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-3xl border border-brand-beige-300 bg-white p-6 shadow-card space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-brand-beige-200 last:border-0 last:pb-0"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative aspect-[4/5] sm:aspect-square h-40 sm:h-32 w-full sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-brand-beige-300 bg-brand-cream-100">
                      <Image
                        src={item.customization?.photoUrl || item.product.images[0]?.url || ""}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-sage-800">
                              {item.product.category}
                            </span>
                            <h3 className="font-serif text-lg font-semibold text-brand-brown">
                              {item.product.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-brand-brown-400 hover:text-red-500 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Customization Details */}
                        {item.customization && (
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-2xl bg-brand-cream-100 p-3 text-xs text-brand-brown-700">
                            {item.customization.frameColor && (
                              <div>
                                <span className="font-medium text-brand-brown">Frame:</span> {item.customization.frameColor}
                              </div>
                            )}
                            {item.customization.flowerStyle && (
                              <div>
                                <span className="font-medium text-brand-brown">Flowers:</span> {item.customization.flowerStyle}
                              </div>
                            )}
                            {item.customization.sizeVariant && (
                              <div>
                                <span className="font-medium text-brand-brown">Size:</span> {item.customization.sizeVariant}
                              </div>
                            )}
                            {item.customization.recipientName && (
                              <div>
                                <span className="font-medium text-brand-brown">Names:</span> {item.customization.recipientName}
                              </div>
                            )}
                            {item.customization.messageText && (
                              <div className="sm:col-span-2 italic text-brand-brown-600">
                                &ldquo;{item.customization.messageText}&rdquo;
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Item Total */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-brand-beige-300 bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-brand-brown hover:bg-brand-cream-200 rounded-l-full transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-10 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-brand-brown hover:bg-brand-cream-200 rounded-r-full transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-serif text-lg font-bold text-brand-brown">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </div>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-brand-brown-400">
                              {formatCurrency(item.unitPrice)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Coupon Form */}
              <div className="rounded-3xl border border-brand-beige-300 bg-white p-6 shadow-card space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-brand-brown" />
                  <h3 className="font-serif text-sm font-semibold text-brand-brown">
                    Have a Promo Code?
                  </h3>
                </div>

                {couponCode ? (
                  <div className="flex items-center justify-between rounded-2xl bg-brand-sage-100 p-3 text-xs text-brand-sage-900 font-medium">
                    <span>Coupon <strong>{couponCode}</strong> applied!</span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter FIRSTBLOOM"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="h-10 uppercase text-xs"
                    />
                    <Button type="submit" variant="primary" size="sm" className="shrink-0">
                      Apply
                    </Button>
                  </form>
                )}

                {couponMessage && !couponCode && (
                  <p className={`text-xs ${couponMessage.success ? "text-green-600" : "text-red-500"}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="rounded-3xl border border-brand-beige-300 bg-white p-6 shadow-card space-y-4">
                <h3 className="font-serif text-base font-semibold text-brand-brown border-b border-brand-beige-200 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs text-brand-brown-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
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
                    <span>Estimated Total</span>
                    <span className="font-serif text-xl">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/checkout" className="block">
                    <Button variant="primary" size="lg" className="w-full gap-2 shadow-card hover:shadow-elevated text-sm">
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-2 pt-2 border-t border-brand-beige-200 text-[11px] text-brand-brown-500">
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-brand-sage-700" />
                    <span>Free Kathmandu Valley Delivery on orders over Rs. 3,500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-sage-700" />
                    <span>Secure Nepal payments with eSewa, Khalti &amp; COD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
