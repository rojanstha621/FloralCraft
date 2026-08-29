export interface StorageUploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
  provider: "local" | "cloudinary" | "s3";
}

export interface StorageProvider {
  uploadFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    folder?: string
  ): Promise<StorageUploadResult>;
  deleteFile(key: string): Promise<boolean>;
  getPublicUrl(key: string): string;
}
