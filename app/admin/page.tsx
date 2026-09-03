import Link from "next/link";
import { ArrowRight, Boxes, ClipboardList, MessageSquareText, Tags } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminShell, adminCard } from "@/components/admin/admin-shell";

export default async function AdminPage() {
  const session = await requireAdmin();
  const [products, categories, pendingReviews, newRequests, latestOrders] = await Promise.all([
    prisma.product.count({ where: { archivedAt: null } }),
    prisma.category.count({ where: { active: true } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.orderRequest.count({ where: { status: "NEW" } }),
    prisma.orderRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const cards = [
    ["Products", products, "/admin/products", Boxes],
    ["Categories", categories, "/admin/categories", Tags],
    ["Pending reviews", pendingReviews, "/admin/reviews", MessageSquareText],
    ["New orders", newRequests, "/admin/orders", ClipboardList],
  ] as const;

  return (
    <AdminShell session={session} title="Overview" description="A live snapshot of the Petal Craft catalog and customer requests.">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, href, Icon]) => (
          <Link key={label} href={href} className={`${adminCard} group block`}>
            <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-brand-sage-700" /><ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
            <p className="mt-5 text-sm text-brand-brown-500">{label}</p>
            <p className="mt-1 font-serif text-4xl font-semibold text-brand-brown-900">{value}</p>
          </Link>
        ))}
      </section>
      <section className={`${adminCard} mt-7`}>
        <div className="flex items-center justify-between"><h2 className="font-serif text-2xl font-semibold">Latest order requests</h2><Link href="/admin/orders" className="text-xs font-bold underline underline-offset-4">View all</Link></div>
        <div className="mt-5 divide-y">
          {latestOrders.length ? latestOrders.map((order) => (
            <div key={order.id} className="grid gap-1 py-4 text-sm sm:grid-cols-[1fr_1fr_auto]"><strong>{order.customerName}</strong><span className="text-brand-brown-500">{order.requestNumber}</span><span className="w-fit rounded-full bg-brand-pink-100 px-3 py-1 text-xs font-bold">{order.status.replace("_", " ")}</span></div>
          )) : <p className="py-8 text-sm text-brand-brown-500">No order requests yet.</p>}
        </div>
      </section>
    </AdminShell>
  );
}
