"use client";

import { createContext, useContext } from "react";
import { BUSINESS, type PublicBusinessSettings } from "@/lib/config/business";

const fallback: PublicBusinessSettings = {
  ...BUSINESS,
  logoUrl: "",
  address: BUSINESS.location,
  openingHours: "",
  facebookUrl: "",
  otherSocialUrl: "",
  websiteOrderingEnabled: true,
  whatsappOrderingEnabled: true,
};
const BusinessContext = createContext<PublicBusinessSettings>(fallback);

export function BusinessProvider({
  value,
  children,
}: {
  value: PublicBusinessSettings;
  children: React.ReactNode;
}) {
  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export const useBusinessSettings = () => useContext(BusinessContext);
