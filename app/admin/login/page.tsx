"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const result = (await response.json()) as { message?: string };
    if (!response.ok) {
      setMessage(result.message || "Unable to sign in.");
      setSubmitting(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-5 py-16">
      <section className="w-full rounded-3xl border border-brand-beige-300 bg-white p-7 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-sage-700">
          Store administration
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-brand-brown">Welcome back</h1>
        <p className="mt-2 text-sm text-brand-brown-500">
          Sign in with the administrator account configured for this environment.
        </p>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <Input id="email" name="email" type="email" autoComplete="username" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {message && (
            <p role="alert" className="text-sm text-red-700">
              {message}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </section>
    </main>
  );
}
