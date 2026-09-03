import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminShell, adminButton, adminCard, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { createCategory, toggleCategory } from "../actions";

export default async function AdminCategoriesPage() {
  const session = await requireAdmin();
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { sortOrder: "asc" } });
  return <AdminShell session={session} title="Categories" description="Organize the storefront into clear, browsable collections.">
    <form action={createCategory} className={`${adminCard} grid gap-4 md:grid-cols-2`}>
      <h2 className="font-serif text-xl font-semibold md:col-span-2">New category</h2>
      <label className="text-xs font-semibold">Name<input name="name" required className={`${adminInput} mt-1`} /></label><label className="text-xs font-semibold">Slug<input name="slug" className={`${adminInput} mt-1`} /></label>
      <label className="text-xs font-semibold md:col-span-2">Description<textarea name="description" className={`${adminTextarea} mt-1`} /></label><label className="text-xs font-semibold">Image URL<input name="imageUrl" type="url" className={`${adminInput} mt-1`} /></label><label className="text-xs font-semibold">Sort order<input name="sortOrder" type="number" defaultValue="0" className={`${adminInput} mt-1`} /></label><button className={`${adminButton} md:w-fit`}>Create category</button>
    </form>
    <div className="mt-6 grid gap-3 sm:grid-cols-2">{categories.map((category) => <article key={category.id} className={adminCard}><div className="flex justify-between gap-4"><div><h2 className="font-serif text-xl font-semibold">{category.name}</h2><p className="mt-1 text-xs text-brand-brown-500">{category._count.products} products · {category.active ? "Visible" : "Hidden"}</p></div><form action={toggleCategory}><input type="hidden" name="id" value={category.id} /><button className="rounded-lg border px-3 py-2 text-xs font-semibold">{category.active ? "Hide" : "Show"}</button></form></div>{category.description && <p className="mt-4 text-sm text-brand-brown-500">{category.description}</p>}</article>)}</div>
  </AdminShell>;
}
