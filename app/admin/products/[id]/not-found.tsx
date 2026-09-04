import Link from "next/link";

export default function AdminProductNotFound() {
  return (
    <main className="admin-route-error">
      <p>Product record</p>
      <h1>This product is unavailable or archived.</h1>
      <span>
        The record may have been archived in another session. Historical orders remain preserved.
      </span>
      <div>
        <Link href="/admin/products">Return to products</Link>
      </div>
    </main>
  );
}
