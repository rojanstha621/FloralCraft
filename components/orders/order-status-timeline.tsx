import { Check, Flower2, X } from "lucide-react";
import type { OrderRequestStatus } from "@prisma/client";
import { ORDER_STATUS_LABELS } from "@/lib/orders/status";

type History = Array<{
  status: { code: OrderRequestStatus; label: string };
  createdAt: string;
}>;

const stages: Exclude<OrderRequestStatus, "CANCELLED">[] = [
  "NEW",
  "CONTACTED",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
];

function formatMoment(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-NP", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function OrderStatusTimeline({
  status,
  history,
}: {
  status: OrderRequestStatus;
  history: History;
}) {
  const cancelled = status === "CANCELLED";
  const moments = new Map<OrderRequestStatus, string>();
  for (const entry of history) moments.set(entry.status.code, entry.createdAt);
  const lastProgress = [...history].reverse().find((entry) => entry.status.code !== "CANCELLED")
    ?.status.code;
  const effectiveStatus = cancelled ? lastProgress || "NEW" : status;
  const currentIndex = stages.findIndex((stage) => stage === effectiveStatus);

  return (
    <section className="track-timeline-panel" aria-labelledby="track-timeline-title">
      <p className="track-eyebrow">Studio progress</p>
      <h2 id="track-timeline-title">The making journey</h2>
      <ol className="track-timeline" aria-label="Order status timeline">
        {stages.map((stage, index) => {
          const state =
            index < currentIndex ? "complete" : index === currentIndex ? "current" : "future";
          const moment = formatMoment(moments.get(stage));
          return (
            <li key={stage} className={`is-${state}`}>
              <span className="track-step-mark" aria-hidden="true">
                {state === "complete" ? <Check /> : <Flower2 />}
              </span>
              <div>
                <span className="sr-only">
                  {state === "complete"
                    ? "Completed: "
                    : state === "current"
                      ? "Current: "
                      : "Upcoming: "}
                </span>
                <h3>{ORDER_STATUS_LABELS[stage]}</h3>
                <p>{moment || (state === "future" ? "Still to come" : "Status recorded")}</p>
              </div>
            </li>
          );
        })}
      </ol>
      {cancelled && (
        <div className="track-cancelled" role="status">
          <X aria-hidden="true" />
          <div>
            <strong>This request has been cancelled.</strong>
            <p>Please contact the studio if you need assistance or would like to begin again.</p>
            {moments.get("CANCELLED") && <span>{formatMoment(moments.get("CANCELLED"))}</span>}
          </div>
        </div>
      )}
    </section>
  );
}
