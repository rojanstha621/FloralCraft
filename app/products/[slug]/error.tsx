"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Product detail rendering failed:", error);
  }, [error]);

  return (
    <main className="product-route-state">
      <Container size="sm">
        <AlertCircle aria-hidden="true" />
        <p>Petal Craft product studio</p>
        <Heading as="h1" size="xl">
          This piece could not be gathered just now.
        </Heading>
        <Text size="sm" variant="muted">
          Please try again, or return to the collection while the studio page refreshes.
        </Text>
        <div>
          <button type="button" onClick={reset}>
            Try again <ArrowRight />
          </button>
          <Link href="/collections">Return to the collection</Link>
        </div>
      </Container>
    </main>
  );
}
