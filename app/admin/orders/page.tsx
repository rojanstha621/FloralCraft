import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdminShell, adminButton, adminCard, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { updateOrder } from "../actions";

const statuses = ["NEW", "CONTACTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
export default async function AdminOrdersPage() {
  const session = await requireAdmin();
  const orders = await prisma.orderRequest.findMany({
    include: {
      items: {
        include: {
          product: {
            include: {
              category: { select: { name: true } },
              productType: { select: { name: true } },
              images: { orderBy: [{ primary: "desc" }, { sortOrder: "asc" }], take: 1 },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return <AdminShell session={session} title="Orders" description="Track website and customization requests from first contact through completion.">
    <div className="grid gap-5">{orders.length ? orders.map((order) => <article key={order.id} className={adminCard}>
      <div className="flex flex-wrap justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-brand-sage-700">{order.requestNumber}</p><h2 className="mt-1 font-serif text-2xl font-semibold">{order.customerName}</h2><p className="mt-1 text-xs text-brand-brown-500">{order.customerPhone}{order.customerEmail ? ` · ${order.customerEmail}` : ""} · {formatDate(order.createdAt)}</p></div><span className="h-fit rounded-full bg-brand-pink-100 px-3 py-1 text-xs font-bold">{order.status.replace("_", " ")}</span></div>
      <div className="mt-5 divide-y rounded-2xl border border-brand-beige-200 bg-brand-cream-100 px-4">
        {order.items.map((item) => {
          const image = item.product?.images[0];
          const unitPrice = item.unitPriceSnapshot ? Number(item.unitPriceSnapshot) : null;
          return <div key={item.id} className="grid gap-4 py-4 sm:grid-cols-[88px_1fr_auto]">
            <div className="relative h-[88px] w-[88px] overflow-hidden rounded-xl border bg-white">
              {image ? <Image src={image.url} alt={image.alt || item.productNameSnapshot} fill sizes="88px" className="object-cover" /> : <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-brand-brown-400">No image</div>}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {item.product ? <Link href={`/products/${item.product.slug}`} className="font-serif text-xl font-semibold underline decoration-brand-pink-300 underline-offset-4" target="_blank">{item.productNameSnapshot}</Link> : <strong className="font-serif text-xl">{item.productNameSnapshot}</strong>}
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold">QTY {item.quantity}</span>
              </div>
              {item.product ? <p className="mt-1 text-xs text-brand-brown-500">{item.product.category.name} · {item.product.productType.name} · {item.product.available ? "Currently available" : "Currently unavailable"}</p> : <p className="mt-1 text-xs text-amber-700">Original product is no longer in the catalog; showing the order snapshot.</p>}
              {item.product?.tagline && <p className="mt-2 text-sm text-brand-brown-600">{item.product.tagline}</p>}
              {item.customization ? <div className="mt-3 flex flex-wrap gap-2">{Object.entries(item.customization as Record<string,string>).filter(([,value]) => value).map(([key,value]) => <span key={key} className="rounded-lg border bg-white px-2.5 py-1.5 text-xs"><strong className="capitalize">{key.replace(/-/g, " ")}:</strong> {value}</span>)}</div> : null}
              {item.notes && <p className="mt-2 text-xs text-brand-brown-500"><strong>Item note:</strong> {item.notes}</p>}
            </div>
            <div className="text-left sm:text-right">
              {unitPrice !== null && <><p className="font-semibold">{formatCurrency(unitPrice * item.quantity)}</p><p className="mt-1 text-[10px] text-brand-brown-400">{formatCurrency(unitPrice)} each</p></>}
              {item.product && unitPrice !== null && Number(item.product.price) !== unitPrice && <p className="mt-2 text-[10px] text-amber-700">Current price: {formatCurrency(item.product.price)}</p>}
            </div>
          </div>;
        })}
      </div>
      {order.notes && <p className="mt-4 text-sm text-brand-brown-600"><strong>Customer note:</strong> {order.notes}</p>}
      <form action={updateOrder} className="mt-5 grid gap-3 border-t pt-5 md:grid-cols-[200px_1fr_auto]"><input type="hidden" name="id" value={order.id} /><select name="status" defaultValue={order.status} className={adminInput}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><textarea name="adminNotes" defaultValue={order.adminNotes || ""} placeholder="Private admin notes" className={adminTextarea} /><button className={adminButton}>Save</button></form>
    </article>) : <p className={`${adminCard} text-sm text-brand-brown-500`}>No order requests yet.</p>}</div>
  </AdminShell>;
}
