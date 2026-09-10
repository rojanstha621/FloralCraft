import { FolderPlus, GripVertical } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminShell, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { AdminSubmitButton } from "@/components/admin/form-controls";
import { createCategory, updateCategory } from "../actions";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireAdmin();
  const query = await searchParams;
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return (
    <AdminShell
      session={session}
      title="Categories"
      description="Organize products into customer-facing collections. Lower sort numbers appear first."
      notice={query.notice}
    >
      <details className="admin-card admin-create-panel">
        <summary>
          <span>
            <FolderPlus aria-hidden="true" /> New category
          </span>
          <small>Categories group products by occasion or collection.</small>
        </summary>
        <CategoryForm action={createCategory} submitLabel="Create category" />
      </details>
      <section className="admin-list-section">
        <div className="admin-section-heading">
          <div>
            <p>Collection structure</p>
            <h2>{categories.length} categories</h2>
          </div>
        </div>
        {categories.length ? (
          <div className="admin-manage-grid">
            {categories.map((category) => (
              <details key={category.id} className="admin-card admin-edit-card">
                <summary>
                  <GripVertical aria-hidden="true" />
                  <span>
                    <strong>{category.name}</strong>
                    <small>
                      {category._count.products} products · Sort {category.sortOrder}
                    </small>
                  </span>
                  <em className={category.active ? "is-active" : "is-inactive"}>
                    {category.active ? "Visible" : "Hidden"}
                  </em>
                </summary>
                <CategoryForm
                  action={updateCategory}
                  category={category}
                  submitLabel="Save category"
                />
              </details>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <FolderPlus aria-hidden="true" />
            <h3>No categories yet</h3>
            <p>Create one to begin organizing products.</p>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

type CategoryValue = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  active: boolean;
};
function CategoryForm({
  action,
  category,
  submitLabel,
}: {
  action: (data: FormData) => Promise<void>;
  category?: CategoryValue;
  submitLabel: string;
}) {
  return (
    <form action={action} className="admin-form-grid">
      {category && <input type="hidden" name="id" value={category.id} />}
      <label className="admin-field">
        <span>Name *</span>
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={category?.name}
          className={adminInput}
        />
      </label>
      <label className="admin-field">
        <span>Slug</span>
        <input
          name="slug"
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          defaultValue={category?.slug}
          className={adminInput}
        />
      </label>
      <label className="admin-field admin-field-wide">
        <span>Description</span>
        <textarea
          name="description"
          maxLength={1000}
          defaultValue={category?.description || ""}
          className={adminTextarea}
        />
      </label>
      <label className="admin-field">
        <span>Image URL</span>
        <input
          name="imageUrl"
          type="url"
          maxLength={2000}
          defaultValue={category?.imageUrl || ""}
          className={adminInput}
        />
      </label>
      <label className="admin-field">
        <span>Sort order</span>
        <input
          name="sortOrder"
          type="number"
          min="-9999"
          max="9999"
          defaultValue={category?.sortOrder ?? 0}
          className={adminInput}
        />
      </label>
      <div className="admin-check-row admin-field-wide">
        <label>
          <input name="active" type="checkbox" defaultChecked={category?.active ?? true} /> Visible
          on storefront
        </label>
      </div>
      <AdminSubmitButton pendingLabel="Saving category…">{submitLabel}</AdminSubmitButton>
    </form>
  );
}
