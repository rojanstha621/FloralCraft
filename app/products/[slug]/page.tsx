import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Flower2, Ruler, Sparkles } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductCard } from "@/components/products/product-card";
import { ProductReviews } from "@/components/products/product-reviews";
import { RatingSummary } from "@/components/products/rating-summary";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { formatCurrency } from "@/lib/utils";

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
  if (!product) notFound();

  const description = product.tagline || product.description.slice(0, 155);
  const image = product.images[0]?.url;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | Petal Craft Florals`,
      description,
      images: image ? [{ url: image, alt: product.images[0]?.alt || product.name }] : [],
    },
  };
}

function RelatedProductsLoading() {
  return (
    <div className="product-related-loading" aria-label="Loading related products">
      {[0, 1, 2].map((item) => (
        <div key={item} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}

async function RelatedProductsSection({
  productId,
  categoryId,
}: {
  productId: string;
  categoryId: string;
}) {
  try {
    const relatedRaw = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        archivedAt: null,
      },
      include: {
        category: true,
        productType: true,
        images: { orderBy: { sortOrder: "asc" } },
        reviews: { where: { status: "APPROVED" }, select: { rating: true } },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
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

    return (
      <section className="product-related-section" aria-labelledby="related-heading">
        <div className="product-section-heading">
          <div>
            <p>From the same collection</p>
            <Heading as="h2" size="xl" id="related-heading">
              You may also be drawn to these.
            </Heading>
          </div>
          <Link href="/collections">
            View the full collection <ArrowRight />
          </Link>
        </div>

        {related.length > 0 ? (
          <div className="product-related-grid">
            {related.map((item, index) => (
              <ProductCard
                key={item.id}
                product={item}
                interactiveGallery
                editorialIndex={index + 1}
                variant="catalog"
              />
            ))}
          </div>
        ) : (
          <div className="product-related-empty">
            <Flower2 aria-hidden="true" />
            <p>This is currently the only published piece in its collection.</p>
            <Link href="/collections">Explore every floral form</Link>
          </div>
        )}
      </section>
    );
  } catch {
    return (
      <section className="product-related-section" aria-labelledby="related-heading">
        <div className="product-section-heading">
          <div>
            <p>From the atelier</p>
            <Heading as="h2" size="xl" id="related-heading">
              More pieces to discover.
            </Heading>
          </div>
        </div>
        <div className="product-related-empty" role="status">
          <p>Related pieces could not be gathered just now.</p>
          <Link href="/collections">Browse the full collection</Link>
        </div>
      </section>
    );
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const reviewCount = product.reviews.length;
  const averageRating = reviewCount
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0;
  const price = Number(product.price);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => image.url),
    category: product.productType.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      price,
      url: `/products/${product.slug}`,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
    ...(reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount,
          },
        }
      : {}),
  };

  const facts = [
    { label: "Floral form", value: product.productType.name },
    { label: "Collection", value: product.category.name },
    product.materials ? { label: "Materials", value: product.materials } : null,
    product.dimensions ? { label: "Dimensions", value: product.dimensions } : null,
    product.preparationDays
      ? {
          label: "Preparation",
          value: `${product.preparationDays} ${product.preparationDays === 1 ? "day" : "days"}`,
        }
      : null,
    {
      label: "Availability",
      value: product.available ? "Available to request" : "Available by enquiry",
    },
    {
      label: "Personalisation",
      value: product.customizable ? "Available" : "Not listed for this piece",
    },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <main className="product-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />

      <Container size="xl">
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">·</span>
          <Link href="/collections">Collections</Link>
          <span aria-hidden="true">·</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="product-hero-layout">
          <section className="product-hero-copy" aria-labelledby="product-title">
            <p className="product-classification">
              <span>{product.productType.name}</span>
              <span>{product.category.name}</span>
            </p>

            <Heading as="h1" size="2xl" id="product-title" className="product-title">
              {product.name}
            </Heading>

            <Text size="base" className="product-tagline">
              {product.tagline || product.description}
            </Text>

            <Link href="#reviews" className="product-rating-link">
              <RatingSummary rating={averageRating} count={reviewCount} />
              <span>{reviewCount ? "Read customer notes" : "Be the first to review"}</span>
            </Link>

            <div className="product-price-row">
              <div>
                <span>Made from</span>
                <strong>{formatCurrency(price)}</strong>
              </div>
              {product.compareAtPrice && (
                <del>{formatCurrency(Number(product.compareAtPrice))}</del>
              )}
            </div>

            <div className="product-status-row">
              <span className={product.available ? "is-available" : "is-enquiry"}>
                {product.available ? "Available to order" : "Enquire about availability"}
              </span>
              {product.customizable && <span>Customisable</span>}
            </div>

            <div className="product-order-actions">
              {product.available ? (
                <Link href={`/order?product=${product.id}`} className="product-order-primary">
                  Request this piece <ArrowRight />
                </Link>
              ) : (
                <WhatsAppButton
                  productName={product.name}
                  price={price}
                  label="Enquire about this piece"
                  className="product-order-primary w-full"
                />
              )}

              {product.available ? (
                <WhatsAppButton
                  productName={product.name}
                  price={price}
                  label="Ask on WhatsApp"
                  className="product-whatsapp-secondary w-full"
                />
              ) : (
                <Link href="/contact" className="product-order-secondary">
                  Contact the studio
                </Link>
              )}
            </div>

            <p className="product-order-note">
              No online payment is taken. The studio will personally confirm timing, details, and
              delivery before your order proceeds.
            </p>

            <div className="product-quick-details">
              {product.dimensions && (
                <div>
                  <Ruler aria-hidden="true" />
                  <span>
                    <small>Dimensions</small>
                    {product.dimensions}
                  </span>
                </div>
              )}
              {product.preparationDays && (
                <div>
                  <Clock aria-hidden="true" />
                  <span>
                    <small>Preparation</small>
                    {product.preparationDays} {product.preparationDays === 1 ? "day" : "days"}
                  </span>
                </div>
              )}
            </div>
          </section>

          <div className="product-hero-gallery">
            <ProductGallery images={product.images} name={product.name} />
          </div>
        </div>

        <section className="product-story-section" aria-labelledby="story-heading">
          <div>
            <p>About this piece</p>
            <Heading as="h2" size="xl" id="story-heading">
              Made to carry more than flowers.
            </Heading>
          </div>
          <div className="product-story-copy">
            <p>{product.description}</p>
            <dl className="product-facts">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {product.customizable && (
          <section className="product-custom-section" aria-labelledby="custom-heading">
            <div className="product-custom-intro">
              <Sparkles aria-hidden="true" />
              <p>Personal, without being complicated</p>
              <Heading as="h2" size="xl" id="custom-heading">
                Made personal, simply.
              </Heading>
              <Text size="sm" variant="muted">
                {product.customizationSummary ||
                  "This piece can be adapted by the studio. Share what matters, and we will guide the details."}
              </Text>
            </div>

            <div className="product-custom-options">
              {product.customizationOptions.length > 0 ? (
                product.customizationOptions.map((option, index) => {
                  const choices = Array.isArray(option.choices)
                    ? option.choices.filter(
                        (choice): choice is string => typeof choice === "string"
                      )
                    : [];
                  const adjustment = Number(option.priceAdjustment);
                  return (
                    <article key={option.id}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>
                          {option.label}
                          {option.required && <small>Required</small>}
                        </h3>
                        {option.description && <p>{option.description}</p>}
                        {choices.length > 0 && <p>{choices.join(" · ")}</p>}
                        {adjustment > 0 && <em>From +{formatCurrency(adjustment)}</em>}
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="product-custom-empty">
                  Share your preferred colors, message, photograph, or occasion when you enquire.
                  The studio will explain what is possible for this piece.
                </p>
              )}

              {product.available ? (
                <Link href={`/order?product=${product.id}`}>
                  Request a personalised version <ArrowRight />
                </Link>
              ) : (
                <WhatsAppButton
                  productName={product.name}
                  price={price}
                  label="Ask about personalising this piece"
                  className="product-custom-whatsapp"
                />
              )}
            </div>
          </section>
        )}

        <ProductReviews productId={product.id} productName={product.name} />

        <Suspense fallback={<RelatedProductsLoading />}>
          <RelatedProductsSection productId={product.id} categoryId={product.categoryId} />
        </Suspense>
      </Container>

      <div className="product-mobile-orderbar">
        <div>
          <span>From</span>
          <strong>{formatCurrency(price)}</strong>
        </div>
        {product.available ? (
          <Link href={`/order?product=${product.id}`}>Order / enquire</Link>
        ) : (
          <WhatsAppButton productName={product.name} price={price} label="Enquire" size="md" />
        )}
      </div>
    </main>
  );
}
