import Image from "next/image";
import { isRenderableImageUrl } from "@/lib/media/image-url";
import Link from "next/link";
import { ClipboardList, Mail, MessageCircle, Phone } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdminShell, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { ConfirmButton } from "@/components/admin/form-controls";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, nextOrderStatuses } from "@/lib/orders/status";
import { whatsappCloudApiStatus } from "@/lib/whatsapp/cloud-api";
import { retryOrderNotification, updateOrder } from "../actions";

const statusLabel = (status: string) =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireAdmin();
  const { notice } = await searchParams;
  const whatsapp = whatsappCloudApiStatus();
  const orders = await prisma.orderRequest.findMany({
    include: {
      statusHistory: { orderBy: { createdAt: "desc" } },
      notifications: { orderBy: { createdAt: "desc" } },
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
      notice={notice}
    >
      <div className={`admin-storage-status ${whatsapp.configured ? "is-ready" : "is-missing"}`}>
        <MessageCircle aria-hidden="true" />
        <div>
          <strong>
            {whatsapp.configured
              ? "WhatsApp Cloud API connected"
              : "WhatsApp automation needs configuration"}
          </strong>
          <p>
            {whatsapp.configured
              ? "Status updates use controlled, approved Meta templates."
              : "Orders remain authoritative; notification attempts are recorded as failed until Cloud API credentials and templates are configured."}
          </p>
        </div>
      </div>
      <div className="admin-order-counts">
        {ORDER_STATUSES.map((status) => (
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
                <div className="admin-order-audit">
                  <section>
                    <h3>Status history</h3>
                    {order.statusHistory.length ? (
                      <ol>
                        {order.statusHistory.map((entry) => (
                          <li key={entry.id}>
                            <strong>{ORDER_STATUS_LABELS[entry.newStatus]}</strong>
                            <span>{formatDate(entry.createdAt)}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>No recorded history for this legacy order.</p>
                    )}
                  </section>
                  <section>
                    <h3>WhatsApp notifications</h3>
                    {order.notifications.length ? (
                      <ol>
                        {order.notifications.map((notification) => (
                          <li key={notification.id}>
                            <div>
                              <strong>
                                {notification.orderStatus
                                  ? ORDER_STATUS_LABELS[notification.orderStatus]
                                  : "Order update"}
                              </strong>
                              <span>
                                {statusLabel(notification.deliveryStatus)} ·{" "}
                                {formatDate(notification.createdAt)}
                              </span>
                              {notification.lastError && <small>{notification.lastError}</small>}
                            </div>
                            {["FAILED", "PENDING"].includes(notification.deliveryStatus) &&
                              notification.attemptCount < 5 && (
                                <form action={retryOrderNotification}>
                                  <input
                                    type="hidden"
                                    name="notificationId"
                                    value={notification.id}
                                  />
                                  <ConfirmButton
                                    message="Retry this controlled WhatsApp template now?"
                                    className="admin-secondary-button"
                                  >
                                    Retry
                                  </ConfirmButton>
                                </form>
                              )}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>No WhatsApp notifications recorded.</p>
                    )}
                  </section>
                </div>
                <form action={updateOrder} className="admin-order-update">
                  <input type="hidden" name="id" value={order.id} />
                  <label>
                    <span>Request status</span>
                    <select name="status" defaultValue={order.status} className={adminInput}>
                      {nextOrderStatuses(order.status).map((status) => (
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
                  <p className="admin-order-notification-note">
                    A status change queues one server-controlled WhatsApp template. Saving the same
                    status only updates private notes.
                  </p>
                  <ConfirmButton
                    message={`Current status: ${ORDER_STATUS_LABELS[order.status]}. Continue with this update? A WhatsApp notification will be attempted only if the status changes.`}
                    className="admin-primary-button"
                  >
                    Update request
                  </ConfirmButton>
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
