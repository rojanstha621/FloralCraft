import "server-only";

import { randomBytes } from "node:crypto";

export function createOrderReference(now = new Date()): string {
  const year = String(now.getUTCFullYear()).slice(-2);
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `PC-${year}-${suffix}`;
}
