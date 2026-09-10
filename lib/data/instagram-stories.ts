import "server-only";

import prisma from "@/lib/db/prisma";
import { getOwnActiveStories, type InstagramStory } from "@/lib/instagram/client";

export async function getInstagramStoryShowcase(): Promise<InstagramStory[]> {
  const [studioStories, communityStories] = await Promise.all([
    getOwnActiveStories(),
    prisma.instagramStoryMention.findMany({
      where: { status: "APPROVED", expiresAt: { gt: new Date() } },
      orderBy: { storyCreatedAt: "desc" },
      take: 8,
      select: {
        id: true,
        authorUsername: true,
        mediaType: true,
        mediaUrl: true,
        storyCreatedAt: true,
        expiresAt: true,
      },
    }),
  ]);

  return [
    ...studioStories,
    ...communityStories.map((story): InstagramStory => ({
      id: story.id,
      source: "community",
      mediaType: story.mediaType,
      mediaUrl: story.mediaUrl,
      thumbnailUrl: null,
      permalink: null,
      caption: null,
      authorUsername: story.authorUsername,
      createdAt: story.storyCreatedAt,
      expiresAt: story.expiresAt,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);
}
