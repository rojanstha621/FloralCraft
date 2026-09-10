import Image from "next/image";
import { ExternalLink, Instagram, Sparkles } from "lucide-react";
import type { InstagramStory } from "@/lib/instagram/client";

function StoryMedia({ story }: { story: InstagramStory }) {
  if (story.mediaType === "VIDEO") {
    return (
      <video
        className="instagram-story-media"
        poster={story.thumbnailUrl || undefined}
        controls
        muted
        playsInline
        preload="metadata"
        aria-label={story.caption || "Petal Craft Instagram Story video"}
      >
        <source src={story.mediaUrl} />
      </video>
    );
  }
  return (
    <Image
      src={story.mediaUrl}
      alt={story.caption || "A recent Petal Craft Instagram Story"}
      fill
      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 40vw, 23vw"
      className="instagram-story-media"
    />
  );
}

export function InstagramStoryShowcase({
  stories,
  instagramUrl,
}: {
  stories: InstagramStory[];
  instagramUrl: string;
}) {
  return (
    <section className="about-instagram-stories" aria-labelledby="instagram-stories-heading">
      <div className="about-instagram-heading">
        <div>
          <p className="about-instagram-kicker">
            <Instagram aria-hidden="true" /> From Instagram
          </p>
          <h2 id="instagram-stories-heading">Fresh from our studio—and your celebrations.</h2>
        </div>
        <p>
          Follow today&apos;s making moments and the pieces our community has shared with Petal
          Craft.
        </p>
      </div>

      {stories.length ? (
        <div className="instagram-story-rail" aria-label="Current Instagram Stories">
          {stories.map((story) => {
            const content = (
              <>
                <div className="instagram-story-frame">
                  <StoryMedia story={story} />
                  <span className="instagram-story-progress" aria-hidden="true" />
                  <span className="instagram-story-source">
                    {story.source === "studio" ? (
                      <>
                        <Instagram aria-hidden="true" /> Petal Craft
                      </>
                    ) : (
                      <>
                        <Sparkles aria-hidden="true" /> Shared with us
                      </>
                    )}
                  </span>
                </div>
                <div className="instagram-story-caption">
                  <strong>
                    {story.source === "studio"
                      ? "From the worktable"
                      : story.authorUsername
                        ? `@${story.authorUsername}`
                        : "From our community"}
                  </strong>
                  {story.caption && <span>{story.caption}</span>}
                </div>
              </>
            );
            return story.permalink ? (
              <a
                key={`${story.source}-${story.id}`}
                href={story.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-story-card"
                aria-label="Open this Story on Instagram"
              >
                {content}
              </a>
            ) : (
              <article key={`${story.source}-${story.id}`} className="instagram-story-card">
                {content}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="instagram-story-empty">
          <span aria-hidden="true">
            <Instagram />
          </span>
          <div>
            <h3>The day&apos;s stories live on Instagram.</h3>
            <p>
              See new commissions, worktable details, and pieces shared by the Petal Craft
              community.
            </p>
          </div>
        </div>
      )}

      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="about-instagram-link"
      >
        Visit Petal Craft on Instagram <ExternalLink aria-hidden="true" />
      </a>
    </section>
  );
}
