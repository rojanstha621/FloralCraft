import Image from "next/image";
import Link from "next/link";
import { Archive, Edit3, Flower2, ImageIcon, Plus, Sparkles } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { getMediaStorageStatus } from "@/lib/storage/cloud";
import { formatCurrency } from "@/lib/utils";
import { AdminShell, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { AdminSubmitButton, ConfirmButton } from "@/components/admin/form-controls";
import { createProduct, updateProductState } from "../actions";
import { isRenderableImageUrl } from "@/lib/media/image-url";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireAdmin();
  const query = await searchParams;
  const [products, categories, productTypes] = await Promise.all([
    prisma.product.findMany({
      where: { archivedAt: null },
      include: {
        category: true,
        productType: true,
        images: { orderBy: [{ primary: "desc" }, { sortOrder: "asc" }], take: 1 },
        _count: { select: { images: true, reviews: true, orderRequestItems: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.productType.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  const storage = getMediaStorageStatus();
  const canCreate = categories.length > 0 && productTypes.length > 0;

  return (
    <AdminShell
      session={session}
      title="Products"
      description="Create, publish, price, and maintain every floral piece in the public catalog."
      notice={query.notice}
      actions={
        <Link href="#new-product" className="admin-primary-button">
          <Plus aria-hidden="true" /> New product
        </Link>
      }
    >
      <div className={`admin-storage-status ${storage.configured ? "is-ready" : "is-missing"}`}>
        <ImageIcon aria-hidden="true" />
        <div>
          <strong>
            {storage.configured
              ? `${storage.provider} connected`
              : "Cloud uploads need configuration"}
          </strong>
          <p>
            {storage.configured
              ? `New files upload to the private server credential and public ${storage.bucket} bucket.`
              : "File uploads are disabled until the Supabase server credentials are configured. External image URLs remain available."}
          </p>
        </div>
      </div>

      <details id="new-product" className="admin-card admin-create-panel">
        <summary>
          <span>
            <Plus aria-hidden="true" /> Add a product
          </span>
          <small>
            Create the catalog entry first; more images and details can be managed after saving.
          </small>
        </summary>
        {!canCreate ? (
          <p className="admin-inline-warning">
            Create at least one active category and product type before adding a product.
          </p>
        ) : (
          <form action={createProduct} className="admin-form-grid">
            <AdminField label="Name" required>
              <input name="name" required minLength={2} maxLength={120} className={adminInput} />
            </AdminField>
            <AdminField label="Slug" help="Optional. Generated from the name if left blank.">
              <input
                name="slug"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                className={adminInput}
                placeholder="garden-blush-bouquet"
              />
            </AdminField>
            <AdminField label="Short tagline">
              <input name="tagline" maxLength={180} className={adminInput} />
            </AdminField>
            <AdminField label="Price (NPR)" required>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                className={adminInput}
              />
            </AdminField>
            <AdminField label="Compare-at price">
              <input
                name="compareAtPrice"
                type="number"
                min="0"
                step="0.01"
                className={adminInput}
              />
            </AdminField>
            <AdminField label="Preparation days">
              <input name="preparationDays" type="number" min="0" className={adminInput} />
            </AdminField>
            <AdminField label="Category" required>
              <select name="categoryId" required className={adminInput}>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Product type" required>
              <select name="productTypeId" required className={adminInput}>
                {productTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Description" required wide>
              <textarea
                name="description"
                required
                minLength={10}
                maxLength={4000}
                className={adminTextarea}
              />
            </AdminField>
            <AdminField
              label="Cloud image"
              help={
                storage.configured
                  ? "JPG, PNG, WEBP, or GIF. Maximum 8 MB."
                  : "Configure Supabase storage to upload files."
              }
            >
              <input
                name="image"
                type="file"
                accept="image/*"
                disabled={!storage.configured}
                className={`${adminInput} admin-file-input`}
              />
            </AdminField>
            <AdminField label="Or external image URL">
              <input name="imageUrl" type="url" maxLength={2000} className={adminInput} />
            </AdminField>
            <div className="admin-check-row admin-field-wide">
              <label>
                <input name="available" type="checkbox" defaultChecked /> Available
              </label>
              <label>
                <input name="featured" type="checkbox" /> Featured
              </label>
              <label>
                <input name="customizable" type="checkbox" /> Customizable
              </label>
            </div>
            <AdminSubmitButton pendingLabel="Creating product…">Create product</AdminSubmitButton>
          </form>
        )}
      </details>

      <section className="admin-list-section">
        <div className="admin-section-heading">
          <div>
            <p>Catalog</p>
            <h2>{products.length} active records</h2>
          </div>
        </div>
        {products.length ? (
          <div className="admin-product-list">
            {products.map((product) => (
              <article key={product.id} className="admin-product-row">
                <div className="admin-product-thumb">
                  {product.images[0] && isRenderableImageUrl(product.images[0].url) ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      fill
                      sizes="92px"
                      className="object-cover"
                    />
                  ) : (
                    <Flower2 aria-hidden="true" />
                  )}
                </div>
                <div className="admin-product-copy">
                  <div>
                    <h2>{product.name}</h2>
                    {product.featured && (
                      <span>
                        <Sparkles aria-hidden="true" /> Featured
                      </span>
                    )}
                  </div>
                  <p>
                    {product.category.name} · {product.productType.name}
                  </p>
                  <strong>{formatCurrency(product.price)}</strong>
                  <small>
                    {product._count.images} images · {product._count.reviews} reviews ·{" "}
                    {product._count.orderRequestItems} requests
                  </small>
                </div>
                <div className="admin-product-state">
                  <span className={product.available ? "is-live" : "is-paused"}>
                    {product.available ? "Available" : "Unavailable"}
                  </span>
                  <span>{product.customizable ? "Customizable" : "Standard"}</span>
                </div>
                <div className="admin-row-actions">
                  <Link href={`/admin/products/${product.id}`}>
                    <Edit3 aria-hidden="true" /> Edit
                  </Link>
                  <form action={updateProductState}>
                    <input type="hidden" name="id" value={product.id} />
                    <button name="intent" value="availability">
                      {product.available ? "Pause" : "Enable"}
                    </button>
                  </form>
                  <form action={updateProductState}>
                    <input type="hidden" name="id" value={product.id} />
                    <ConfirmButton
                      name="intent"
                      value="archive"
                      message={`Archive ${product.name}? It will disappear from the public catalog but historical orders remain intact.`}
                      className="is-danger"
                    >
                      <Archive aria-hidden="true" /> Archive
                    </ConfirmButton>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <Flower2 aria-hidden="true" />
            <h3>No products yet</h3>
            <p>Create the first catalog piece above.</p>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function AdminField({
  label,
  required,
  help,
  wide,
  children,
}: {
  label: string;
  required?: boolean;
  help?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={wide ? "admin-field admin-field-wide" : "admin-field"}>
      <span>
        {label}
        {required && <b aria-hidden="true"> *</b>}
      </span>
      {children}
      {help && <small>{help}</small>}
    </label>
  );
}
