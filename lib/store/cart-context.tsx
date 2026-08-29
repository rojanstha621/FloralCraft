"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductData } from "@/lib/data/products";

export interface CustomizationData {
  frameColor?: string;
  flowerStyle?: string;
  backgroundColor?: string;
  photoUrl?: string;
  photoFileName?: string;
  messageText?: string;
  recipientName?: string;
  specialDate?: string;
  sizeVariant?: string;
}

export interface CartItem {
  id: string;
  product: ProductData;
  quantity: number;
  unitPrice: number;
  customization?: CustomizationData;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode: string | null;
  totalAmount: number;
  isCartDrawerOpen: boolean;
  addToCart: (product: ProductData, quantity?: number, customization?: CustomizationData) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "petalcraft_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }
    }
  }, [items, isHydrated]);

  const addToCart = (
    product: ProductData,
    quantity = 1,
    customization?: CustomizationData
  ) => {
    // Generate a distinct ID for items based on product slug and stringified customization
    const customKey = customization ? JSON.stringify(customization) : "default";
    const itemId = `${product.id}-${Buffer.from(customKey).toString("base64").slice(0, 10)}`;

    // Calculate item unit price (e.g. large size adds Rs. 300)
    let unitPrice = product.basePrice;
    if (customization?.sizeVariant?.includes("Large")) {
      unitPrice += 400;
    } else if (customization?.sizeVariant?.includes("Small")) {
      unitPrice -= 200;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          quantity,
          unitPrice,
          customization,
        },
      ];
    });

    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscountPercent(0);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "FIRSTBLOOM" || cleanCode === "KATHMANDU") {
      setCouponCode(cleanCode);
      setDiscountPercent(10); // 10% discount
      return { success: true, message: "10% coupon discount applied!" };
    }
    if (cleanCode === "PETAL20") {
      setCouponCode(cleanCode);
      setDiscountPercent(20);
      return { success: true, message: "20% festive discount applied!" };
    }
    return { success: false, message: "Invalid coupon code. Try FIRSTBLOOM" };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountPercent(0);
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  // Free delivery for orders over Rs. 3,500 in Kathmandu Valley
  const deliveryFee = subtotal === 0 || subtotal >= 3500 ? 0 : 150;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        deliveryFee,
        discountAmount,
        couponCode,
        totalAmount,
        isCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        openCartDrawer,
        closeCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
