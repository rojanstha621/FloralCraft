import prisma from "@/lib/db/prisma";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { OrderRequestForm } from "@/components/orders/order-request-form";

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const query = await searchParams;
  const raw = await prisma.product.findMany({ where: { archivedAt: null, available: true }, include: { customizationOptions: { where: { active: true }, orderBy: { sortOrder: "asc" } } }, orderBy: { name: "asc" } });
  const products = raw.map((product) => ({ id: product.id, name: product.name, price: Number(product.price), customizationOptions: product.customizationOptions.map((option) => ({ key: option.key, label: option.label, inputKind: option.inputKind, required: option.required, choices: option.choices, priceAdjustment: Number(option.priceAdjustment) })) }));
  return <div className="py-10 md:py-16"><Container size="lg"><header className="mx-auto mb-9 max-w-2xl text-center"><Badge variant="pink">Order request</Badge><Heading as="h1" size="2xl" className="mt-3">Let’s make something meaningful</Heading><Text variant="muted" className="mt-3">Choose a piece and share your date and preferences. No payment is taken here—we’ll personally confirm availability, customization, delivery, and final price.</Text></header><OrderRequestForm products={products} initialProductId={query.product || ""} /></Container></div>;
}
