import { redirect } from "next/navigation";
import { Flower2, ShieldCheck } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");
  return (
    <main className="admin-login-page">
      <section>
        <div className="admin-login-mark">
          <Flower2 aria-hidden="true" />
        </div>
        <p>Petal Craft studio</p>
        <h1>Welcome back</h1>
        <span>Sign in to manage products, requests, reviews, and studio information.</span>
        <AdminLoginForm />
        <small>
          <ShieldCheck aria-hidden="true" /> Protected administration · 8-hour signed session
        </small>
      </section>
    </main>
  );
}
