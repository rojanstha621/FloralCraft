import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export interface StoredMedia {
  url: string;
  provider: string;
  key: string;
}

export async function uploadProductMedia(file: File): Promise<StoredMedia | null> {
  if (!file.size) return null;
  if (!file.type.startsWith("image/")) throw new Error("Only image files can be uploaded.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Images must be smaller than 8 MB.");

  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";
  if (!baseUrl || !serviceKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Cloud media is not configured. Add the Supabase storage values to .env.");
    }

    const extension =
      file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
    const filename = `${randomUUID()}.${extension}`;
    const uploadDirectory = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, filename), Buffer.from(await file.arrayBuffer()));
    return {
      url: `/uploads/products/${filename}`,
      provider: "local-development",
      key: `products/${filename}`,
    };
  }

  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const key = `products/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
  const response = await fetch(
    `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${key}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: Buffer.from(await file.arrayBuffer()),
    }
  );
  if (!response.ok) throw new Error(`Cloud upload failed (${response.status}).`);
  return {
    url: `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${key}`,
    provider: "supabase",
    key,
  };
}
