import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Flower2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <Container size="sm">
        <div className="space-y-5 rounded-3xl border border-brand-beige-300 bg-white/80 p-8 text-center shadow-card md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink-100 text-brand-pink-600">
            <Flower2 className="h-8 w-8" />
          </div>
          <span className="font-serif text-5xl font-bold text-brand-brown/40">404</span>
          <Heading as="h1" size="xl">
            This petal seems to have drifted away
          </Heading>
          <Text size="sm" variant="muted" className="mx-auto max-w-md">
            The page you are looking for might have been removed, had its name changed, or is
            temporarily unavailable.
          </Text>
          <div className="pt-3">
            <Link href="/">
              <Button variant="primary" size="md">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
