import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminShell, adminButton, adminCard, adminInput, adminTextarea } from "@/components/admin/admin-shell";
import { updateSettings } from "../actions";

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  const settings = await prisma.businessSettings.findUnique({ where: { id: "default" } });
  return <AdminShell session={session} title="Settings" description="Keep business contact and ordering details in one place.">
    <form action={updateSettings} className={`${adminCard} grid gap-4 md:grid-cols-2`}>
      <label className="text-xs font-semibold">Business name<input name="businessName" defaultValue={settings?.businessName || "Petal Craft Florals"} required className={`${adminInput} mt-1`} /></label><label className="text-xs font-semibold">Tagline<input name="tagline" defaultValue={settings?.tagline || ""} className={`${adminInput} mt-1`} /></label>
      <label className="text-xs font-semibold">Email<input name="email" type="email" defaultValue={settings?.email || ""} className={`${adminInput} mt-1`} /></label><label className="text-xs font-semibold">Phone<input name="phone" defaultValue={settings?.phone || ""} className={`${adminInput} mt-1`} /></label>
      <label className="text-xs font-semibold">WhatsApp number<input name="whatsappNumber" defaultValue={settings?.whatsappNumber || ""} className={`${adminInput} mt-1`} /></label><label className="text-xs font-semibold">Address<input name="address" defaultValue={settings?.address || ""} className={`${adminInput} mt-1`} /></label>
      <label className="text-xs font-semibold">Currency code<input name="currencyCode" defaultValue={settings?.currencyCode || "NPR"} className={`${adminInput} mt-1`} /></label><label className="text-xs font-semibold">Currency symbol<input name="currencySymbol" defaultValue={settings?.currencySymbol || "Rs. "} className={`${adminInput} mt-1`} /></label>
      <label className="text-xs font-semibold md:col-span-2">WhatsApp message template<textarea name="whatsappMessageTemplate" defaultValue={settings?.whatsappMessageTemplate || ""} className={`${adminTextarea} mt-1`} /></label><button className={`${adminButton} md:w-fit`}>Save settings</button>
    </form>
    <p className="mt-4 text-xs text-brand-brown-500">Cloud media credentials remain in environment variables so secret keys never enter the database or browser.</p>
  </AdminShell>;
}
