"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

type Option = { key: string; label: string; inputKind: string; required: boolean; choices: unknown; priceAdjustment: number };
type OrderProduct = { id: string; name: string; price: number; customizationOptions: Option[] };

export function OrderRequestForm({ products, initialProductId = "" }: { products: OrderProduct[]; initialProductId?: string }) {
  const [productId, setProductId] = useState(initialProductId);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const selected = useMemo(() => products.find((item) => item.id === productId), [products, productId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("sending");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const customization = Object.fromEntries(selected?.customizationOptions.map((option) => [option.key, String(form.get(`custom-${option.key}`) || "")]) || []);
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      customerName: form.get("customerName"), customerPhone: form.get("customerPhone"), customerEmail: form.get("customerEmail"), preferredChannel: form.get("preferredChannel"), desiredDate: form.get("desiredDate"), notes: form.get("notes"), productId: form.get("productId"), quantity: Number(form.get("quantity")), customization, website: form.get("website"),
    }) });
    const data = await response.json(); setMessage(data.requestNumber ? `${data.message} Reference: ${data.requestNumber}` : data.message); setState(response.ok ? "success" : "error");
    if (response.ok) formElement.reset();
  }
  if (state === "success") return <div className="rounded-3xl border border-brand-sage-300 bg-white p-10 text-center shadow-card"><CheckCircle2 className="mx-auto h-12 w-12 text-brand-sage-700" /><h2 className="mt-4 font-serif text-3xl font-semibold">Request received</h2><p className="mx-auto mt-3 max-w-md text-sm text-brand-brown-500">{message}</p><Button type="button" variant="outline" className="mt-6" onClick={() => setState("idle")}>Send another request</Button></div>;
  return <form onSubmit={submit} className="grid gap-5 rounded-3xl border bg-white p-6 shadow-card md:grid-cols-2 md:p-9">
    <label className="text-xs font-semibold md:col-span-2">Product *<select name="productId" required value={productId} onChange={(e) => setProductId(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border bg-white px-4 text-sm"><option value="">Choose a keepsake</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} — {formatCurrency(product.price)}</option>)}</select></label>
    <label className="text-xs font-semibold">Your name *<Input name="customerName" required minLength={2} className="mt-1" /></label><label className="text-xs font-semibold">Phone / WhatsApp *<Input name="customerPhone" required minLength={7} className="mt-1" /></label>
    <label className="text-xs font-semibold">Email<Input name="customerEmail" type="email" className="mt-1" /></label><label className="text-xs font-semibold">Preferred contact<select name="preferredChannel" className="mt-1 h-11 w-full rounded-2xl border bg-white px-4 text-sm"><option value="WHATSAPP">WhatsApp</option><option value="PHONE">Phone</option><option value="EMAIL">Email</option></select></label>
    <label className="text-xs font-semibold">Quantity<Input name="quantity" type="number" min="1" max="20" defaultValue="1" className="mt-1" /></label><label className="text-xs font-semibold">Desired date<Input name="desiredDate" type="date" className="mt-1" /></label>
    {selected?.customizationOptions.map((option) => <label key={option.key} className="text-xs font-semibold">{option.label}{option.required ? " *" : ""}{option.inputKind === "select" && Array.isArray(option.choices) ? <select name={`custom-${option.key}`} required={option.required} className="mt-1 h-11 w-full rounded-2xl border bg-white px-4 text-sm"><option value="">Choose</option>{(option.choices as string[]).map((choice) => <option key={choice}>{choice}</option>)}</select> : option.inputKind === "textarea" ? <Textarea name={`custom-${option.key}`} required={option.required} className="mt-1" /> : <Input name={`custom-${option.key}`} required={option.required} className="mt-1" />}</label>)}
    <label className="text-xs font-semibold md:col-span-2">Notes<Textarea name="notes" maxLength={1500} className="mt-1 min-h-28" placeholder="Occasion, delivery area, message card, or anything else we should know" /></label><input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
    {state === "error" && <p role="alert" className="text-sm text-red-700 md:col-span-2">{message}</p>}<Button type="submit" size="lg" disabled={state === "sending"} className="gap-2 md:col-span-2"><Send className="h-4 w-4" />{state === "sending" ? "Sending…" : "Send order request"}</Button>
  </form>;
}
