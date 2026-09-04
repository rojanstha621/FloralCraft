import "server-only";

type Entry = { timestamps: number[]; lastSeen: number };
const buckets = new Map<string, Entry>();
const MAX_BUCKETS = 10_000;

export function clientAddress(request: Request): string {
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  for (const [bucketKey, entry] of buckets) {
    entry.timestamps = entry.timestamps.filter((time) => now - time < windowMs);
    if (!entry.timestamps.length) buckets.delete(bucketKey);
  }
  const entry = buckets.get(key) ?? { timestamps: [], lastSeen: now };
  entry.lastSeen = now;
  if (entry.timestamps.length >= limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((windowMs - (now - entry.timestamps[0])) / 1000)),
    };
  }
  entry.timestamps.push(now);
  buckets.set(key, entry);
  if (buckets.size > MAX_BUCKETS) {
    const oldest = [...buckets.entries()].sort((a, b) => a[1].lastSeen - b[1].lastSeen)[0];
    if (oldest) buckets.delete(oldest[0]);
  }
  return { allowed: true, retryAfter: 0 };
}
