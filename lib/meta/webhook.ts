import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyMetaSignature(
  body: Buffer,
  signature: string | null,
  appSecret: string | undefined
): boolean {
  if (!appSecret || !signature?.startsWith("sha256=")) return false;
  const receivedHex = signature.slice(7);
  if (!/^[a-f0-9]{64}$/i.test(receivedHex)) return false;
  const expected = createHmac("sha256", appSecret).update(body).digest();
  const received = Buffer.from(receivedHex, "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function verifyMetaChallengeToken(
  received: string | null,
  configuredToken: string | undefined
): boolean {
  if (!configuredToken || !received) return false;
  const expected = Buffer.from(configuredToken);
  const candidate = Buffer.from(received);
  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}
