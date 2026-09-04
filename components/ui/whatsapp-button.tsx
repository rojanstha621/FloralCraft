"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { createProductWhatsAppMessage, createWhatsAppUrl } from "@/lib/config/business";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useBusinessSettings } from "@/components/providers/business-provider";

interface WhatsAppButtonProps {
  productName?: string;
  price?: number;
  message?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WhatsAppButton({
  productName,
  price,
  message,
  label = "Chat on WhatsApp",
  size = "lg",
  className,
}: WhatsAppButtonProps) {
  const business = useBusinessSettings();
  if (!business.whatsappOrderingEnabled) return null;
  const productMessage =
    productName && price !== undefined
      ? createProductWhatsAppMessage(productName, formatCurrency(price))
      : undefined;

  return (
    <a
      href={createWhatsAppUrl(message || productMessage, business.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ size }),
        "gap-2 bg-[#1f8f55] text-white shadow-card hover:bg-[#187747]",
        className
      )}
      aria-label={productName ? `Order ${productName} via WhatsApp` : label}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
