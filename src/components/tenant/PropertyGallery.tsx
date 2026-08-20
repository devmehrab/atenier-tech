"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ICloudinaryImage } from "@/lib/types";
import { ChevronLeft, ChevronRight, Maximize2, Building } from "lucide-react";

interface PropertyGalleryProps {
  images: ICloudinaryImage[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const displayImages = images && images.length > 0
    ? images
    : [
        {
          publicId: "placeholder",
          secureUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
        },
      ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Stage */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="group relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-950 cursor-pointer shadow-lg"
      >
        <Image
          src={currentImage.secureUrl}
          alt={`${title} - Photo ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover transition-all duration-300 group-hover:scale-[1.02]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Next / Prev Controls */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
              aria-label="Next Photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Bottom Bar: Image Count & Zoom CTA */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {selectedIndex + 1} / {displayImages.length} Photos
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Maximize2 className="h-3.5 w-3.5" />
            Expand Gallery
          </span>
        </div>
      </div>

      {/* Thumbnail Bar */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {displayImages.map((img, idx) => (
            <button
              key={img.publicId || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[16/10] h-16 sm:h-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                selectedIndex === idx
                  ? "border-primary ring-2 ring-primary/30 scale-105"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.secureUrl}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}


      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] aspect-[16/10] w-full">
            <Image
              src={currentImage.secureUrl}
              alt={title}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  );
}
