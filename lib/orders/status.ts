import type { OrderRequestStatus } from "@prisma/client";

export const ORDER_STATUSES: OrderRequestStatus[] = [
  "NEW",
  "CONTACTED",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export const ORDER_STATUS_LABELS: Record<OrderRequestStatus, string> = {
  NEW: "Request received",
  CONTACTED: "Studio contacted",
  CONFIRMED: "Order confirmed",
  IN_PROGRESS: "Being handcrafted",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_MESSAGES: Record<OrderRequestStatus, string> = {
  NEW: "Your request has been received by Petal Craft.",
  CONTACTED: "Our studio has reviewed your request and is getting in touch.",
  CONFIRMED: "Your order has been confirmed and is ready to move into preparation.",
  IN_PROGRESS: "Your piece is currently being handcrafted by our studio.",
  COMPLETED: "Your order has been completed. Thank you for choosing Petal Craft.",
  CANCELLED: "This request has been cancelled. Please contact the studio if you need assistance.",
};

const ALLOWED_TRANSITIONS: Record<OrderRequestStatus, OrderRequestStatus[]> = {
  NEW: ["CONTACTED", "CANCELLED"],
  CONTACTED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransitionOrder(current: OrderRequestStatus, next: OrderRequestStatus): boolean {
  return current === next || ALLOWED_TRANSITIONS[current].includes(next);
}

export function nextOrderStatuses(current: OrderRequestStatus): OrderRequestStatus[] {
  return [current, ...ALLOWED_TRANSITIONS[current]];
}
