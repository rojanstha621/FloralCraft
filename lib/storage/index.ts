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
 * External URL Storage Provider for using third-party image hosting services
 * (e.g., ImgLink, im.ge, 8upload, or any CDN)
 */
class ExternalStorageProvider implements StorageProvider {
  private allowedDomains: string[] = [
    "imglink.cc",
    "im.ge", 
    "8upload.com",
    "i.imgur.com",
    "cdn.discordapp.com",
    "cloudinary.com",
    "amazonaws.com",
  ];

  private isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Check if it's a valid image URL
      if (!url.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i)) {
        return false;
      }

      // Check if domain is allowed (basic security measure)
      const domain = urlObj.hostname.replace("www.", "");
      return this.allowedDomains.some(allowed => domain.includes(allowed) || allowed.includes(domain));
    } catch {
      return false;
    }
  }

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    folder = "general"
  ): Promise<StorageUploadResult> {
    // For external provider, we don't actually upload files
    // This method is provided for interface compatibility
    // The actual workflow is to provide direct URLs
    throw new Error(
      "External storage provider does not support file uploads. " +
      "Please use direct image URLs from your hosting service."
    );
  }

  async uploadFromUrl(
    url: string,
    fileName?: string
  ): Promise<StorageUploadResult> {
    if (!this.isValidImageUrl(url)) {
      throw new Error("Invalid or unauthorized image URL provided");
    }

    // Extract filename from URL or use provided name
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const extractedName = fileName || pathname.split("/").pop() || "image";

    // Generate a key for reference (could be the URL itself or a shortened version)
    const key = `external/${extractedName}`;

    return {
      url: url,
      key: key,
      size: 0, // Unknown size for external URLs
      mimeType: this.getMimeTypeFromUrl(url),
      provider: "external",
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    // For external URLs, we can't actually delete the file
    // This is a no-op for external provider
    console.log(`External storage: cannot delete file ${key} (hosted externally)`);
    return true;
  }

  getPublicUrl(key: string): string {
    // For external provider, the key might be the full URL
    if (key.startsWith("http://") || key.startsWith("https://")) {
      return key;
    }
    // If it's just a reference key, we'd need to store the mapping
    // For now, return as-is
    return key;
  }

  private getMimeTypeFromUrl(url: string): string {
    const extension = url.split(".").pop()?.toLowerCase() || "jpg";
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      svg: "image/svg+xml",
      avif: "image/avif",
    };
    return mimeTypes[extension] || "image/jpeg";
  }
}

/**
 * Factory for retrieving the configured storage provider
 */
export function getStorageProvider(): StorageProvider {
  switch (env.STORAGE_PROVIDER) {
    case "cloudinary":
      return new CloudinaryStorageProvider();
    case "external":
      return new ExternalStorageProvider();
    case "local":
    default:
      return new LocalStorageProvider();
  }
}

export * from "./types";
