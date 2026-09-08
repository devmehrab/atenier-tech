"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { IPropertyImportCard, ILocalPropertyImage } from "@/lib/validations/ai-import";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Sparkles,
  Loader2,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface BulkImportCardProps {
  card: IPropertyImportCard;
  index: number;
  totalCards: number;
  onUpdateCaption: (id: string, caption: string) => void;
  onAddImages: (id: string, newImages: ILocalPropertyImage[]) => void;
  onRemoveImage: (cardId: string, imageId: string) => void;
  onSetFeaturedImage: (cardId: string, imageId: string) => void;
  onReorderImages: (cardId: string, fromIdx: number, toIdx: number) => void;
  onDeleteCard: (id: string) => void;
  onExtractSingle: (id: string) => void;
}

const SAMPLE_CAPTIONS = [
  {
    label: "Penthouse Sale (Midtown NY)",
    text: `🔥 Magnificent 3-Bedroom Luxury Penthouse with Panoramic Skyline Views!
📍 Location: 450 Lexington Avenue, Midtown, New York, NY
▫️ Size: 2,450 sq ft
▫️ Bedrooms: 3 | Bathrooms: 3.5 | Private Terrace: Yes
▫️ Parking: 2 Dedicated Covered Parking Spaces
▫️ Floor: 28th Floor (Top Floor)
▫️ Amenities: 24/7 Concierge & Security, High-Speed Elevator, Rooftop Infinity Pool, Fitness Center & Spa, Wine Cellar, Smart Home Automation.
💰 Price: $2,450,000 (Negotiable)
📞 Contact Listing Agent: +1 (212) 555-0145`,
  },
  {
    label: "Designer Apartment Rent (Brooklyn)",
    text: `Modern 2-Bedroom Designer Apartment Available for Immediate Lease!
Location: 120 Water Street, DUMBO, Brooklyn, NY
- Apartment Size: 1,350 sq ft
- 2 Bedrooms, 2 Bathrooms, Balcony, Open Chef's Kitchen
- Fully furnished with custom Italian finishes and premium appliances
- Facilities: 24/7 Doorman, Elevator, Fitness Room, Bike Storage, In-Unit Laundry
- Monthly Rent: $4,500/mo (Negotiable)
Contact for private tour: +1 (718) 555-0199`,
  },
  {
    label: "Waterfront Villa (Miami Beach)",
    text: `Stunning Waterfront Contemporary Villa with Private Dock & Heated Pool!
Location: Palm Island, Miami Beach, FL
- 5 Bedrooms, 5.5 Bathrooms, Expansive Open Living & Dining
- Heated Saltwater Pool, Outdoor Kitchen & Landscaped Gardens
- Parking: 3-Car Garage
- Asking Price: $5,850,000 (Negotiable)
- Direct Inquiries: +1 (305) 555-0122`,
  },
];

export function BulkImportCard({
  card,
  index,
  totalCards,
  onUpdateCaption,
  onAddImages,
  onRemoveImage,
  onSetFeaturedImage,
  onReorderImages,
  onDeleteCard,
  onExtractSingle,
}: BulkImportCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newLocalImages: ILocalPropertyImage[] = Array.from(files).map(
      (file, idx) => ({
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 6)}_${idx}`,
        file,
        previewUrl: URL.createObjectURL(file),
        isFeatured: card.localImages.length === 0 && idx === 0,
      })
    );

    onAddImages(card.id, newLocalImages);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInsertSample = (sampleText: string) => {
    onUpdateCaption(card.id, sampleText);
  };

  const isExtracting = card.status === "extracting";
  const isExtracted = card.status === "extracted";
  const isError = card.status === "error";

  return (
    <div
      className={`rounded-2xl border bg-card p-5 sm:p-6 shadow-sm transition-all ${
        isExtracted
          ? "border-emerald-500/50 bg-emerald-500/[0.02]"
          : isError
          ? "border-destructive/40 bg-destructive/[0.02]"
          : "border-border/60 hover:border-border"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm">
            #{index + 1}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-card-foreground">
              Property {index + 1}
            </h3>
            <p className="text-xs text-muted-foreground">
              Paste Facebook post caption & attach photos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isExtracted && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Extracted
            </span>
          )}

          {isError && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full border border-destructive/20">
              <AlertCircle className="h-3.5 w-3.5" />
              Error
            </span>
          )}

          {totalCards > 1 && (
            <button
              type="button"
              onClick={() => onDeleteCard(card.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Remove this property card"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Caption Textarea */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-card-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Facebook Post Caption *
            </label>

            {/* Quick Sample Inserter Dropdown */}
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span>Example:</span>
              {SAMPLE_CAPTIONS.map((s, idx) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleInsertSample(s.text)}
                  className="text-primary hover:underline font-semibold ml-1"
                >
                  {idx === 0 ? "Penthouse" : idx === 1 ? "Brooklyn Rent" : "Miami Villa"}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={7}
            value={card.caption}
            onChange={(e) => onUpdateCaption(card.id, e.target.value)}
            placeholder="Paste raw Facebook or social media property post here...&#10;&#10;Example:&#10;Stunning 3-Bedroom luxury apartment in Downtown. 3 Bathrooms, private balcony, chef's kitchen, garage parking. Asking $1,250,000 (negotiable). Contact: +1 (555) 019-2834..."
            className="w-full rounded-xl border border-input bg-background p-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-y font-sans leading-relaxed"
          />

          {card.errorMessage && (
            <p className="text-xs font-semibold text-destructive flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {card.errorMessage}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-muted-foreground">
              {card.caption.length} characters
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isExtracting}
              disabled={isExtracting || !card.caption.trim()}
              onClick={() => onExtractSingle(card.id)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {isExtracted ? "Re-Extract" : "Extract Details"}
            </Button>
          </div>
        </div>

        {/* Right Column: Multi-Image Uploader */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-card-foreground flex items-center gap-1.5">
              <UploadCloud className="h-3.5 w-3.5 text-primary" />
              Property Photos ({card.localImages.length})
            </label>
            <span className="text-[11px] text-muted-foreground">
              Select 5–15 photos at once
            </span>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesSelected}
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
          />

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 p-4 text-center transition-all hover:border-primary hover:bg-primary/5 cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border/60 text-primary group-hover:scale-105 transition-transform mb-2 shadow-sm">
              <UploadCloud className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-card-foreground">
              Tap to browse photos
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Multiple photos supported (JPG, PNG, WEBP)
            </p>
          </div>

          {/* Thumbnail Gallery Grid */}
          {card.localImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {card.localImages.map((img, idx) => (
                <div
                  key={img.id}
                  className={`group relative aspect-square rounded-lg overflow-hidden border bg-neutral-900 shadow-sm ${
                    img.isFeatured
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-border/60"
                  }`}
                >
                  <Image
                    src={img.previewUrl}
                    alt={`Photo ${idx + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />

                  {/* Primary Cover Badge */}
                  {img.isFeatured && (
                    <div className="absolute top-1 left-1 rounded bg-primary px-1 py-0.2 text-[9px] font-bold text-primary-foreground shadow">
                      Cover
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetFeaturedImage(card.id, img.id);
                        }}
                        className={`p-1 rounded text-[9px] font-bold ${
                          img.isFeatured
                            ? "bg-primary text-primary-foreground"
                            : "bg-black/60 text-white hover:bg-primary"
                        }`}
                        title="Make Cover Image"
                      >
                        <Star className="h-3 w-3 fill-current" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveImage(card.id, img.id);
                        }}
                        className="p-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        title="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-white text-[10px]">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onReorderImages(card.id, idx, idx - 1);
                          }}
                          className="p-0.5 rounded bg-black/60 disabled:opacity-30"
                          title="Move Left"
                        >
                          <ArrowLeft className="h-2.5 w-2.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === card.localImages.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            onReorderImages(card.id, idx, idx + 1);
                          }}
                          className="p-0.5 rounded bg-black/60 disabled:opacity-30"
                          title="Move Right"
                        >
                          <ArrowRight className="h-2.5 w-2.5" />
                        </button>
                      </div>
                      <span className="font-mono text-[9px]">#{idx + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
