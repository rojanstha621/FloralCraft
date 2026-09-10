import "server-only";

import prisma from "@/lib/db/prisma";

type WhatsAppConfiguration = {
  accessToken: string;
  phoneNumberId: string;
  apiVersion: string;
};

function configuration(): WhatsAppConfiguration | null {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const apiVersion = process.env.WHATSAPP_API_VERSION?.trim();
  if (!accessToken || !phoneNumberId || !apiVersion) return null;
  if (!/^v\d+\.\d+$/.test(apiVersion) || !/^\d+$/.test(phoneNumberId)) return null;
  return { accessToken, phoneNumberId, apiVersion };
}

export function whatsappCloudApiStatus() {
  return {
    configured: Boolean(configuration()),
    webhookConfigured: Boolean(
      process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN && process.env.WHATSAPP_APP_SECRET
    ),
  };
}

function safeProviderError(payload: unknown): { code: string; message: string } {
  if (!payload || typeof payload !== "object") {
    return { code: "provider_error", message: "WhatsApp rejected the notification." };
  }
  const error = (payload as { error?: unknown }).error;
  if (!error || typeof error !== "object") {
    return { code: "provider_error", message: "WhatsApp rejected the notification." };
  }
  const code = String((error as { code?: unknown }).code || "provider_error").slice(0, 80);
  const message = String(
    (error as { message?: unknown }).message || "WhatsApp rejected the notification."
  )
    .replace(/[\r\n]+/g, " ")
    .slice(0, 400);
  return { code, message };
}

export async function attemptWhatsAppNotification(notificationId: string) {
  const claimed = await prisma.orderNotification.updateMany({
    where: {
      id: notificationId,
      deliveryStatus: { in: ["PENDING", "FAILED"] },
      attemptCount: { lt: 5 },
    },
    data: {
      deliveryStatus: "PROCESSING",
      attemptCount: { increment: 1 },
      lastAttemptAt: new Date(),
      lastError: null,
    },
  });
  if (!claimed.count) return { attempted: false as const };

  const notification = await prisma.orderNotification.findUnique({
    where: { id: notificationId },
    select: {
      id: true,
      recipient: true,
      templateName: true,
      templateLanguage: true,
      orderRequest: { select: { requestNumber: true } },
    },
  });
  if (!notification) return { attempted: false as const };
  if (!notification.recipient || !notification.templateName || !notification.templateLanguage) {
    await prisma.orderNotification.update({
      where: { id: notification.id },
      data: {
        deliveryStatus: "FAILED",
        failedAt: new Date(),
        lastError: "Notification configuration is incomplete.",
      },
    });
    return { attempted: true as const, accepted: false as const, reason: "invalid_record" };
  }

  const config = configuration();
  if (!config) {
    await prisma.orderNotification.update({
      where: { id: notification.id },
      data: {
        deliveryStatus: "FAILED",
        failedAt: new Date(),
        lastError: "WhatsApp Cloud API is not configured.",
      },
    });
    return { attempted: true as const, accepted: false as const, reason: "not_configured" };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: notification.recipient,
          type: "template",
          template: {
            name: notification.templateName,
            language: { code: notification.templateLanguage },
            components: [
              {
                type: "body",
                parameters: [{ type: "text", text: notification.orderRequest.requestNumber }],
              },
            ],
          },
        }),
        signal: AbortSignal.timeout(10_000),
      }
    );
    const payload = (await response.json().catch(() => null)) as {
      messages?: Array<{ id?: string }>;
    } | null;
    const providerMessageId = payload?.messages?.[0]?.id;
    if (!response.ok || !providerMessageId) {
      const failure = safeProviderError(payload);
      await prisma.orderNotification.update({
        where: { id: notification.id },
        data: {
          deliveryStatus: "FAILED",
          failedAt: new Date(),
          lastError: `${failure.code}: ${failure.message}`,
        },
      });
      return { attempted: true as const, accepted: false as const, reason: failure.code };
    }
    await prisma.orderNotification.update({
      where: { id: notification.id },
      data: {
        deliveryStatus: "SENT",
        providerMessageId,
        sentAt: new Date(),
        processedAt: new Date(),
        failedAt: null,
      },
    });
    return { attempted: true as const, accepted: true as const };
  } catch {
    await prisma.orderNotification.update({
      where: { id: notification.id },
      data: {
        deliveryStatus: "FAILED",
        failedAt: new Date(),
        lastError: "network_error: WhatsApp could not be reached. The notification can be retried.",
      },
    });
    return { attempted: true as const, accepted: false as const, reason: "network_error" };
  }
}
