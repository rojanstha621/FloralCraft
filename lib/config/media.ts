const PUBLIC_MEDIA_BASE =
  "https://pvjkjwrpqhzrhkuybeyk.supabase.co/storage/v1/object/public/product-images";

export function mediaUrl(path: string) {
  return `${PUBLIC_MEDIA_BASE}/${path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}
