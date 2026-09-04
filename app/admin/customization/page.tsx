import Link from "next/link";
import { Palette, Settings2, Trash2 } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/utils";
import { AdminShell, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { AdminSubmitButton, ConfirmButton } from "@/components/admin/form-controls";
import {
  createCustomizationOption,
  deleteCustomizationOption,
  updateCustomizationOption,
} from "../actions";

export default async function AdminCustomizationPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireAdmin();
  const query = await searchParams;
  const [products, options] = await Promise.all([
    prisma.product.findMany({
      where: { archivedAt: null, customizable: true },
      orderBy: { name: "asc" },
    }),
    prisma.customizationOption.findMany({
      include: { product: { select: { id: true, name: true, archivedAt: true } } },
      orderBy: [{ product: { name: "asc" } }, { sortOrder: "asc" }],
    }),
  ]);
  return (
    <AdminShell
      session={session}
      title="Customization"
      description="Keep personal requests simple: enable a product, then offer only the choices customers genuinely need."
      notice={query.notice}
    >
      {products.length ? (
        <details className="admin-card admin-create-panel">
          <summary>
            <span>
              <Palette aria-hidden="true" /> Add an option
            </span>
            <small>Text, long text, or a short choice list.</small>
          </summary>
          <CustomizationForm
            action={createCustomizationOption}
            products={products}
            submitLabel="Add customization option"
          />
        </details>
      ) : (
        <div className="admin-storage-status is-missing">
          <Settings2 aria-hidden="true" />
          <div>
            <strong>No customizable products are enabled</strong>
            <p>
              Open a product and enable customization before creating options.{" "}
              <Link href="/admin/products">Manage products</Link>
            </p>
          </div>
        </div>
      )}
      <section className="admin-list-section">
        <div className="admin-section-heading">
          <div>
            <p>Customer choices</p>
            <h2>{options.length} options</h2>
          </div>
        </div>
        {options.length ? (
          <div className="admin-manage-grid">
            {options.map((option) => (
              <details key={option.id} className="admin-card admin-edit-card">
                <summary>
                  <Palette aria-hidden="true" />
                  <span>
                    <strong>{option.label}</strong>
                    <small>
                      {option.product.name} · {option.inputKind} · Sort {option.sortOrder}
                    </small>
                  </span>
                  <em className={option.active ? "is-active" : "is-inactive"}>
                    {option.active ? "Active" : "Inactive"}
                  </em>
                </summary>
                <CustomizationForm
                  action={updateCustomizationOption}
                  products={products}
                  option={{ ...option, priceAdjustment: Number(option.priceAdjustment) }}
                  submitLabel="Save option"
                />
                <form action={deleteCustomizationOption} className="admin-danger-zone">
                  <input type="hidden" name="id" value={option.id} />
                  <ConfirmButton
                    message={`Delete the ${option.label} option? Existing order snapshots will remain, but this cannot be undone.`}
                    className="admin-danger-button"
                  >
                    <Trash2 aria-hidden="true" /> Delete option
                  </ConfirmButton>
                </form>
              </details>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <Palette aria-hidden="true" />
            <h3>No customization options</h3>
            <p>
              Customizable products can still accept a conversational request without structured
              options.
            </p>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

type ProductChoice = { id: string; name: string };
type OptionValue = {
  id: string;
  productId: string;
  key: string;
  label: string;
  description: string | null;
  inputKind: string;
  required: boolean;
  choices: unknown;
  priceAdjustment: number;
  active: boolean;
  sortOrder: number;
};
function CustomizationForm({
  action,
  products,
  option,
  submitLabel,
}: {
  action: (data: FormData) => Promise<void>;
  products: ProductChoice[];
  option?: OptionValue;
  submitLabel: string;
}) {
  const choices = Array.isArray(option?.choices)
    ? option.choices.filter((item): item is string => typeof item === "string").join(", ")
    : "";
  return (
    <form action={action} className="admin-form-grid">
      {option && <input type="hidden" name="id" value={option.id} />}
      <label className="admin-field">
        <span>Product *</span>
        <select
          name="productId"
          required
          defaultValue={option?.productId || ""}
          className={adminInput}
        >
          <option value="">Choose product</option>
          {products.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-field">
        <span>Label *</span>
        <input
          name="label"
          required
          minLength={2}
          maxLength={100}
          defaultValue={option?.label}
          className={adminInput}
          placeholder="Flower colour"
        />
      </label>
      <label className="admin-field">
        <span>Key</span>
        <input name="key" pattern="[-a-z0-9]*" defaultValue={option?.key} className={adminInput} />
      </label>
      <label className="admin-field">
        <span>Input type</span>
        <select name="inputKind" defaultValue={option?.inputKind || "text"} className={adminInput}>
          <option value="text">Short text</option>
          <option value="select">Choice list</option>
          <option value="textarea">Long text</option>
        </select>
      </label>
      <label className="admin-field admin-field-wide">
        <span>Description</span>
        <textarea
          name="description"
          maxLength={500}
          defaultValue={option?.description || ""}
          className={adminTextarea}
        />
      </label>
      <label className="admin-field admin-field-wide">
        <span>Choices</span>
        <input
          name="choices"
          defaultValue={choices}
          className={adminInput}
          placeholder="Blush, Cream, Botanical green"
        />
        <small>Comma-separated. Used only when input type is Choice list.</small>
      </label>
      <label className="admin-field">
        <span>Price adjustment</span>
        <input
          name="priceAdjustment"
          type="number"
          step="0.01"
          defaultValue={option?.priceAdjustment ?? 0}
          className={adminInput}
        />
        <small>
          {option?.priceAdjustment ? formatCurrency(option.priceAdjustment) : "No adjustment"}
        </small>
      </label>
      <label className="admin-field">
        <span>Sort order</span>
        <input
          name="sortOrder"
          type="number"
          min="-9999"
          max="9999"
          defaultValue={option?.sortOrder ?? 0}
          className={adminInput}
        />
      </label>
      <div className="admin-check-row admin-field-wide">
        <label>
          <input name="required" type="checkbox" defaultChecked={option?.required} /> Required
        </label>
        <label>
          <input name="active" type="checkbox" defaultChecked={option?.active ?? true} /> Active
        </label>
      </div>
      <AdminSubmitButton pendingLabel="Saving option…">{submitLabel}</AdminSubmitButton>
    </form>
  );
}
