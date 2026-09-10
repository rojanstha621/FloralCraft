import type { Metadata } from "next";
import { OrderTrackingPage } from "@/components/orders/order-tracking-page";

export const metadata: Metadata = {
  title: "Order Progress",
  description: "Privately follow the progress of your Petal Craft order request.",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default function TrackingPage() {
  return <OrderTrackingPage />;
}
