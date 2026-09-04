"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { BusinessProvider } from "@/components/providers/business-provider";
import type { PublicBusinessSettings } from "@/lib/config/business";

export function SiteShell({
  children,
  businessSettings,
}: {
  children: ReactNode;
  businessSettings: PublicBusinessSettings;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return (
    <BusinessProvider value={businessSettings}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </BusinessProvider>
  );
}
