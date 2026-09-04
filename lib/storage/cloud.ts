import { randomUUID } from "node:crypto";

export interface StoredMedia {
  url: string;
  provider: string;
  key: string;
}

export function getMediaStorageStatus() {
  const configured = Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY)
  );
  return {
    configured,
    provider: configured ? "Supabase Storage" : "Not configured",
    bucket: process.env.SUPABASE_STORAGE_BUCKET || "product-images",
  };
}

function storageConfiguration() {
  const baseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(
    /\/$/,
    ""
  );
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";
  if (!baseUrl || !serviceKey) {
    throw new Error(
      "Cloud media is not configured. Add SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET to the server environment."
    );
  }
  return { baseUrl, serviceKey, bucket };
}

export async function uploadProductMedia(file: File): Promise<StoredMedia | null> {
  if (!file.size) return null;
  if (!file.type.startsWith("image/")) throw new Error("Only image files can be uploaded.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Images must be smaller than 8 MB.");

  const { baseUrl, serviceKey, bucket } = storageConfiguration();
  const extension =
    file.name
      .split(".")
      .pop()
      ?.replace(/[^a-z0-9]/gi, "")
      .toLowerCase() || "jpg";
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
  if (!response.ok) {
    const detail = (await response.text()).replace(/\s+/g, " ").slice(0, 240);
    throw new Error(`Cloud upload failed (${response.status})${detail ? `: ${detail}` : "."}`);
  }
  return {
    url: `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${key}`,
    provider: "supabase",
    key,
  };
}

export async function deleteProductMedia(provider: string | null, key: string | null) {
  if (provider !== "supabase" || !key) return;
  const { baseUrl, serviceKey, bucket } = storageConfiguration();
  const response = await fetch(
    `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${key}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
    }
  );
  if (!response.ok && response.status !== 404) {
    throw new Error(`Cloud media deletion failed (${response.status}).`);
  }
}
