import "server-only";

import type { OrderRequestStatus } from "@prisma/client";
import prisma from "@/lib/db/prisma";
import { canTransitionOrder } from "@/lib/orders/status";
import { attemptWhatsAppNotification } from "@/lib/whatsapp/cloud-api";
import { normalizeWhatsAppRecipient } from "@/lib/whatsapp/phone";
import { whatsappTemplateFor } from "@/lib/whatsapp/templates";

export async function updateOrderStatus({
  orderId,
  status,
  adminNotes,
  adminId,
}: {
  orderId: string;
  status: OrderRequestStatus;
  adminNotes: string | null;
  adminId: string;
}) {
  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.orderRequest.findUniqueOrThrow({
      where: { id: orderId },
      select: { id: true, status: true, customerPhone: true, whatsappOptInAt: true },
    });
    if (current.status === status) {
      await tx.orderRequest.update({ where: { id: orderId }, data: { adminNotes } });
      return { changed: false, notificationId: null };
    }
    if (!canTransitionOrder(current.status, status)) {
      throw new Error(`The order cannot move from ${current.status} to ${status}.`);
    }
    const claimed = await tx.orderRequest.updateMany({
      where: { id: orderId, status: current.status },
      data: {
        status,
        adminNotes,
        ...(status === "CONTACTED" ? { contactedAt: new Date() } : {}),
      },
    });
    if (claimed.count !== 1) throw new Error("The order changed elsewhere. Reload and try again.");
    const history = await tx.orderStatusHistory.create({
      data: {
        orderRequestId: orderId,
        previousStatus: current.status,
        newStatus: status,
        changedByAdminId: adminId,
      },
    });
    const recipient = current.whatsappOptInAt
      ? normalizeWhatsAppRecipient(current.customerPhone)
      : null;
    if (!recipient) return { changed: true, notificationId: null };
    const template = whatsappTemplateFor("ORDER_STATUS_CHANGED", status);
    const notification = await tx.orderNotification.create({
      data: {
        orderRequestId: orderId,
        statusHistoryId: history.id,
        channel: "WHATSAPP",
        eventType: template.eventType,
        orderStatus: status,
        recipient,
        templateName: template.templateName,
        templateLanguage: template.language,
        deduplicationKey: `${orderId}:${status}`,
      },
      select: { id: true },
    });
    return { changed: true, notificationId: notification.id };
  });
  const delivery = result.notificationId
    ? await attemptWhatsAppNotification(result.notificationId)
    : null;
  return { ...result, delivery };
}
