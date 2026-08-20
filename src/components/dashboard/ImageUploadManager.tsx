"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ICloudinaryImage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

interface ImageUploadManagerProps {
  images: ICloudinaryImage[];
  onChange: (images: ICloudinaryImage[]) => void;
  maxImages?: number;
}

export function ImageUploadManager({
  images = [],
  onChange,
  maxImages = 15,
}: ImageUploadManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    setUploading(true);
    setUploadProgress(`Uploading ${files.length} image(s)...`);

    const newImages: ICloudinaryImage[] = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload/direct", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.image) {
          const isFirstImage = newImages.length === 0;
          newImages.push({
            publicId: data.image.publicId,
            secureUrl: data.image.secureUrl,
            width: data.image.width,
            height: data.image.height,
            format: data.image.format,
            isFeatured: isFirstImage,
            order: newImages.length,
          });
        } else {
          console.error("Failed to upload:", data.error);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    onChange(newImages);
    setUploading(false);
    setUploadProgress("");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    // If we removed the featured image and there are remaining images, set the first one as featured
    if (images[index]?.isFeatured && updated.length > 0) {
      updated[0].isFeatured = true;
    }
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isFeatured: i === index,
    }));
    onChange(updated);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-6 sm:p-8 text-center transition-all hover:border-primary hover:bg-primary/5 cursor-pointer"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-sm border border-border/60 text-primary transition-transform group-hover:scale-110 mb-3">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <h4 className="text-sm font-bold text-card-foreground">
          {uploading ? uploadProgress : "Upload High-Resolution Property Images"}
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          Drag & drop images here or browse your device. JPG, PNG, WEBP up to 10MB each.
        </p>

        <span className="mt-3 text-[11px] font-semibold text-primary">
          {images.length} / {maxImages} images uploaded
        </span>
      </div>

      {/* Uploaded Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {images.map((img, index) => (
            <div
              key={img.publicId || index}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-neutral-900 shadow-sm ${
                img.isFeatured ? "border-primary ring-2 ring-primary/30" : "border-border/60"
              }`}
            >
              <Image
                src={img.secureUrl}
                alt={`Property photo ${index + 1}`}
                fill
                sizes="240px"
                className="object-cover"
              />

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                {/* Top: Primary Tag & Delete */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPrimary(index);
                    }}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold transition-colors ${
                      img.isFeatured
                        ? "bg-primary text-primary-foreground"
                        : "bg-black/60 text-white hover:bg-primary"
                    }`}
                  >
                    <Star className={`h-3 w-3 ${img.isFeatured ? "fill-current" : ""}`} />
                    {img.isFeatured ? "Primary Cover" : "Make Primary"}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    title="Remove Image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Bottom: Reorder buttons */}
                <div className="flex items-center justify-between text-white text-[11px] font-medium">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, index - 1);
                      }}
                      className="p-1 rounded bg-black/60 hover:bg-black disabled:opacity-30"
                      title="Move Left"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, index + 1);
                      }}
                      className="p-1 rounded bg-black/60 hover:bg-black disabled:opacity-30"
                      title="Move Right"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-neutral-300">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Primary badge when not hovered */}
              {img.isFeatured && (
                <div className="absolute top-2 left-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow group-hover:hidden">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

