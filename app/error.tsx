"use client";

import React, { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring if configured
    // eslint-disable-next-line no-console
    console.error("Application Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <Container size="sm">
        <div className="rounded-3xl border border-brand-pink-300/80 bg-white/90 p-8 md:p-12 text-center space-y-5 shadow-card">
          <Heading as="h1" size="xl" className="text-brand-brown">
            Something unexpected occurred
          </Heading>
          <Text size="sm" variant="muted" className="max-w-md mx-auto">
            We encountered an issue while rendering this page. Please try refreshing or contact our team in Kathmandu.
          </Text>
          <div className="flex justify-center gap-4 pt-3">
            <Button variant="primary" onClick={() => reset()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Go to Home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
