import { MessageSquareText, ShieldCheck, Trash2 } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { formatDate } from "@/lib/utils";
import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmButton } from "@/components/admin/form-controls";
import { deleteReview, moderateReview } from "../actions";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireAdmin();
  const query = await searchParams;
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: [{ status: "desc" }, { createdAt: "desc" }],
  });
  const counts = {
    pending: reviews.filter((review) => review.status === "PENDING").length,
    approved: reviews.filter((review) => review.status === "APPROVED").length,
    hidden: reviews.filter((review) => review.status === "HIDDEN").length,
  };
  return (
    <AdminShell
      session={session}
      title="Reviews"
      description="Approve genuine customer stories before they become visible on the public website."
      notice={query.notice}
    >
      <div className="admin-review-counts">
        <span>
          <strong>{counts.pending}</strong> Pending
        </span>
        <span>
          <strong>{counts.approved}</strong> Approved
        </span>
        <span>
          <strong>{counts.hidden}</strong> Hidden
        </span>
      </div>
      {reviews.length ? (
        <div className="admin-review-list">
          {reviews.map((review) => (
            <article key={review.id} className="admin-card admin-review-card">
              <div className="admin-review-head">
                <div>
                  <p aria-label={`${review.rating} out of 5 stars`}>
                    {"★".repeat(review.rating)}
                    <span>{"☆".repeat(5 - review.rating)}</span>
                  </p>
                  <h2>{review.reviewerName}</h2>
                  <small>
                    on{" "}
                    <a href={`/products/${review.product.slug}`} target="_blank">
                      {review.product.name}
                    </a>{" "}
                    · {formatDate(review.createdAt)}
                  </small>
                </div>
                <span className={`admin-status admin-status-${review.status.toLowerCase()}`}>
                  {review.status}
                </span>
              </div>
              <blockquote>{review.body}</blockquote>
              {review.verified && (
                <p className="admin-verified">
                  <ShieldCheck aria-hidden="true" /> Verified customer
                </p>
              )}
              <div className="admin-review-actions">
                <form action={moderateReview}>
                  <input type="hidden" name="id" value={review.id} />
                  <button name="status" value="APPROVED" disabled={review.status === "APPROVED"}>
                    Approve
                  </button>
                  <button name="status" value="HIDDEN" disabled={review.status === "HIDDEN"}>
                    Hide / reject
                  </button>
                  <button name="status" value="PENDING" disabled={review.status === "PENDING"}>
                    Return to pending
                  </button>
                </form>
                <form action={deleteReview}>
                  <input type="hidden" name="id" value={review.id} />
                  <ConfirmButton
                    message={`Permanently delete ${review.reviewerName}'s review? This cannot be undone.`}
                    className="admin-danger-button"
                  >
                    <Trash2 aria-hidden="true" /> Delete
                  </ConfirmButton>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-empty admin-card">
          <MessageSquareText aria-hidden="true" />
          <h3>No reviews submitted</h3>
          <p>Customer reviews will appear here for moderation.</p>
        </div>
      )}
    </AdminShell>
  );
}
