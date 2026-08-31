export interface StorageUploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
  provider: "local" | "cloudinary" | "s3" | "external" | "supabase";
}

export interface StorageProvider {
  uploadFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    folder?: string
  ): Promise<StorageUploadResult>;
  uploadFromUrl?(url: string, fileName?: string): Promise<StorageUploadResult>;
  deleteFile(key: string): Promise<boolean>;
  getPublicUrl(key: string): string;
}
