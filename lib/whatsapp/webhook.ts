import "server-only";

import { verifyMetaChallengeToken, verifyMetaSignature } from "@/lib/meta/webhook";

export function verifyWhatsAppWebhookSignature(body: Buffer, signature: string | null): boolean {
  return verifyMetaSignature(body, signature, process.env.WHATSAPP_APP_SECRET);
}

export function verifyWebhookChallengeToken(received: string | null): boolean {
  return verifyMetaChallengeToken(received, process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN);
}
