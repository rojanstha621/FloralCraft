import { AnalyticsEventName, AnalyticsTracker } from "./types";

class ConsoleAnalyticsTracker implements AnalyticsTracker {
  track(eventName: AnalyticsEventName, properties?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === "development") {
      // In dev mode, log gracefully
      // eslint-disable-next-line no-console
      console.log(`[Analytics] ${eventName}`, properties);
    }
    // Expandable to Google Analytics 4, Meta Pixel, TikTok Pixel in production
  }
}

export const analytics: AnalyticsTracker = new ConsoleAnalyticsTracker();
export * from "./types";
