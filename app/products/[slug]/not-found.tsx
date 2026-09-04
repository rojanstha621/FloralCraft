import Link from "next/link";
import { ArrowRight, Flower2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function ProductNotFound() {
  return (
    <main className="product-route-state">
      <Container size="sm">
        <Flower2 aria-hidden="true" />
        <p>Piece not found</p>
        <Heading as="h1" size="xl">
          This floral piece is no longer on the worktable.
        </Heading>
        <Text size="sm" variant="muted">
          It may have moved, or it may have been a one-of-one creation. Explore the current atelier
          collection instead.
        </Text>
        <div>
          <Link href="/collections">
            Explore the collection <ArrowRight />
          </Link>
          <Link href="/contact">Ask the studio</Link>
        </div>
      </Container>
    </main>
  );
}
