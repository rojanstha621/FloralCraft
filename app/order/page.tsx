import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flower2 } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { Container } from "@/components/ui/container";
import { OrderRequestForm } from "@/components/orders/order-request-form";

export const metadata: Metadata = {
  title: "Request an Order",
  description:
    "Request a handmade floral creation from Petal Craft Florals. Share your occasion, delivery timing, and personal details with our Kathmandu studio.",
  alternates: { canonical: "/order" },
  robots: { index: false, follow: true },
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const query = await searchParams;
  const requestedId = query.product?.trim() || "";

  const [rawProducts, requestedProduct] = await Promise.all([
    prisma.product.findMany({
      where: { archivedAt: null, available: true },
      include: {
        category: { select: { name: true } },
        productType: { select: { name: true } },
        images: { orderBy: [{ primary: "desc" }, { sortOrder: "asc" }], take: 1 },
        customizationOptions: { where: { active: true }, orderBy: { sortOrder: "asc" } },
      },
      orderBy: { name: "asc" },
    }),
    requestedId
      ? prisma.product.findUnique({
          where: { id: requestedId },
          select: { id: true, name: true, available: true, archivedAt: true },
        })
      : Promise.resolve(null),
  ]);

  const products = rawProducts.map((product) => ({
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    price: Number(product.price),
    available: product.available,
    customizable: product.customizable,
    customizationSummary: product.customizationSummary,
    preparationDays: product.preparationDays,
    category: product.category.name,
    productType: product.productType.name,
    image: product.images[0]
      ? {
          url: product.images[0].url,
          alt: product.images[0].alt || `${product.name}, handmade by Petal Craft Florals`,
        }
      : null,
    customizationOptions: product.customizationOptions.map((option) => ({
      key: option.key,
      label: option.label,
      inputKind: option.inputKind,
      required: option.required,
      choices: option.choices,
      priceAdjustment: Number(option.priceAdjustment),
    })),
  }));

  const validInitialId = products.some((product) => product.id === requestedId) ? requestedId : "";
  const initialIssue =
    requestedId && !validInitialId
      ? requestedProduct && !requestedProduct.archivedAt && !requestedProduct.available
        ? `${requestedProduct.name} is not currently available for an online request. You can still ask our studio about a future or custom piece.`
        : "That piece is no longer available to order. Please choose another studio creation below."
      : undefined;

  return (
    <main className="order-page-shell">
      <Container size="xl">
        <nav className="order-breadcrumb" aria-label="Breadcrumb">
          <Link href="/collections">
            <ArrowLeft aria-hidden="true" /> Back to the collection
          </Link>
          <span aria-hidden="true">/</span>
          <span>Order request</span>
        </nav>

        <header className="order-page-intro">
          <div className="order-intro-mark" aria-hidden="true">
            <Flower2 />
          </div>
          <p className="order-eyebrow">A personal studio service</p>
          <h1>Begin your floral story</h1>
          <p>
            Choose a piece, tell us where and when it is needed, and share any personal touches.
            Nothing is charged today—our Kathmandu studio will confirm availability, delivery, and
            the final price with you personally.
          </p>
        </header>

        <OrderRequestForm
          products={products}
          initialProductId={validInitialId}
          initialIssue={initialIssue}
        />
      </Container>
    </main>
  );
}
