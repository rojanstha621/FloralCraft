import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminShell, adminButton, adminCard, adminInput } from "@/components/admin/admin-shell";
import { createCustomizationOption, toggleCustomizationOption } from "../actions";

export default async function AdminCustomizationPage() {
  const session = await requireAdmin();
  const [products, options] = await Promise.all([
    prisma.product.findMany({
      where: { archivedAt: null, customizable: true },
      orderBy: { name: "asc" },
    }),
    prisma.customizationOption.findMany({
      include: { product: { select: { name: true } } },
      orderBy: [{ product: { name: "asc" } }, { sortOrder: "asc" }],
    }),
  ]);
  return (
    <AdminShell
      session={session}
      title="Customization"
      description="Define the choices customers can include with an order request."
    >
      <form action={createCustomizationOption} className={`${adminCard} grid gap-4 md:grid-cols-2`}>
        <h2 className="font-serif text-xl font-semibold md:col-span-2">Add an option</h2>
        <label className="text-xs font-semibold">
          Product
          <select name="productId" required className={`${adminInput} mt-1`}>
            <option value="">Choose product</option>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold">
          Label
          <input
            name="label"
            required
            className={`${adminInput} mt-1`}
            placeholder="Flower color"
          />
        </label>
        <label className="text-xs font-semibold">
          Input type
          <select name="inputKind" className={`${adminInput} mt-1`}>
            <option value="text">Text</option>
            <option value="select">Choice list</option>
            <option value="textarea">Long text</option>
          </select>
        </label>
        <label className="text-xs font-semibold">
          Choices (comma-separated)
          <input name="choices" className={`${adminInput} mt-1`} placeholder="Pink, White, Red" />
        </label>
        <label className="text-xs font-semibold">
          Price adjustment
          <input
            name="priceAdjustment"
            type="number"
            step="0.01"
            defaultValue="0"
            className={`${adminInput} mt-1`}
          />
        </label>
        <label className="flex items-center gap-2 pt-5 text-sm">
          <input name="required" type="checkbox" />
          Required
        </label>
        <button className={`${adminButton} md:w-fit`}>Add option</button>
      </form>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <article key={option.id} className={adminCard}>
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-sage-700">
                  {option.product.name}
                </p>
                <h2 className="mt-1 font-serif text-xl font-semibold">{option.label}</h2>
                <p className="mt-1 text-xs text-brand-brown-500">
                  {option.inputKind} · {option.required ? "Required" : "Optional"} ·{" "}
                  {option.active ? "Active" : "Inactive"}
                </p>
              </div>
              <form action={toggleCustomizationOption}>
                <input type="hidden" name="id" value={option.id} />
                <button className="rounded-lg border px-3 py-2 text-xs font-semibold">
                  {option.active ? "Disable" : "Enable"}
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
