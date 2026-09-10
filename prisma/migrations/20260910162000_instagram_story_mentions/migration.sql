CREATE TYPE "InstagramMentionStatus" AS ENUM ('PENDING', 'APPROVED', 'HIDDEN');
CREATE TYPE "InstagramMediaType" AS ENUM ('IMAGE', 'VIDEO');

CREATE TABLE "InstagramStoryMention" (
    "id" TEXT NOT NULL,
    "webhookMessageId" TEXT NOT NULL,
    "senderScopedId" TEXT NOT NULL,
    "authorUsername" TEXT,
    "mediaType" "InstagramMediaType" NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "status" "InstagramMentionStatus" NOT NULL DEFAULT 'PENDING',
    "storyCreatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramStoryMention_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InstagramStoryMention_webhookMessageId_key" ON "InstagramStoryMention"("webhookMessageId");
CREATE INDEX "InstagramStoryMention_status_expiresAt_idx" ON "InstagramStoryMention"("status", "expiresAt");
CREATE INDEX "InstagramStoryMention_createdAt_idx" ON "InstagramStoryMention"("createdAt");
