import { GripVertical, Shapes } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminShell, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { AdminSubmitButton } from "@/components/admin/form-controls";
import { createProductType, updateProductType } from "../actions";

export default async function AdminProductTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireAdmin();
  const query = await searchParams;
  const productTypes = await prisma.productType.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return (
    <AdminShell
      session={session}
      title="Product types"
      description="Manage the physical formats Petal Craft makes—bouquets, bottles, frames, boxes, pots, and more."
      notice={query.notice}
    >
      <details className="admin-card admin-create-panel">
        <summary>
          <span>
            <Shapes aria-hidden="true" /> New product type
          </span>
          <small>
            Product types are database-driven and available immediately in product forms.
          </small>
        </summary>
        <ProductTypeForm action={createProductType} submitLabel="Create product type" />
      </details>
      <section className="admin-list-section">
        <div className="admin-section-heading">
          <div>
            <p>Physical formats</p>
            <h2>{productTypes.length} product types</h2>
          </div>
        </div>
        {productTypes.length ? (
          <div className="admin-manage-grid">
            {productTypes.map((item) => (
              <details key={item.id} className="admin-card admin-edit-card">
                <summary>
                  <GripVertical aria-hidden="true" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {item._count.products} products · Sort {item.sortOrder}
                    </small>
                  </span>
                  <em className={item.active ? "is-active" : "is-inactive"}>
                    {item.active ? "Active" : "Inactive"}
                  </em>
                </summary>
                <ProductTypeForm
                  action={updateProductType}
                  item={item}
                  submitLabel="Save product type"
                />
              </details>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <Shapes aria-hidden="true" />
            <h3>No product types yet</h3>
            <p>Add the first physical product format.</p>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

type ProductTypeValue = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
};
function ProductTypeForm({
  action,
  item,
  submitLabel,
}: {
  action: (data: FormData) => Promise<void>;
  item?: ProductTypeValue;
  submitLabel: string;
}) {
  return (
    <form action={action} className="admin-form-grid">
      {item && <input type="hidden" name="id" value={item.id} />}
      <label className="admin-field">
        <span>Name *</span>
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={item?.name}
          className={adminInput}
        />
      </label>
      <label className="admin-field">
        <span>Slug</span>
        <input name="slug" pattern="[-a-z0-9]*" defaultValue={item?.slug} className={adminInput} />
      </label>
      <label className="admin-field admin-field-wide">
        <span>Description</span>
        <textarea
          name="description"
          maxLength={1000}
          defaultValue={item?.description || ""}
          className={adminTextarea}
        />
      </label>
      <label className="admin-field">
        <span>Sort order</span>
        <input
          name="sortOrder"
          type="number"
          min="-9999"
          max="9999"
          defaultValue={item?.sortOrder ?? 0}
          className={adminInput}
        />
      </label>
      <div className="admin-check-row admin-field-wide">
        <label>
          <input name="active" type="checkbox" defaultChecked={item?.active ?? true} /> Active in
          product forms and filters
        </label>
      </div>
      <AdminSubmitButton pendingLabel="Saving product type…">{submitLabel}</AdminSubmitButton>
    </form>
  );
}
