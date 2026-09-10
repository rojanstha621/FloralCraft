export function createOrderTrackingPath(requestNumber: string, rawToken: string): string {
  return `/track/${encodeURIComponent(requestNumber)}/${encodeURIComponent(rawToken)}`;
}

export function createOrderTrackingUrl(requestNumber: string, rawToken: string): string {
  const path = createOrderTrackingPath(requestNumber, rawToken);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  return siteUrl ? `${siteUrl}${path}` : path;
}
