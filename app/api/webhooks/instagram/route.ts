import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import {
  storyMentionEvents,
  verifyInstagramChallengeToken,
  verifyInstagramWebhookSignature,
} from "@/lib/instagram/webhook";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");
  if (mode !== "subscribe" || !challenge || !verifyInstagramChallengeToken(token)) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  const declaredSize = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredSize) && declaredSize > 256 * 1024)
    return new NextResponse(null, { status: 413 });

  const bytes = Buffer.from(await request.arrayBuffer());
  if (bytes.byteLength > 256 * 1024) return new NextResponse(null, { status: 413 });
  if (!verifyInstagramWebhookSignature(bytes, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Not found", { status: 404 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(bytes.toString("utf8")) as unknown;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const now = new Date();
  const events = storyMentionEvents(payload).filter((event) => event.expiresAt > now);
  if (events.length) {
    try {
      await prisma.instagramStoryMention.createMany({
        data: events.map((event) => ({
          ...event,
          status: "PENDING" as const,
        })),
        skipDuplicates: true,
      });
    } catch {
      return new NextResponse(null, { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200, headers: { "Cache-Control": "no-store" } });
}
