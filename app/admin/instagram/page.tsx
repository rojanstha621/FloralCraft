import Image from "next/image";
import { Clock3, Instagram, ShieldCheck, Trash2 } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { formatDate } from "@/lib/utils";
import { instagramConfiguration } from "@/lib/instagram/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmButton } from "@/components/admin/form-controls";
import { deleteInstagramMention, moderateInstagramMention } from "../actions";

export default async function AdminInstagramPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireAdmin();
  const query = await searchParams;
  const config = instagramConfiguration();
  const mentions = await prisma.instagramStoryMention.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const now = new Date();
  const counts = {
    pending: mentions.filter((mention) => mention.status === "PENDING" && mention.expiresAt > now)
      .length,
    live: mentions.filter((mention) => mention.status === "APPROVED" && mention.expiresAt > now)
      .length,
    expired: mentions.filter((mention) => mention.expiresAt <= now).length,
  };

  return (
    <AdminShell
      session={session}
      title="Instagram stories"
      description="Review follower Story mentions before they appear on the About page. Petal Craft's own active Stories appear automatically."
      notice={query.notice}
    >
      <section className="admin-card admin-instagram-config" aria-label="Instagram connection">
        <div>
          <span className="admin-login-mark">
            <Instagram aria-hidden="true" />
          </span>
          <div>
            <h2>Meta connection</h2>
            <p>
              {config.userId && config.hasAccessToken
                ? "Live Story reading is configured."
                : "Add the Instagram user ID and access token to show your active Stories."}
            </p>
          </div>
        </div>
        <div className="admin-config-checks">
          <span className={config.userId && config.hasAccessToken ? "is-ready" : ""}>
            {config.userId && config.hasAccessToken ? "Ready" : "Needs configuration"} · Stories
          </span>
          <span className={config.hasAppSecret && config.hasVerifyToken ? "is-ready" : ""}>
            {config.hasAppSecret && config.hasVerifyToken ? "Ready" : "Needs configuration"} ·
            Mentions webhook
          </span>
        </div>
      </section>

      <div className="admin-review-counts">
        <span>
          <strong>{counts.pending}</strong> Awaiting review
        </span>
        <span>
          <strong>{counts.live}</strong> Live now
        </span>
        <span>
          <strong>{counts.expired}</strong> Expired
        </span>
      </div>

      {mentions.length ? (
        <div className="admin-instagram-grid">
          {mentions.map((mention) => {
            const expired = mention.expiresAt <= now;
            return (
              <article key={mention.id} className="admin-card admin-instagram-mention">
                <div className="admin-instagram-preview">
                  {mention.mediaType === "VIDEO" ? (
                    <video src={mention.mediaUrl} muted controls playsInline preload="metadata" />
                  ) : (
                    <Image
                      src={mention.mediaUrl}
                      alt="Follower Story mentioning Petal Craft"
                      fill
                      sizes="(max-width: 700px) 100vw, 320px"
                    />
                  )}
                  <span
                    className={`admin-status admin-status-${expired ? "hidden" : mention.status.toLowerCase()}`}
                  >
                    {expired ? "EXPIRED" : mention.status}
                  </span>
                </div>
                <div className="admin-instagram-body">
                  <div>
                    <h2>
                      {mention.authorUsername ? `@${mention.authorUsername}` : "Community Story"}
                    </h2>
                    <p>
                      <Clock3 aria-hidden="true" /> Received {formatDate(mention.storyCreatedAt)}
                    </p>
                    <small>Available until {formatDate(mention.expiresAt)}</small>
                  </div>
                  {!expired && (
                    <form action={moderateInstagramMention} className="admin-instagram-actions">
                      <input type="hidden" name="id" value={mention.id} />
                      <button
                        name="status"
                        value="APPROVED"
                        disabled={mention.status === "APPROVED"}
                      >
                        <ShieldCheck aria-hidden="true" /> Approve
                      </button>
                      <button name="status" value="HIDDEN" disabled={mention.status === "HIDDEN"}>
                        Hide
                      </button>
                    </form>
                  )}
                  <form action={deleteInstagramMention}>
                    <input type="hidden" name="id" value={mention.id} />
                    <ConfirmButton
                      message="Remove this Instagram Story mention from Petal Craft?"
                      className="admin-danger-button"
                    >
                      <Trash2 aria-hidden="true" /> Remove
                    </ConfirmButton>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="admin-empty admin-card">
          <Instagram aria-hidden="true" />
          <h3>No follower Story mentions received</h3>
          <p>Signed Meta webhook events will appear here for approval.</p>
        </div>
      )}
    </AdminShell>
  );
}
