import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Heart, Layers, Ruler, ShieldCheck, Truck } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductCard } from "@/components/products/product-card";
import { RatingSummary } from "@/components/products/rating-summary";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { formatCurrency, formatDate } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, archivedAt: null },
    include: {
      category: true,
      productType: true,
      images: { orderBy: { sortOrder: "asc" } },
      customizationOptions: {
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      },
      reviews: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Keepsake not found" };
  const image = product.images[0]?.url;
  return {
    title: product.name,
    description: product.tagline || product.description.slice(0, 155),
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.tagline || product.description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const reviewCount = product.reviews.length;
  const averageRating = reviewCount
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0;
  const relatedRaw = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      archivedAt: null,
    },
    include: {
      category: true,
      productType: true,
      images: true,
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
    take: 3,
  });
  const related = relatedRaw.map(({ reviews, ...item }) => ({
    ...item,
    price: Number(item.price),
    compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
    averageRating: reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0,
    reviewCount: reviews.length,
  }));
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => image.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      price: Number(product.price),
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
    ...(reviewCount
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: averageRating, reviewCount } }
      : {}),
  };

  return (
    <div className="py-8 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <Container size="xl">
        <nav
          className="mb-7 flex flex-wrap items-center gap-2 text-xs text-brand-brown-400"
          aria-label="Breadcrumb"
        >
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/collections">Collections</Link>
          <span>/</span>
          <span className="text-brand-brown">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>
          <section className="space-y-6 lg:col-span-5">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="sage">{product.category.name}</Badge>
                <Badge>{product.productType.name}</Badge>
              </div>
              <Heading as="h1" size="xl">
                {product.name}
              </Heading>
              <Text size="sm" variant="muted">
                {product.tagline || product.description}
              </Text>
              <RatingSummary rating={averageRating} count={reviewCount} />
            </div>
            <div className="border-y border-brand-beige-200 py-4">
              <span className="font-serif text-3xl font-bold text-brand-brown">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="ml-3 text-sm text-brand-brown-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 rounded-2xl border bg-white/70 p-3">
                <Ruler className="h-4 w-4 text-brand-sage-700" />
                <span>{product.dimensions || "Ask for sizing"}</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border bg-white/70 p-3">
                <Clock className="h-4 w-4 text-brand-pink-600" />
                <span>
                  {product.preparationDays
                    ? `${product.preparationDays} day preparation`
                    : "Preparation time on request"}
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={`/order?product=${product.id}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-semibold text-white transition hover:bg-brand-brown-700"
              >
                Request this piece
              </Link>
              <WhatsAppButton
                productName={product.name}
                price={Number(product.price)}
                label="Order via WhatsApp"
                className="w-full"
              />
            </div>
            <p className="text-center text-[11px] leading-relaxed text-brand-brown-400">
              Ask about availability, delivery date, and any special request directly with our
              Kathmandu studio.
            </p>
            <div className="space-y-4 rounded-3xl border border-brand-beige-300 bg-white/70 p-6">
              <div>
                <h2 className="font-serif text-lg font-semibold">About this keepsake</h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-brown-600">
                  {product.description}
                </p>
                {product.customizable && product.customizationSummary && (
                  <p className="mt-3 text-sm leading-relaxed text-brand-brown-500">
                    <strong>Customization:</strong> {product.customizationSummary}
                  </p>
                )}
              </div>
              {product.materials && (
                <div className="flex gap-3 border-t pt-4">
                  <Layers className="mt-0.5 h-4 w-4 shrink-0 text-brand-sage-700" />
                  <div>
                    <h3 className="text-xs font-bold">Materials</h3>
                    <p className="mt-1 text-xs leading-relaxed text-brand-brown-500">
                      {product.materials}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="grid gap-3 text-xs sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-brand-pink-500" /> Handmade in Nepal
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-sage-700" /> Secure packaging
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-brand-brown" /> Delivery arranged
              </div>
            </div>
          </section>
        </div>

        <section className="mt-16 border-t pt-12" id="reviews">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <Badge variant="pink">Customer love</Badge>
              <Heading as="h2" size="lg" className="mt-2">
                Reviews for {product.name}
              </Heading>
            </div>
            <RatingSummary rating={averageRating} count={reviewCount} />
          </div>
          {product.reviews.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {product.reviews.map((review) => (
                <article key={review.id} className="rounded-3xl border bg-white p-6 shadow-card">
                  <RatingSummary rating={review.rating} count={1} />
                  <p className="mt-4 font-serif text-base italic leading-relaxed">
                    &ldquo;{review.body}&rdquo;
                  </p>
                  <div className="mt-5 border-t pt-3 text-xs">
                    <strong>{review.reviewerName}</strong>
                    <span className="ml-2 text-brand-brown-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-3xl border bg-white/60 p-8 text-center text-sm text-brand-brown-500">
              No approved reviews yet. Be the first to share your experience.
            </p>
          )}
          <div className="mt-6">
            <Link
              href={`/reviews?product=${product.id}`}
              className="text-sm font-semibold text-brand-brown underline underline-offset-4"
            >
              Write a review
            </Link>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-16 border-t pt-12">
            <Heading as="h2" size="lg" className="mb-7">
              More from this collection
            </Heading>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
