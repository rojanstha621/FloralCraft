"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store/cart-context";
import { formatCurrency } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    discountAmount,
    totalAmount,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-brown-900/40 backdrop-blur-xs transition-opacity"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-brand-cream border-l border-brand-beige-300 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-brand-beige-300/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-brown" />
              <Heading as="h3" size="sm" className="font-serif">
                Your Shopping Bag ({itemCount})
              </Heading>
            </div>
            <button
              onClick={closeCartDrawer}
              className="rounded-full p-2 text-brand-brown-500 hover:bg-brand-cream-200 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Valley Free Delivery Tracker */}
          <div className="bg-brand-sage-50 px-6 py-2.5 border-b border-brand-sage-200/60 text-xs text-brand-brown">
            {subtotal >= 3500 ? (
              <span className="text-brand-sage-900 font-medium">
                🎉 You qualify for Free Kathmandu Valley Delivery!
              </span>
            ) : (
              <span>
                Add <strong className="font-bold text-brand-brown">{formatCurrency(3500 - subtotal)}</strong> more for Free Valley Delivery!
              </span>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink-100 text-brand-brown">
                  <ShoppingBag className="h-8 w-8 text-brand-brown/60" />
                </div>
                <div className="space-y-1">
                  <Heading as="h4" size="sm" className="font-serif">
                    Your bag is currently empty
                  </Heading>
                  <p className="text-xs text-brand-brown-400 max-w-xs">
                    Explore our handcrafted floral keepsakes and find something special to preserve.
                  </p>
                </div>
                <Link href="/shop" onClick={closeCartDrawer}>
                  <Button variant="primary" size="sm">
                    Discover Gifts
                  </Button>
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-brand-beige-200 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl border border-brand-beige-300 bg-brand-cream-100">
                    <Image
                      src={item.customization?.photoUrl || item.product.images[0]?.url || ""}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-brand-brown leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-brand-brown-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="font-serif text-sm font-bold text-brand-brown mt-0.5">
                        {formatCurrency(item.unitPrice)}
                      </p>

                      {/* Customization Details Chips */}
                      {item.customization && (
                        <div className="mt-2 space-y-1 rounded-xl bg-brand-cream-200/80 p-2 text-[11px] text-brand-brown-600">
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
                          {item.customization.messageText && (
                            <div className="line-clamp-1 italic">
                              &ldquo;{item.customization.messageText}&rdquo;
                            </div>
                          )}
                          {item.customization.photoFileName && (
                            <div className="flex items-center gap-1 text-[10px] text-brand-sage-800">
                              <Sparkles className="h-3 w-3" />
                              <span>Custom Photo Attached</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-brand-beige-300 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-brand-brown hover:bg-brand-cream-200 rounded-l-full transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-brand-brown hover:bg-brand-cream-200 rounded-r-full transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-semibold text-brand-brown">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-brand-beige-300 bg-white p-6 space-y-4 shadow-elevated">
              <div className="space-y-1.5 text-xs text-brand-brown-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-brown">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-pink-700">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Valley Delivery</span>
                  <span className="font-semibold text-brand-brown">
                    {deliveryFee === 0 ? <span className="text-green-700">FREE</span> : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-brand-beige-200 flex justify-between text-sm font-bold text-brand-brown">
                  <span>Total</span>
                  <span className="font-serif text-base">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCartDrawer} className="block">
                  <Button variant="primary" size="lg" className="w-full gap-2 shadow-card hover:shadow-elevated">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/cart" onClick={closeCartDrawer} className="block text-center text-xs font-semibold text-brand-brown hover:underline">
                  View Full Cart & Apply Coupons
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
