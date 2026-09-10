import "server-only";

import { createHash, randomBytes } from "node:crypto";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function generateTrackingToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashTrackingToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function isValidTrackingToken(token: string): boolean {
  return TOKEN_PATTERN.test(token);
}
