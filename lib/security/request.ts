import "server-only";

export class RequestBodyError extends Error {
  constructor(public readonly kind: "too_large" | "invalid_json") {
    super(kind);
  }
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) throw new RequestBodyError("too_large");
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > maxBytes) throw new RequestBodyError("too_large");
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    throw new RequestBodyError("invalid_json");
  }
}
