import "server-only";

import { verifyMetaChallengeToken, verifyMetaSignature } from "@/lib/meta/webhook";
import { isSafeInstagramMediaUrl } from "@/lib/instagram/client";

export function verifyInstagramWebhookSignature(body: Buffer, signature: string | null) {
  return verifyMetaSignature(body, signature, process.env.INSTAGRAM_APP_SECRET);
}

export function verifyInstagramChallengeToken(received: string | null) {
  return verifyMetaChallengeToken(received, process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN);
}

export type InstagramMentionEvent = {
  webhookMessageId: string;
  senderScopedId: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  storyCreatedAt: Date;
  expiresAt: Date;
};

function inferMediaType(url: string): "IMAGE" | "VIDEO" {
  const lower = url.toLowerCase();
  return lower.includes(".mp4") || lower.includes("video") ? "VIDEO" : "IMAGE";
}

export function storyMentionEvents(payload: unknown): InstagramMentionEvent[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as { object?: unknown; entry?: unknown };
  if (root.object !== "instagram" || !Array.isArray(root.entry)) return [];
  const configuredUserId = process.env.INSTAGRAM_USER_ID?.trim();

  return root.entry.flatMap((entry): InstagramMentionEvent[] => {
    if (!entry || typeof entry !== "object") return [];
    const entryRecord = entry as { id?: unknown; messaging?: unknown };
    if (configuredUserId && entryRecord.id !== configuredUserId) return [];
    if (!Array.isArray(entryRecord.messaging)) return [];

    return entryRecord.messaging.flatMap((message): InstagramMentionEvent[] => {
      if (!message || typeof message !== "object") return [];
      const record = message as Record<string, unknown>;
      const sender = record.sender as { id?: unknown } | undefined;
      const recipient = record.recipient as { id?: unknown } | undefined;
      const messageBody = record.message as { mid?: unknown; attachments?: unknown } | undefined;
      if (
        typeof sender?.id !== "string" ||
        sender.id.length > 200 ||
        (configuredUserId && recipient?.id !== configuredUserId) ||
        typeof messageBody?.mid !== "string" ||
        messageBody.mid.length > 300 ||
        !Array.isArray(messageBody.attachments)
      )
        return [];

      const timestamp =
        typeof record.timestamp === "number" && Number.isFinite(record.timestamp)
          ? new Date(record.timestamp)
          : new Date();
      if (Number.isNaN(timestamp.getTime())) return [];
      const senderScopedId = sender.id;

      return messageBody.attachments.flatMap((attachment, index): InstagramMentionEvent[] => {
        if (!attachment || typeof attachment !== "object") return [];
        const item = attachment as { type?: unknown; payload?: unknown };
        if (item.type !== "story_mention" || !item.payload || typeof item.payload !== "object")
          return [];
        const url = (item.payload as { url?: unknown }).url;
        if (!isSafeInstagramMediaUrl(url)) return [];
        return [
          {
            webhookMessageId: `${messageBody.mid}:${index}`,
            senderScopedId,
            mediaType: inferMediaType(url),
            mediaUrl: url,
            storyCreatedAt: timestamp,
            expiresAt: new Date(timestamp.getTime() + 24 * 60 * 60 * 1000),
          },
        ];
      });
    });
  });
}
