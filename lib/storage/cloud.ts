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

async function uploadMediaAtKey(
  file: File,
  key: string,
  options: { maxBytes: number; upsert: boolean }
): Promise<StoredMedia> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files can be uploaded.");
  if (file.size > options.maxBytes)
    throw new Error(
      `Images must be smaller than ${Math.floor(options.maxBytes / 1024 / 1024)} MB.`
    );

  const { baseUrl, serviceKey, bucket } = storageConfiguration();
  const response = await fetch(
    `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${key}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": file.type,
        "x-upsert": String(options.upsert),
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

export async function uploadProductMedia(file: File): Promise<StoredMedia | null> {
  if (!file.size) return null;
  const extension =
    file.name
      .split(".")
      .pop()
      ?.replace(/[^a-z0-9]/gi, "")
      .toLowerCase() || "jpg";
  const key = `products/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
  return uploadMediaAtKey(file, key, { maxBytes: 8 * 1024 * 1024, upsert: false });
}

export async function uploadBrandLogo(file: File): Promise<StoredMedia | null> {
  if (!file.size) return null;
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    throw new Error("The logo must be a PNG, JPEG, or WebP image.");
  }
  const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isPng =
    file.type === "image/png" &&
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (byte, index) => signature[index] === byte
    );
  const isJpeg =
    file.type === "image/jpeg" &&
    signature[0] === 0xff &&
    signature[1] === 0xd8 &&
    signature[2] === 0xff;
  const isWebp =
    file.type === "image/webp" &&
    String.fromCharCode(...signature.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...signature.slice(8, 12)) === "WEBP";
  if (!isPng && !isJpeg && !isWebp) throw new Error("The selected file is not a valid image.");
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const uploaded = await uploadMediaAtKey(
    file,
    `site-assets/branding/${randomUUID()}.${extension}`,
    {
      maxBytes: 4 * 1024 * 1024,
      upsert: false,
    }
  );
  return uploaded;
}

export async function deleteBrandLogo(key: string) {
  if (!key.startsWith("site-assets/branding/")) return;
  return deleteProductMedia("supabase", key);
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
