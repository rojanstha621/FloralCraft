"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Flower2, MessageCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { OrderRequestStatus } from "@prisma/client";
import { Container } from "@/components/ui/container";
import { OrderStatusTimeline } from "@/components/orders/order-status-timeline";
import { OrderTrackingSummary } from "@/components/orders/order-tracking-summary";
import type { PublicTrackingOrder } from "@/lib/orders/public-tracking";
import { ORDER_STATUS_MESSAGES } from "@/lib/orders/status";
import { createOrderWhatsAppMessage, createWhatsAppUrl } from "@/lib/config/business";
import { useBusinessSettings } from "@/components/providers/business-provider";

type ViewState =
  | { kind: "loading" }
  | { kind: "ready"; order: PublicTrackingOrder }
  | { kind: "not-found" }
  | { kind: "error" };

function LoadingState() {
  return (
    <div className="track-loading" role="status" aria-live="polite">
      <span className="sr-only">Loading your order status</span>
      <div className="track-loading-status" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="track-loading-grid" aria-hidden="true">
        <div>
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div>
          <span />
          <i />
          <span />
        </div>
      </div>
    </div>
  );
}

function Unavailable({ kind, retry }: { kind: "not-found" | "error"; retry: () => void }) {
  const notFound = kind === "not-found";
  return (
    <section className="track-unavailable" aria-labelledby="track-error-title">
      <Flower2 aria-hidden="true" />
      <p className="track-eyebrow">{notFound ? "A misplaced petal" : "A brief studio pause"}</p>
      <h1 id="track-error-title">
        {notFound ? "We couldn’t find that order." : "We’re having trouble loading your order."}
      </h1>
      <p role="alert">
        {notFound
          ? "Please check that you opened the complete tracking link you received from Petal Craft."
          : "Your order information is safe. Please try loading it again in a moment."}
      </p>
      <div>
        {!notFound && (
          <button type="button" onClick={retry}>
            <RefreshCw aria-hidden="true" /> Try again
          </button>
        )}
        <Link href="/collections">
          Return to the collection <ArrowRight aria-hidden="true" />
        </Link>
        <Link href="/">Return home</Link>
      </div>
    </section>
  );
}

export function OrderTrackingPage() {
  const business = useBusinessSettings();
  const params = useParams<{ reference: string; token: string }>();
  const reference = typeof params.reference === "string" ? params.reference : "";
  const token = typeof params.token === "string" ? params.token : "";
  const [state, setState] = useState<ViewState>({ kind: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal, refresh = false) => {
      if (refresh) setRefreshing(true);
      else setState({ kind: "loading" });
      try {
        const response = await fetch(
          `/api/orders/track/${encodeURIComponent(reference)}/${encodeURIComponent(token)}`,
          { cache: "no-store", credentials: "same-origin", signal }
        );
        const payload = (await response.json().catch(() => null)) as {
          success?: boolean;
          order?: PublicTrackingOrder;
        } | null;
        if (response.status === 404) setState({ kind: "not-found" });
        else if (!response.ok || !payload?.success || !payload.order) setState({ kind: "error" });
        else setState({ kind: "ready", order: payload.order });
      } catch (error) {
        if ((error as Error).name !== "AbortError") setState({ kind: "error" });
      } finally {
        setRefreshing(false);
      }
    },
    [reference, token]
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <main className="tracking-page">
      <Container size="xl">
        <nav className="track-breadcrumb" aria-label="Breadcrumb">
          <Link href="/collections">
            <ArrowLeft aria-hidden="true" /> Collection
          </Link>
          <span aria-hidden="true">/</span>
          <span>Order progress</span>
        </nav>
        {state.kind === "loading" ? (
          <LoadingState />
        ) : state.kind === "not-found" || state.kind === "error" ? (
          <Unavailable kind={state.kind} retry={() => void load()} />
        ) : (
          <div className="track-experience">
            <header className="track-hero">
              <Flower2 aria-hidden="true" />
              <p className="track-eyebrow">Petal Craft studio progress</p>
              <h1>Your order, thoughtfully made.</h1>
              <p>
                Follow your request as it moves through our Kathmandu studio, one considered step at
                a time.
              </p>
            </header>
            <section
              className={`track-current is-${state.order.status.code.toLowerCase()}`}
              aria-labelledby="track-current-title"
            >
              <div>
                <span>Order reference</span>
                <strong>{state.order.requestNumber}</strong>
                <small>
                  Received{" "}
                  {new Intl.DateTimeFormat("en-NP", { dateStyle: "medium" }).format(
                    new Date(state.order.createdAt)
                  )}
                </small>
              </div>
              <div>
                <span>Current status</span>
                <h2 id="track-current-title" aria-live="polite">
                  {state.order.status.label}
                </h2>
                <p>{ORDER_STATUS_MESSAGES[state.order.status.code as OrderRequestStatus]}</p>
              </div>
              <button
                type="button"
                onClick={() => void load(undefined, true)}
                disabled={refreshing}
              >
                <RefreshCw className={refreshing ? "is-spinning" : ""} aria-hidden="true" />
                {refreshing ? "Refreshing…" : "Refresh status"}
              </button>
            </section>
            <div className="track-grid">
              <OrderStatusTimeline
                status={state.order.status.code as OrderRequestStatus}
                history={state.order.statusHistory}
              />
              <OrderTrackingSummary order={state.order} />
            </div>
            <footer className="track-footer">
              <Flower2 aria-hidden="true" />
              <div>
                <strong>Made personally, confirmed personally.</strong>
                <p>We’ll keep you updated through WhatsApp as your order progresses.</p>
              </div>
              {business.whatsappOrderingEnabled ? (
                <a
                  href={createWhatsAppUrl(
                    createOrderWhatsAppMessage({ requestNumber: state.order.requestNumber }),
                    business.whatsappNumber
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden="true" /> Contact on WhatsApp
                </a>
              ) : (
                <Link href="/contact">Contact the studio</Link>
              )}
            </footer>
          </div>
        )}
      </Container>
    </main>
  );
}
