import "server-only";

import type { OrderNotificationEvent, OrderRequestStatus } from "@prisma/client";

const DEFAULT_TEMPLATES: Record<OrderRequestStatus, string> = {
  NEW: "petalcraft_order_received",
  CONTACTED: "petalcraft_order_contacted",
  CONFIRMED: "petalcraft_order_confirmed",
  IN_PROGRESS: "petalcraft_order_in_progress",
  COMPLETED: "petalcraft_order_completed",
  CANCELLED: "petalcraft_order_cancelled",
};

const TEMPLATE_ENV: Record<OrderRequestStatus, string> = {
  NEW: "WHATSAPP_TEMPLATE_ORDER_RECEIVED",
  CONTACTED: "WHATSAPP_TEMPLATE_STATUS_CONTACTED",
  CONFIRMED: "WHATSAPP_TEMPLATE_STATUS_CONFIRMED",
  IN_PROGRESS: "WHATSAPP_TEMPLATE_STATUS_IN_PROGRESS",
  COMPLETED: "WHATSAPP_TEMPLATE_STATUS_COMPLETED",
  CANCELLED: "WHATSAPP_TEMPLATE_STATUS_CANCELLED",
};

export function whatsappTemplateFor(eventType: OrderNotificationEvent, status: OrderRequestStatus) {
  const templateName = process.env[TEMPLATE_ENV[status]] || DEFAULT_TEMPLATES[status];
  return {
    eventType,
    templateName,
    language: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US",
  };
}
