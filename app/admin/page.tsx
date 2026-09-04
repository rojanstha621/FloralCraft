import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminPage() {
  const session = await requireAdmin();
  const [
    totalProducts,
    availableProducts,
    featuredProducts,
    pendingReviews,
    totalOrders,
    latestOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { archivedAt: null } }),
    prisma.product.count({ where: { archivedAt: null, available: true } }),
    prisma.product.count({ where: { archivedAt: null, featured: true } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.orderRequest.count(),
    prisma.orderRequest.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);
  const cards = [
    ["Total products", totalProducts, "/admin/products", Boxes],
    ["Available", availableProducts, "/admin/products", CheckCircle2],
    ["Featured", featuredProducts, "/admin/products", Sparkles],
    ["Pending reviews", pendingReviews, "/admin/reviews", MessageSquareText],
    ["Order requests", totalOrders, "/admin/orders", ClipboardList],
  ] as const;

  return (
    <AdminShell
      session={session}
      title="Studio overview"
      description="The essentials for your catalog, customer requests, and public content—at a glance."
    >
      <section className="admin-metric-grid" aria-label="Store summary">
        {cards.map(([label, value, href, Icon]) => (
          <Link key={label} href={href} className="admin-metric-card">
            <div>
              <Icon aria-hidden="true" />
              <ArrowRight aria-hidden="true" />
            </div>
            <span>{label}</span>
            <strong>{value}</strong>
          </Link>
        ))}
      </section>
      <section className="admin-card admin-recent-orders">
        <div className="admin-section-heading">
          <div>
            <p>Customer activity</p>
            <h2>Recent order requests</h2>
          </div>
          <Link href="/admin/orders">
            View every request <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        {latestOrders.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Request</th>
                  <th>Base value</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.map((order) => {
                  const total = order.items.reduce(
                    (sum, item) => sum + Number(item.unitPriceSnapshot || 0) * item.quantity,
                    0
                  );
                  return (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.requestNumber}</strong>
                      </td>
                      <td>
                        {order.customerName}
                        <small>{order.customerPhone}</small>
                      </td>
                      <td>
                        {order.items
                          .map((item) => `${item.quantity}× ${item.productNameSnapshot}`)
                          .join(", ")}
                      </td>
                      <td>{formatCurrency(total)}</td>
                      <td>
                        <span className={`admin-status admin-status-${order.status.toLowerCase()}`}>
                          {order.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <ClipboardList aria-hidden="true" />
            <h3>No order requests yet</h3>
            <p>New website requests will appear here.</p>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
