import { Container } from "@/components/ui/container";

export default function ProductLoading() {
  return (
    <main className="product-detail-page" aria-label="Loading product details">
      <Container size="xl">
        <div className="product-loading-breadcrumb" aria-hidden="true" />
        <div className="product-loading-hero">
          <div className="product-loading-image" aria-hidden="true" />
          <div className="product-loading-copy" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </Container>
    </main>
  );
}
