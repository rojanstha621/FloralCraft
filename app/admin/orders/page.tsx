import Image from "next/image";
import { isRenderableImageUrl } from "@/lib/media/image-url";
import Link from "next/link";
import { ClipboardList, Mail, MessageCircle, Phone } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdminShell, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { AdminSubmitButton } from "@/components/admin/form-controls";
import { updateOrder } from "../actions";

const statuses = [
  "NEW",
  "CONTACTED",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;
const statusLabel = (status: string) =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());

export default async function AdminOrdersPage() {
  const session = await requireAdmin();
  const orders = await prisma.orderRequest.findMany({
    include: {
      items: {
        include: {
          product: {
            include: {
              category: { select: { name: true } },
              productType: { select: { name: true } },
              images: { orderBy: [{ primary: "desc" }, { sortOrder: "asc" }], take: 1 },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <AdminShell
      session={session}
      title="Order requests"
      description="Move every request from first contact to completion while keeping customer and product context together."
    >
      <div className="admin-order-counts">
        {statuses.map((status) => (
          <span key={status}>
            <strong>{orders.filter((order) => order.status === status).length}</strong>
            {statusLabel(status)}
          </span>
        ))}
      </div>
      {orders.length ? (
        <div className="admin-order-list">
          {orders.map((order) => {
            const baseTotal = order.items.reduce(
              (sum, item) => sum + Number(item.unitPriceSnapshot || 0) * item.quantity,
              0
            );
            const whatsappContext = `Hi, this is Petal Craft Florals regarding your order request ${order.requestNumber}.`;
            return (
              <article key={order.id} className="admin-card admin-order-card">
                <header>
                  <div>
                    <p>{order.requestNumber}</p>
                    <h2>{order.customerName}</h2>
                    <span>
                      Received {formatDate(order.createdAt)} · Preferred contact:{" "}
                      {statusLabel(order.preferredChannel)}
                    </span>
                  </div>
                  <span className={`admin-status admin-status-${order.status.toLowerCase()}`}>
                    {statusLabel(order.status)}
                  </span>
                </header>
                <div className="admin-contact-actions">
                  <a href={`tel:${order.customerPhone}`}>
                    <Phone aria-hidden="true" /> {order.customerPhone}
                  </a>
                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappContext)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle aria-hidden="true" /> WhatsApp
                  </a>
                  {order.customerEmail && (
                    <a href={`mailto:${order.customerEmail}`}>
                      <Mail aria-hidden="true" /> {order.customerEmail}
                    </a>
                  )}
                </div>
                <div className="admin-order-items">
                  {order.items.map((item) => {
                    const image = item.product?.images[0];
                    const unitPrice = item.unitPriceSnapshot
                      ? Number(item.unitPriceSnapshot)
                      : null;
                    return (
                      <div key={item.id} className="admin-order-item">
                        <div className="admin-order-image">
                          {image && isRenderableImageUrl(image.url) ? (
                            <Image
                              src={image.url}
                              alt={image.alt || item.productNameSnapshot}
                              fill
                              sizes="86px"
                              className="object-cover"
                            />
                          ) : (
                            <ClipboardList aria-hidden="true" />
                          )}
                        </div>
                        <div>
                          <div>
                            <h3>
                              {item.product ? (
                                <Link href={`/admin/products/${item.product.id}`}>
                                  {item.productNameSnapshot}
                                </Link>
                              ) : (
                                item.productNameSnapshot
                              )}
                            </h3>
                            <span>Quantity {item.quantity}</span>
                          </div>
                          {item.product ? (
                            <p>
                              {item.product.productType.name} · {item.product.category.name} ·{" "}
                              {item.product.available ? "Available" : "Currently unavailable"}
                            </p>
                          ) : (
                            <p className="is-warning">
                              The original product is no longer in the active catalog. The saved
                              order snapshot is shown.
                            </p>
                          )}
                          {item.customization && (
                            <dl>
                              {Object.entries(item.customization as Record<string, string>)
                                .filter(([, value]) => value)
                                .map(([key, value]) => (
                                  <div key={key}>
                                    <dt>{key.replaceAll("-", " ")}</dt>
                                    <dd>{value}</dd>
                                  </div>
                                ))}
                            </dl>
                          )}
                          {item.notes && (
                            <p>
                              <strong>Item note:</strong> {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="admin-order-price">
                          {unitPrice === null ? (
                            "Price to confirm"
                          ) : (
                            <>
                              <strong>{formatCurrency(unitPrice * item.quantity)}</strong>
                              <small>{formatCurrency(unitPrice)} each</small>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="admin-order-context">
                  <div>
                    <span>Preferred delivery date</span>
                    <strong>
                      {order.desiredDate
                        ? formatDate(order.desiredDate)
                        : "Flexible / not provided"}
                    </strong>
                  </div>
                  <div>
                    <span>Base subtotal</span>
                    <strong>{formatCurrency(baseTotal)}</strong>
                  </div>
                  {order.notes && (
                    <div className="admin-order-note">
                      <span>Delivery and customer note</span>
                      <pre>{order.notes}</pre>
                    </div>
                  )}
                </div>
                <form action={updateOrder} className="admin-order-update">
                  <input type="hidden" name="id" value={order.id} />
                  <label>
                    <span>Request status</span>
                    <select name="status" defaultValue={order.status} className={adminInput}>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Private studio notes</span>
                    <textarea
                      name="adminNotes"
                      maxLength={2000}
                      defaultValue={order.adminNotes || ""}
                      placeholder="Follow-up, deposit, timing, or production notes…"
                      className={adminTextarea}
                    />
                  </label>
                  <AdminSubmitButton pendingLabel="Updating request…">
                    Update request
                  </AdminSubmitButton>
                </form>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="admin-empty admin-card">
          <ClipboardList aria-hidden="true" />
          <h3>No order requests yet</h3>
          <p>Structured website requests will appear here.</p>
        </div>
      )}
    </AdminShell>
  );
}
