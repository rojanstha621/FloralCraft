const allowedHosts = new Set(["images.unsplash.com", "res.cloudinary.com"]);

export function isRenderableImageUrl(value: string | null | undefined) {
  if (!value) return false;
  if (value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (allowedHosts.has(url.hostname) || url.hostname.endsWith(".supabase.co"))
    );
  } catch {
    return false;
  }
}
