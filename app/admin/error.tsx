"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin interface error", error);
  }, [error]);
  return (
    <main className="admin-route-error">
      <p>Petal Craft administration</p>
      <h1>That admin action could not be completed.</h1>
      <span>
        Your data has not been intentionally cleared. Retry the page, or return to the dashboard and
        review the information before trying again.
      </span>
      <div>
        <button onClick={reset}>Try again</button>
        <Link href="/admin">Return to overview</Link>
      </div>
    </main>
  );
}
