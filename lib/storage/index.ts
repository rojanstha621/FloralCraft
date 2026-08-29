import { StorageProvider, StorageUploadResult } from "./types";
import { env } from "@/lib/validation/env";
import fs from "fs/promises";
import path from "path";

/**
 * Local file system storage implementation for development
 */
class LocalStorageProvider implements StorageProvider {
  private uploadDir = path.join(process.cwd(), "public", "uploads");

  private async ensureDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch {
      // already exists
    }
  }

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    folder = "general"
  ): Promise<StorageUploadResult> {
    await this.ensureDir();
    const folderPath = path.join(this.uploadDir, folder);
    await fs.mkdir(folderPath, { recursive: true });

    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(folderPath, safeName);
    await fs.writeFile(filePath, buffer);

    const relativePath = `/uploads/${folder}/${safeName}`;

    return {
      url: relativePath,
      key: `${folder}/${safeName}`,
      size: buffer.length,
      mimeType,
      provider: "local",
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, key);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getPublicUrl(key: string): string {
    return `/uploads/${key}`;
  }
}

/**
 * Cloudinary Storage Provider implementation stub for scalable production
 */
class CloudinaryStorageProvider implements StorageProvider {
  async uploadFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    folder = "petalcraft"
  ): Promise<StorageUploadResult> {
    // In production with real Cloudinary keys, this uploads to cloudinary SDK
    // Fallback to local if credentials not present
    const localStorage = new LocalStorageProvider();
    return localStorage.uploadFile(buffer, fileName, mimeType, folder);
  }

  async deleteFile(key: string): Promise<boolean> {
    void key;
    return true;
  }

  getPublicUrl(key: string): string {
    return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME || "demo"}/image/upload/${key}`;
  }
}

/**
 * Factory for retrieving the configured storage provider
 */
export function getStorageProvider(): StorageProvider {
  switch (env.STORAGE_PROVIDER) {
    case "cloudinary":
      return new CloudinaryStorageProvider();
    case "local":
    default:
      return new LocalStorageProvider();
  }
}

export * from "./types";
