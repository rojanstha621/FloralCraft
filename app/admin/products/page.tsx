import Image from "next/image";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/utils";
import { AdminShell, adminButton, adminCard, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { createProduct, updateProductState } from "../actions";

export default async function AdminProductsPage() {
  const session = await requireAdmin();
  const [products, categories, productTypes] = await Promise.all([
    prisma.product.findMany({ where: { archivedAt: null }, include: { category: true, productType: true, images: { orderBy: { sortOrder: "asc" }, take: 1 } }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.productType.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  return <AdminShell session={session} title="Products" description="Publish floral products, control availability, and attach cloud-hosted images.">
    <details className={adminCard}><summary className="cursor-pointer font-serif text-xl font-semibold">Add a product</summary>
      <form action={createProduct} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold">Name<input name="name" required className={`${adminInput} mt-1`} /></label>
        <label className="text-xs font-semibold">Slug (optional)<input name="slug" className={`${adminInput} mt-1`} placeholder="created-from-name" /></label>
        <label className="text-xs font-semibold">Tagline<input name="tagline" className={`${adminInput} mt-1`} /></label>
        <label className="text-xs font-semibold">Price (NPR)<input name="price" type="number" min="0" step="0.01" required className={`${adminInput} mt-1`} /></label>
        <label className="text-xs font-semibold">Compare-at price<input name="compareAtPrice" type="number" min="0" step="0.01" className={`${adminInput} mt-1`} /></label>
        <label className="text-xs font-semibold">Preparation days<input name="preparationDays" type="number" min="0" className={`${adminInput} mt-1`} /></label>
        <label className="text-xs font-semibold">Category<select name="categoryId" required className={`${adminInput} mt-1`}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="text-xs font-semibold">Product type<select name="productTypeId" required className={`${adminInput} mt-1`}>{productTypes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="text-xs font-semibold md:col-span-2">Description<textarea name="description" required minLength={10} className={`${adminTextarea} mt-1`} /></label>
        <label className="text-xs font-semibold">Cloud image<input name="image" type="file" accept="image/*" className={`${adminInput} mt-1 py-2`} /></label>
        <label className="text-xs font-semibold">Or external image URL<input name="imageUrl" type="url" className={`${adminInput} mt-1`} /></label>
        <div className="flex flex-wrap gap-5 text-sm md:col-span-2"><label><input name="featured" type="checkbox" className="mr-2" />Featured</label><label><input name="customizable" type="checkbox" className="mr-2" />Customizable</label></div>
        <button className={`${adminButton} md:w-fit`}>Create product</button>
      </form>
    </details>
    <div className="mt-6 grid gap-4">
      {products.map((product) => <article key={product.id} className={`${adminCard} grid gap-4 sm:grid-cols-[72px_1fr_auto] sm:items-center`}>
        <div className="relative h-[72px] w-[72px] overflow-hidden rounded-xl bg-brand-cream-300">{product.images[0] && <Image src={product.images[0].url} alt={product.images[0].alt || product.name} fill sizes="72px" className="object-cover" />}</div>
        <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-serif text-xl font-semibold">{product.name}</h2>{product.featured && <span className="rounded-full bg-brand-pink-100 px-2 py-1 text-[10px] font-bold">FEATURED</span>}</div><p className="mt-1 text-xs text-brand-brown-500">{product.category.name} · {product.productType.name} · {formatCurrency(product.price)} · {product.available ? "Available" : "Unavailable"}</p></div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <form action={updateProductState}><input type="hidden" name="id" value={product.id} /><button name="intent" value="availability" className="rounded-lg border px-3 py-2">{product.available ? "Pause" : "Enable"}</button></form>
          <form action={updateProductState}><input type="hidden" name="id" value={product.id} /><button name="intent" value="featured" className="rounded-lg border px-3 py-2">{product.featured ? "Unfeature" : "Feature"}</button></form>
          <form action={updateProductState}><input type="hidden" name="id" value={product.id} /><button name="intent" value="archive" className="rounded-lg border border-red-200 px-3 py-2 text-red-700">Archive</button></form>
        </div>
      </article>)}
    </div>
  </AdminShell>;
}
