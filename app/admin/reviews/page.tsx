import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { formatDate } from "@/lib/utils";
import { AdminShell, adminCard } from "@/components/admin/admin-shell";
import { moderateReview } from "../actions";

export default async function AdminReviewsPage() {
  const session = await requireAdmin();
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true } } },
    orderBy: [{ status: "desc" }, { createdAt: "desc" }],
  });
  return (
    <AdminShell
      session={session}
      title="Reviews"
      description="Approve genuine customer stories before they appear publicly."
    >
      <div className="grid gap-4">
        {reviews.length ? (
          reviews.map((review) => (
            <article key={review.id} className={adminCard}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-brand-sage-700">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                  <h2 className="mt-2 font-serif text-xl font-semibold">
                    {review.reviewerName}{" "}
                    <span className="text-sm font-normal text-brand-brown-400">
                      on {review.product.name}
                    </span>
                  </h2>
                  <p className="mt-1 text-xs text-brand-brown-400">
                    {formatDate(review.createdAt)} · {review.status}
                  </p>
                </div>
                <form action={moderateReview} className="flex gap-2">
                  <input type="hidden" name="id" value={review.id} />
                  <button
                    name="status"
                    value="APPROVED"
                    className="rounded-lg bg-brand-sage-700 px-3 py-2 text-xs font-bold text-white"
                  >
                    Approve
                  </button>
                  <button
                    name="status"
                    value="HIDDEN"
                    className="rounded-lg border px-3 py-2 text-xs font-bold"
                  >
                    Hide
                  </button>
                </form>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-brand-brown-600">{review.body}</p>
            </article>
          ))
        ) : (
          <p className={`${adminCard} text-sm text-brand-brown-500`}>
            No reviews have been submitted.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
