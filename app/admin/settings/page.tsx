import Image from "next/image";
import { Cloud, Globe2, ImageIcon, MessageCircle, Store } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { getMediaStorageStatus } from "@/lib/storage/cloud";
import { AdminShell, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { AdminSubmitButton } from "@/components/admin/form-controls";
import { updateSettings } from "../actions";

function objectValue(value: unknown, key: string) {
  return value && typeof value === "object" && key in value
    ? String((value as Record<string, unknown>)[key] || "")
    : "";
}
function orderingEnabled(value: unknown, key: string, fallback: boolean) {
  if (!value || typeof value !== "object") return fallback;
  const method = (value as Record<string, unknown>)[key];
  return method && typeof method === "object" && "enabled" in method
    ? Boolean((method as { enabled?: unknown }).enabled)
    : fallback;
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireAdmin();
  const query = await searchParams;
  const settings = await prisma.businessSettings.findUnique({ where: { id: "default" } });
  const storage = getMediaStorageStatus();
  const logoUrl = objectValue(settings?.homepage, "logoUrl");
  return (
    <AdminShell
      session={session}
      title="Business settings"
      description="Maintain the contact, social, opening-hour, and ordering information used by the studio."
      notice={query.notice}
    >
      <form action={updateSettings} className="admin-settings-form">
        <section className="admin-card">
          <div className="admin-section-heading">
            <div>
              <p>Identity</p>
              <h2>
                <Store aria-hidden="true" /> Studio details
              </h2>
            </div>
          </div>
          <div className="admin-form-grid">
            <Field label="Business name" required>
              <input
                name="businessName"
                defaultValue={settings?.businessName || "Petal Craft Florals"}
                required
                maxLength={120}
                className={adminInput}
              />
            </Field>
            <Field label="Tagline">
              <input
                name="tagline"
                defaultValue={settings?.tagline || ""}
                maxLength={240}
                className={adminInput}
              />
            </Field>
            <Field label="Email">
              <input
                name="email"
                type="email"
                defaultValue={settings?.email || ""}
                maxLength={160}
                className={adminInput}
              />
            </Field>
            <Field label="Phone">
              <input
                name="phone"
                defaultValue={settings?.phone || ""}
                maxLength={40}
                className={adminInput}
              />
            </Field>
            <Field label="WhatsApp number" help="International digits only is recommended.">
              <input
                name="whatsappNumber"
                defaultValue={settings?.whatsappNumber || ""}
                maxLength={40}
                className={adminInput}
              />
            </Field>
            <Field label="Address">
              <input
                name="address"
                defaultValue={settings?.address || ""}
                maxLength={300}
                className={adminInput}
              />
            </Field>
            <Field
              label="Opening hours"
              wide
              help="A concise customer-facing summary, such as Sun–Fri, 10:00–18:00."
            >
              <textarea
                name="openingHours"
                defaultValue={objectValue(settings?.openingHours, "display")}
                maxLength={500}
                className={adminTextarea}
              />
            </Field>
          </div>
          <div className="admin-logo-manager">
            <div className="admin-logo-preview">
              {logoUrl ? (
                <Image src={logoUrl} alt="Current Petal Craft logo" fill sizes="160px" />
              ) : (
                <div>
                  <ImageIcon aria-hidden="true" />
                  <span>No logo uploaded</span>
                </div>
              )}
            </div>
            <div className="admin-logo-fields">
              <strong>Brand logo</strong>
              <p>
                Upload a transparent PNG, JPEG, or WebP. A wide or square image works best; maximum
                file size is 4 MB.
              </p>
              <input
                name="logo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className={adminInput}
              />
              {logoUrl && (
                <label className="admin-logo-remove">
                  <input name="removeLogo" type="checkbox" /> Remove the current logo and use the PC
                  monogram
                </label>
              )}
            </div>
          </div>
        </section>
        <section className="admin-card">
          <div className="admin-section-heading">
            <div>
              <p>Customer channels</p>
              <h2>
                <Globe2 aria-hidden="true" /> Social links
              </h2>
            </div>
          </div>
          <div className="admin-form-grid">
            <Field label="Instagram">
              <input
                name="instagram"
                type="url"
                defaultValue={objectValue(settings?.socialLinks, "instagram")}
                className={adminInput}
              />
            </Field>
            <Field label="Facebook">
              <input
                name="facebook"
                type="url"
                defaultValue={objectValue(settings?.socialLinks, "facebook")}
                className={adminInput}
              />
            </Field>
            <Field label="TikTok">
              <input
                name="tiktok"
                type="url"
                defaultValue={objectValue(settings?.socialLinks, "tiktok")}
                className={adminInput}
              />
            </Field>
            <Field label="Other social link">
              <input
                name="otherSocial"
                type="url"
                defaultValue={objectValue(settings?.socialLinks, "other")}
                className={adminInput}
              />
            </Field>
          </div>
        </section>
        <section className="admin-card">
          <div className="admin-section-heading">
            <div>
              <p>Requests</p>
              <h2>
                <MessageCircle aria-hidden="true" /> Ordering methods
              </h2>
            </div>
          </div>
          <div className="admin-check-row">
            <label>
              <input
                name="websiteOrdering"
                type="checkbox"
                defaultChecked={orderingEnabled(settings?.orderingMethods, "website", true)}
              />{" "}
              Website order requests
            </label>
            <label>
              <input
                name="whatsappOrdering"
                type="checkbox"
                defaultChecked={orderingEnabled(settings?.orderingMethods, "whatsapp", true)}
              />{" "}
              WhatsApp enquiries
            </label>
          </div>
          <div className="admin-form-grid admin-settings-spacer">
            <Field
              label="WhatsApp message template"
              wide
              help="Saved for customer-contact integration. Product-specific messages still add relevant context automatically."
            >
              <textarea
                name="whatsappMessageTemplate"
                defaultValue={settings?.whatsappMessageTemplate || ""}
                maxLength={1500}
                className={adminTextarea}
              />
            </Field>
            <Field label="Currency code" required>
              <input
                name="currencyCode"
                defaultValue={settings?.currencyCode || "NPR"}
                minLength={3}
                maxLength={3}
                required
                className={adminInput}
              />
            </Field>
            <Field label="Currency symbol" required>
              <input
                name="currencySymbol"
                defaultValue={settings?.currencySymbol || "Rs. "}
                maxLength={10}
                required
                className={adminInput}
              />
            </Field>
          </div>
        </section>
        <section className="admin-card">
          <div className="admin-section-heading">
            <div>
              <p>Infrastructure</p>
              <h2>
                <Cloud aria-hidden="true" /> Media storage
              </h2>
            </div>
            <span
              className={`admin-status ${storage.configured ? "admin-status-completed" : "admin-status-cancelled"}`}
            >
              {storage.configured ? "Connected" : "Action required"}
            </span>
          </div>
          <div className={`admin-storage-status ${storage.configured ? "is-ready" : "is-missing"}`}>
            <Cloud aria-hidden="true" />
            <div>
              <strong>{storage.provider}</strong>
              <p>
                {storage.configured
                  ? `Product uploads use the ${storage.bucket} Supabase bucket. Credentials remain server-only.`
                  : "Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET in the deployment environment. No local production fallback is used."}
              </p>
            </div>
          </div>
        </section>
        <div className="admin-settings-save">
          <AdminSubmitButton pendingLabel="Saving all settings…">
            Save business settings
          </AdminSubmitButton>
          <p>Contact and public-facing content settings are validated on the server.</p>
        </div>
      </form>
    </AdminShell>
  );
}

function Field({
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
