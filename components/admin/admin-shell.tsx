import Link from "next/link";
import type { ReactNode } from "react";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  MessageSquareText,
  Palette,
  Settings,
  Tags,
} from "lucide-react";
import type { AdminSession } from "@/lib/auth/session";

const navigation = [
  ["Overview", "/admin", LayoutDashboard],
  ["Products", "/admin/products", Boxes],
  ["Categories", "/admin/categories", Tags],
  ["Customization", "/admin/customization", Palette],
  ["Reviews", "/admin/reviews", MessageSquareText],
  ["Orders", "/admin/orders", ClipboardList],
  ["Settings", "/admin/settings", Settings],
] as const;

export function AdminShell({
  session,
  title,
  description,
  children,
}: {
  session: AdminSession;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-cream-200 text-brand-brown-800">
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-brand-beige-200 bg-white px-5 py-5 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <Link href="/admin" className="font-serif text-2xl font-semibold text-brand-brown-800">
            Petal Craft
          </Link>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-sage-700">
            Studio administration
          </p>
          <nav className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:flex-col" aria-label="Admin">
            {navigation.map(([label, href, Icon]) => (
              <Link
                key={href}
                href={href}
                className="flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-brand-brown-600 transition hover:bg-brand-cream-200 hover:text-brand-brown-900"
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t pt-5 text-xs text-brand-brown-500 lg:mt-10">
            <p className="truncate">{session.email}</p>
            <div className="mt-4 flex items-center gap-3">
              <Link href="/" className="font-semibold underline underline-offset-4">
                View store
              </Link>
              <form action="/api/admin/logout" method="post">
                <button className="font-semibold underline underline-offset-4">Sign out</button>
              </form>
            </div>
          </div>
        </aside>
        <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <header className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-sage-700">
              Admin panel
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-brand-brown-900">{title}</h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm text-brand-brown-500">{description}</p>
            )}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

export const adminCard = "rounded-2xl border border-brand-beige-200 bg-white p-5 shadow-subtle";
export const adminInput =
  "h-11 w-full rounded-xl border border-brand-beige-300 bg-white px-3 text-sm outline-none focus:border-brand-sage-600 focus:ring-2 focus:ring-brand-sage-100";
export const adminTextarea = `${adminInput} min-h-28 py-3`;
export const adminButton =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-brown-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-brown-800 disabled:opacity-50";
