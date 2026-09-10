import Image from "next/image";
import { CalendarDays, Flower2, MapPin } from "lucide-react";
import { isRenderableImageUrl } from "@/lib/media/image-url";
import type { PublicTrackingOrder } from "@/lib/orders/public-tracking";
import { formatCurrency } from "@/lib/utils";

export function OrderTrackingSummary({ order }: { order: PublicTrackingOrder }) {
  return (
    <aside className="track-summary" aria-labelledby="track-summary-title">
      <p className="track-eyebrow">Your request</p>
      <h2 id="track-summary-title">Order details</h2>
      <div className="track-items">
        {order.items.map((item, index) => (
          <article key={`${item.name}-${index}`} className="track-item">
            <div className="track-item-image">
              {item.imageUrl && isRenderableImageUrl(item.imageUrl) ? (
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 767px) 96px, 144px"
                />
              ) : (
                <Flower2 aria-hidden="true" />
              )}
            </div>
            <div>
              <span>Quantity {item.quantity}</span>
              <h3>{item.name}</h3>
              {item.customization && (
                <ul aria-label="Personalisation details">
                  {item.customization.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
      <dl className="track-details">
        <div>
          <dt>
            <MapPin aria-hidden="true" /> Delivery area
          </dt>
          <dd>{order.delivery.area || "To be confirmed with the studio"}</dd>
        </div>
        <div>
          <dt>
            <CalendarDays aria-hidden="true" /> Preferred date
          </dt>
          <dd>
            {order.delivery.preferredDate
              ? new Intl.DateTimeFormat("en-NP", { dateStyle: "long" }).format(
                  new Date(order.delivery.preferredDate)
                )
              : "Flexible / not provided"}
          </dd>
        </div>
        <div className="track-price">
          <dt>Base subtotal</dt>
          <dd>
            {order.pricing.baseSubtotal === null
              ? "To be confirmed"
              : formatCurrency(order.pricing.baseSubtotal)}
          </dd>
          <p>Custom work and delivery may affect the final confirmed price.</p>
        </div>
      </dl>
    </aside>
  );
}
