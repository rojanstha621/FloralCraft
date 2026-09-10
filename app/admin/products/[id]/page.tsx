import Image from "next/image";
import { isRenderableImageUrl } from "@/lib/media/image-url";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, ExternalLink, ImageIcon, Star, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { getMediaStorageStatus } from "@/lib/storage/cloud";
import { AdminShell, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { AdminSubmitButton, ConfirmButton } from "@/components/admin/form-controls";
import {
  addProductImage,
  deleteProductImage,
  updateProduct,
  updateProductImage,
} from "../../actions";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [product, categories, productTypes] = await Promise.all([
    prisma.product.findFirst({
      where: { id, archivedAt: null },
      include: {
        images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
        _count: { select: { customizationOptions: true, reviews: true, orderRequestItems: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.productType.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();
  const storage = getMediaStorageStatus();

  return (
    <AdminShell
      session={session}
      title={`Edit ${product.name}`}
      description="Changes publish to the storefront as soon as they are saved."
      notice={query.notice}
      actions={
        <>
          <Link href="/admin/products" className="admin-secondary-button">
            <ArrowLeft aria-hidden="true" /> Products
          </Link>
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="admin-secondary-button"
          >
            View live <ExternalLink aria-hidden="true" />
          </Link>
        </>
      }
    >
      <section className="admin-card">
        <div className="admin-section-heading">
          <div>
            <p>Catalog information</p>
            <h2>Product details</h2>
          </div>
          <span
            className={
              product.available
                ? "admin-status admin-status-completed"
                : "admin-status admin-status-cancelled"
            }
          >
            {product.available ? "Available" : "Unavailable"}
          </span>
        </div>
        <form action={updateProduct} className="admin-form-grid">
          <input type="hidden" name="id" value={product.id} />
          <AdminField label="Name" required>
            <input
              name="name"
              defaultValue={product.name}
              minLength={2}
              maxLength={120}
              required
              className={adminInput}
            />
          </AdminField>
          <AdminField label="Slug" required>
            <input
              name="slug"
              defaultValue={product.slug}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              required
              className={adminInput}
            />
          </AdminField>
          <AdminField label="Short tagline">
            <input
              name="tagline"
              defaultValue={product.tagline || ""}
              maxLength={180}
              className={adminInput}
            />
          </AdminField>
          <AdminField label="Price (NPR)" required>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={Number(product.price)}
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
              defaultValue={product.compareAtPrice ? Number(product.compareAtPrice) : ""}
              className={adminInput}
            />
          </AdminField>
          <AdminField label="Preparation days">
            <input
              name="preparationDays"
              type="number"
              min="0"
              defaultValue={product.preparationDays ?? ""}
              className={adminInput}
            />
          </AdminField>
          <AdminField label="Category" required>
            <select
              name="categoryId"
              defaultValue={product.categoryId}
              required
              className={adminInput}
            >
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                  {!item.active ? " (inactive)" : ""}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Product type" required>
            <select
              name="productTypeId"
              defaultValue={product.productTypeId}
              required
              className={adminInput}
            >
              {productTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                  {!item.active ? " (inactive)" : ""}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Dimensions">
            <input
              name="dimensions"
              defaultValue={product.dimensions || ""}
              maxLength={200}
              className={adminInput}
            />
          </AdminField>
          <AdminField label="Materials / details">
            <input
              name="materials"
              defaultValue={product.materials || ""}
              maxLength={500}
              className={adminInput}
            />
          </AdminField>
          <AdminField label="Description" required wide>
            <textarea
              name="description"
              defaultValue={product.description}
              minLength={10}
              maxLength={4000}
              required
              className={adminTextarea}
            />
          </AdminField>
          <AdminField
            label="Customization note"
            wide
            help="Shown to customers when customization is enabled."
          >
            <textarea
              name="customizationSummary"
              defaultValue={product.customizationSummary || ""}
              maxLength={1000}
              className={adminTextarea}
            />
          </AdminField>
          <div className="admin-check-row admin-field-wide">
            <label>
              <input name="available" type="checkbox" defaultChecked={product.available} />{" "}
              Available
            </label>
            <label>
              <input name="featured" type="checkbox" defaultChecked={product.featured} /> Featured
            </label>
            <label>
              <input name="customizable" type="checkbox" defaultChecked={product.customizable} />{" "}
              Customizable
            </label>
          </div>
          <AdminSubmitButton pendingLabel="Saving product…">Save product details</AdminSubmitButton>
        </form>
        <p className="admin-record-meta">
          {product._count.customizationOptions} customization options · {product._count.reviews}{" "}
          reviews · {product._count.orderRequestItems} order requests
        </p>
      </section>

      <section className="admin-card admin-media-manager">
        <div className="admin-section-heading">
          <div>
            <p>Product photography</p>
            <h2>Images</h2>
          </div>
          <span>{product.images.length} images</span>
        </div>
        <div className={`admin-storage-status ${storage.configured ? "is-ready" : "is-missing"}`}>
          <ImageIcon aria-hidden="true" />
          <div>
            <strong>
              {storage.configured
                ? `${storage.provider} connected`
                : "Cloud file uploads are unavailable"}
            </strong>
            <p>
              {storage.configured
                ? `Files are stored in ${storage.bucket}.`
                : "Add the Supabase storage server credentials. You may use a hosted external image URL in the meantime."}
            </p>
          </div>
        </div>
        <form action={addProductImage} className="admin-image-add">
          <input type="hidden" name="productId" value={product.id} />
          <AdminField label="Upload image">
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
          <AdminField label="Alternative text">
            <input
              name="alt"
              maxLength={250}
              placeholder={`${product.name}, front view`}
              className={adminInput}
            />
          </AdminField>
          <AdminSubmitButton pendingLabel="Adding image…">Add image</AdminSubmitButton>
        </form>
        {product.images.length ? (
          <div className="admin-image-grid">
            {product.images.map((image, index) => (
              <article key={image.id} className="admin-image-item">
                <div className="admin-image-preview">
                  {isRenderableImageUrl(image.url) ? (
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 220px"
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon aria-hidden="true" />
                  )}
                  {image.primary && (
                    <span>
                      <Star aria-hidden="true" /> Primary
                    </span>
                  )}
                </div>
                <form action={updateProductImage} className="admin-image-alt">
                  <input type="hidden" name="id" value={image.id} />
                  <input type="hidden" name="intent" value="alt" />
                  <label>
                    Alternative text
                    <input
                      name="alt"
                      defaultValue={image.alt || ""}
                      maxLength={250}
                      className={adminInput}
                    />
                  </label>
                  <AdminSubmitButton pendingLabel="Saving…">Save alt text</AdminSubmitButton>
                </form>
                <div className="admin-image-actions">
                  <form action={updateProductImage}>
                    <input type="hidden" name="id" value={image.id} />
                    <button
                      name="intent"
                      value="up"
                      disabled={index === 0}
                      aria-label={`Move image ${index + 1} earlier`}
                    >
                      <ArrowUp aria-hidden="true" />
                    </button>
                    <button
                      name="intent"
                      value="down"
                      disabled={index === product.images.length - 1}
                      aria-label={`Move image ${index + 1} later`}
                    >
                      <ArrowDown aria-hidden="true" />
                    </button>
                    {!image.primary && (
                      <button name="intent" value="primary">
                        <Star aria-hidden="true" /> Make primary
                      </button>
                    )}
                  </form>
                  <form action={deleteProductImage}>
                    <input type="hidden" name="id" value={image.id} />
                    <ConfirmButton
                      message={`Delete image ${index + 1} from ${product.name}? This cannot be undone.`}
                      className="is-danger"
                    >
                      <Trash2 aria-hidden="true" /> Delete
                    </ConfirmButton>
                  </form>
                </div>
                <small>
                  {image.provider || "external"} · position {index + 1}
                </small>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <ImageIcon aria-hidden="true" />
            <h3>No product photography</h3>
            <p>Add a cloud upload or hosted image URL above.</p>
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
