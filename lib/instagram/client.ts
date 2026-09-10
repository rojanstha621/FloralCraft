import "server-only";

const DEFAULT_VERSION = "v26.0";

export type InstagramStory = {
  id: string;
  source: "studio" | "community";
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string | null;
  caption: string | null;
  authorUsername: string | null;
  createdAt: Date;
  expiresAt: Date;
};

function apiVersion() {
  const configured = process.env.INSTAGRAM_API_VERSION?.trim();
  return configured && /^v\d+\.\d+$/.test(configured) ? configured : DEFAULT_VERSION;
}

export function instagramConfiguration() {
  return {
    userId: process.env.INSTAGRAM_USER_ID?.trim() || "",
    hasAccessToken: Boolean(process.env.INSTAGRAM_ACCESS_TOKEN?.trim()),
    hasAppSecret: Boolean(process.env.INSTAGRAM_APP_SECRET?.trim()),
    hasVerifyToken: Boolean(process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN?.trim()),
    apiVersion: apiVersion(),
  };
}

function safeMetaUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 4096) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    const allowed = ["instagram.com", "cdninstagram.com", "fbcdn.net"];
    return allowed.some((domain) => host === domain || host.endsWith(`.${domain}`))
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function stringOrNull(value: unknown, maximum = 1000): string | null {
  return typeof value === "string" && value.length <= maximum ? value : null;
}

export async function getOwnActiveStories(): Promise<InstagramStory[]> {
  const config = instagramConfiguration();
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!config.userId || !accessToken) return [];

  const endpoint = new URL(
    `https://graph.instagram.com/${config.apiVersion}/${encodeURIComponent(config.userId)}/stories`
  );
  endpoint.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username"
  );

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      console.warn("Instagram stories request failed", { status: response.status });
      return [];
    }
    const body = (await response.json()) as { data?: unknown };
    if (!Array.isArray(body.data)) return [];

    const now = Date.now();
    return body.data.flatMap((entry): InstagramStory[] => {
      if (!entry || typeof entry !== "object") return [];
      const record = entry as Record<string, unknown>;
      const id = stringOrNull(record.id, 200);
      const mediaUrl = safeMetaUrl(record.media_url);
      const timestamp = stringOrNull(record.timestamp, 80);
      const createdAt = timestamp ? new Date(timestamp) : new Date();
      if (!id || !mediaUrl || Number.isNaN(createdAt.getTime())) return [];
      const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
      if (expiresAt.getTime() <= now) return [];
      const mediaType = record.media_type === "VIDEO" ? "VIDEO" : "IMAGE";
      return [
        {
          id,
          source: "studio",
          mediaType,
          mediaUrl,
          thumbnailUrl: safeMetaUrl(record.thumbnail_url),
          permalink: safeMetaUrl(record.permalink),
          caption: stringOrNull(record.caption, 2200),
          authorUsername: stringOrNull(record.username, 100),
          createdAt,
          expiresAt,
        },
      ];
    });
  } catch {
    console.warn("Instagram stories request could not be completed");
    return [];
  }
}

export function isSafeInstagramMediaUrl(value: unknown): value is string {
  return safeMetaUrl(value) !== null;
}
