"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  Instagram,
  LayoutDashboard,
  MessageSquareText,
  Palette,
  Settings,
  Shapes,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  ["Overview", "/admin", LayoutDashboard],
  ["Products", "/admin/products", Boxes],
  ["Categories", "/admin/categories", Tags],
  ["Product types", "/admin/product-types", Shapes],
  ["Customization", "/admin/customization", Palette],
  ["Reviews", "/admin/reviews", MessageSquareText],
  ["Instagram", "/admin/instagram", Instagram],
  ["Orders", "/admin/orders", ClipboardList],
  ["Settings", "/admin/settings", Settings],
] as const;

export function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav className="admin-navigation" aria-label="Admin navigation">
      {navigation.map(([label, href, Icon]) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(active && "is-active")}
          >
            <Icon aria-hidden="true" /> <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
