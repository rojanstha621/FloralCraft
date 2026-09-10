import "server-only";

import { Prisma, type OrderRequestStatus } from "@prisma/client";
import { ORDER_STATUS_LABELS } from "@/lib/orders/status";

export const publicTrackingOrderSelect = Prisma.validator<Prisma.OrderRequestSelect>()({
  requestNumber: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  desiredDate: true,
  notes: true,
  items: {
    select: {
      productNameSnapshot: true,
      unitPriceSnapshot: true,
      quantity: true,
      customization: true,
      product: {
        select: {
          images: {
            select: { url: true, alt: true },
            orderBy: [{ primary: "desc" }, { sortOrder: "asc" }],
            take: 1,
          },
        },
      },
    },
  },
  statusHistory: {
    select: { newStatus: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  },
});

type RecordType = Prisma.OrderRequestGetPayload<{ select: typeof publicTrackingOrderSelect }>;

function publicStatus(status: OrderRequestStatus) {
  return { code: status, label: ORDER_STATUS_LABELS[status] };
}

function deliveryArea(notes: string | null): string | null {
  const prefix = "Delivery area / pickup:";
  const line = notes?.split(/\r?\n/).find((entry) => entry.trim().startsWith(prefix));
  return line?.trim().slice(prefix.length).trim() || null;
}

function customizationSummary(value: Prisma.JsonValue | null): string[] {
  if (!value || Array.isArray(value) || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, entry]) => {
    if (typeof entry !== "string" || !entry.trim()) return [];
    const label = key.replaceAll("-", " ").replace(/^\w/, (letter) => letter.toUpperCase());
    return [`${label}: ${entry.trim()}`];
  });
}

export function serializePublicTrackingOrder(order: RecordType) {
  const completePricing = order.items.every((item) => item.unitPriceSnapshot !== null);
  const baseSubtotal = completePricing
    ? order.items.reduce((sum, item) => sum + Number(item.unitPriceSnapshot) * item.quantity, 0)
    : null;
  const history = order.statusHistory.length
    ? order.statusHistory.map((entry) => ({
        status: publicStatus(entry.newStatus),
        createdAt: entry.createdAt.toISOString(),
      }))
    : [{ status: publicStatus(order.status), createdAt: order.updatedAt.toISOString() }];

  return {
    requestNumber: order.requestNumber,
    status: publicStatus(order.status),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => {
      const customization = customizationSummary(item.customization);
      return {
        name: item.productNameSnapshot,
        imageUrl: item.product?.images[0]?.url || null,
        imageAlt: item.product?.images[0]?.alt || item.productNameSnapshot,
        quantity: item.quantity,
        customization: customization.length ? customization : null,
      };
    }),
    delivery: {
      area: deliveryArea(order.notes),
      preferredDate: order.desiredDate?.toISOString() || null,
    },
    pricing: { baseSubtotal },
    statusHistory: history,
  };
}

export type PublicTrackingOrder = ReturnType<typeof serializePublicTrackingOrder>;
