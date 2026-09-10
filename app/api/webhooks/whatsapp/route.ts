import { NextRequest, NextResponse } from "next/server";
import type { OrderNotificationDeliveryStatus, Prisma } from "@prisma/client";
import prisma from "@/lib/db/prisma";
import {
  verifyWebhookChallengeToken,
  verifyWhatsAppWebhookSignature,
} from "@/lib/whatsapp/webhook";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");
  if (mode !== "subscribe" || !challenge || !verifyWebhookChallengeToken(token)) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
  });
}

type WebhookStatus = {
  id?: unknown;
  status?: unknown;
  timestamp?: unknown;
  errors?: Array<{ code?: unknown; title?: unknown }>;
};

function statusEvents(payload: unknown): WebhookStatus[] {
  if (!payload || typeof payload !== "object") return [];
  const entries = (payload as { entry?: unknown }).entry;
  if (!Array.isArray(entries)) return [];
  return entries.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const changes = (entry as { changes?: unknown }).changes;
    if (!Array.isArray(changes)) return [];
    return changes.flatMap((change) => {
      if (!change || typeof change !== "object") return [];
      const value = (change as { value?: unknown }).value;
      if (!value || typeof value !== "object") return [];
      const statuses = (value as { statuses?: unknown }).statuses;
      return Array.isArray(statuses) ? (statuses as WebhookStatus[]) : [];
    });
  });
}

const RANK: Partial<Record<OrderNotificationDeliveryStatus, number>> = {
  SENT: 1,
  DELIVERED: 2,
  READ: 3,
};

export async function POST(request: NextRequest) {
  const bytes = Buffer.from(await request.arrayBuffer());
  if (bytes.byteLength > 256 * 1024) return new NextResponse(null, { status: 413 });
  if (!verifyWhatsAppWebhookSignature(bytes, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Not found", { status: 404 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(bytes.toString("utf8"));
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  for (const event of statusEvents(payload)) {
    const providerMessageId = typeof event.id === "string" ? event.id : "";
    const providerStatus = typeof event.status === "string" ? event.status : "";
    if (!providerMessageId) continue;
    const current = await prisma.orderNotification.findUnique({
      where: { providerMessageId },
      select: { id: true, deliveryStatus: true },
    });
    if (!current) continue;

    const now = new Date();
    let data: Prisma.OrderNotificationUpdateInput | null = null;
    if (providerStatus === "failed") {
      const firstError = event.errors?.[0];
      data = {
        deliveryStatus: "FAILED",
        failedAt: now,
        lastError: `${String(firstError?.code || "delivery_failed").slice(0, 80)}: ${String(firstError?.title || "WhatsApp delivery failed.").slice(0, 400)}`,
      };
    } else if (["sent", "delivered", "read"].includes(providerStatus)) {
      const next = providerStatus.toUpperCase() as OrderNotificationDeliveryStatus;
      if ((RANK[next] || 0) <= (RANK[current.deliveryStatus] || 0)) continue;
      data = {
        deliveryStatus: next,
        ...(next === "SENT" ? { sentAt: now } : {}),
        ...(next === "DELIVERED" ? { deliveredAt: now } : {}),
        ...(next === "READ" ? { readAt: now } : {}),
      };
    }
    if (data) await prisma.orderNotification.update({ where: { id: current.id }, data });
  }
  return new NextResponse(null, { status: 200, headers: { "Cache-Control": "no-store" } });
}
