export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "customization_started"
  | "customization_completed"
  | "checkout_started"
  | "payment_started"
  | "purchase_completed";

export interface AnalyticsEventPayload {
  eventName: AnalyticsEventName;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export interface AnalyticsTracker {
  track(eventName: AnalyticsEventName, properties?: Record<string, unknown>): void;
}
