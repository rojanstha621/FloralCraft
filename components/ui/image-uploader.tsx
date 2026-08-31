"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { Upload, Link as LinkIcon, X, Check, AlertCircle, ExternalLink } from "lucide-react";

interface ImageUploaderProps {
  onImagesChange: (images: { url: string; alt?: string }[]) => void;
  initialImages?: { url: string; alt?: string }[];
  maxImages?: number;
  allowExternal?: boolean;
}

export function ImageUploader({
  onImagesChange,
  initialImages = [],
  maxImages = 5,
  allowExternal = true,
}: ImageUploaderProps) {
  const [images, setImages] = useState<{ url: string; alt?: string }[]>(initialImages);
  const [uploadMode, setUploadMode] = useState<"file" | "external">("file");
  const [externalUrl, setExternalUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const validateImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      if (!url.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i)) {
        return false;
      }
      const allowedDomains = [
        "imglink.cc",
        "im.ge",
        "8upload.com",
        "i.imgur.com",
        "cdn.discordapp.com",
        "cloudinary.com",
        "amazonaws.com",
      ];
      const domain = urlObj.hostname.replace("www.", "");
      return allowedDomains.some(allowed => domain.includes(allowed) || allowed.includes(domain));
    } catch {
      return false;
    }
  };

  const handleAddExternalUrl = async () => {
    setUrlError("");
    
    if (!externalUrl.trim()) {
      setUrlError("Please enter an image URL");
      return;
    }

    if (!validateImageUrl(externalUrl)) {
      setUrlError("Invalid image URL or unsupported hosting service");
      return;
    }

    if (images.length >= maxImages) {
      setUrlError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Check for duplicates
    if (images.some(img => img.url === externalUrl)) {
      setUrlError("This image URL is already added");
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate validation by trying to load the image
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = externalUrl;
      });

      const newImages = [...images, { url: externalUrl }];
      setImages(newImages);
      onImagesChange(newImages);
      setExternalUrl("");
    } catch {
      setUrlError("Failed to load image from the provided URL");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      // This would integrate with your existing storage provider
      // For now, we'll create object URLs for preview
      const newImages: { url: string; alt?: string }[] = [];
      
      for (const file of files) {
        const objectUrl = URL.createObjectURL(file);
        newImages.push({ url: objectUrl, alt: file.name });
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      {allowExternal && (
        <div className="flex gap-2">
          <Button
            variant={uploadMode === "file" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("file")}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          <Button
            variant={uploadMode === "external" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("external")}
            className="flex-1"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            External URL
          </Button>
        </div>
      )}

      {/* File Upload Mode */}
      {uploadMode === "file" && (
        <div className="border-2 border-dashed border-brand-beige-300 rounded-2xl p-6 text-center hover:border-brand-pink-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading || images.length >= maxImages}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block"
          >
            <Upload className="h-8 w-8 mx-auto text-brand-brown-400 mb-2" />
            <Text className="text-sm text-brand-brown">
              {isUploading ? "Uploading..." : "Click to upload images"}
            </Text>
            <Text className="text-xs text-brand-brown-400 mt-1">
              {images.length}/{maxImages} images added
            </Text>
          </label>
        </div>
      )}

      {/* External URL Mode */}
      {uploadMode === "external" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Paste image URL (e.g., from ImgLink, im.ge, etc.)"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddExternalUrl()}
              disabled={isUploading || images.length >= maxImages}
              className="flex-1"
            />
            <Button
              onClick={handleAddExternalUrl}
              disabled={isUploading || images.length >= maxImages || !externalUrl.trim()}
              size="sm"
            >
              {isUploading ? "Adding..." : "Add"}
            </Button>
          </div>

          {urlError && (
            <div className="flex items-center gap-2 text-red-600 text-xs">
              <AlertCircle className="h-4 w-4" />
              <span>{urlError}</span>
            </div>
          )}

          <div className="bg-brand-cream-100 rounded-xl p-3 text-xs text-brand-brown-700">
            <p className="font-semibold mb-1">Supported free hosting services:</p>
            <ul className="space-y-1 text-brand-brown-600">
              <li>• ImgLink (imglink.cc) - Permanent links, CDN</li>
              <li>• im.ge - 10GB free, no compression</li>
              <li>• 8upload.com - Unlimited storage</li>
            </ul>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-xl overflow-hidden border border-brand-beige-300 bg-brand-cream-100">
                <Image
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X className="h-4 w-4 text-brand-brown" />
                </button>
                {index === 0 && (
                  <Badge className="absolute bottom-2 left-2 bg-brand-pink-600 text-white text-xs">
                    Primary
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <Text className="text-xs text-brand-brown-400 truncate">
                  {image.alt || `Image ${index + 1}`}
                </Text>
                {image.url.startsWith("http") && (
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-brown-400 hover:text-brand-pink-600"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-brand-brown-400 text-sm">
          No images added yet
        </div>
      )}
    </div>
  );
}