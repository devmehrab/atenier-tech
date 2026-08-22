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
    label: "বাংলা ফ্ল্যাট বিক্রি (Gulshan-2)",
    text: `🔥 গুলশান-২ এ ১৮৫০ স্কয়ার ফিটের আল্ট্রা-লাক্সারি সাউথ-ফেসিং ফ্ল্যাট বিক্রি হবে!
📍 লোকেশন: রোড ১০৪, গুলশান-২, ঢাকা
▫️ সাইজ: ১৮৫০ স্কয়ার ফিট (sft)
▫️ বেডরুম: ৩ টি | বাথরুম: ৩ টি | বারান্দা: ৩ টি
▫️ পার্কিং: ১ টি ডেডিকেটেড কার পার্কিং
▫️ ফ্লোর: ৬ষ্ঠ তলা (জি+৯ বিল্ডিং)
▫️ সুযোগ-সুবিধা: ১০০% ফুল লোড জেনারেটর ব্যাকআপ, হাই-স্পিড প্যাসেঞ্জার লিফট, ২৪/৭ সিসিটিভি ও গার্ড সিকিউরিটি, তিতাস গ্যাস কানেকশন, রুফটপ গার্ডেন।
💰 মূল্য: ২ কোটি ২৫ লাখ টাকা (আলোচনা সাপেক্ষ)
📞 সরাসরি যোগাযোগ করুন: 01711002233`,
  },
  {
    label: "English Flat Rent (Bashundhara)",
    text: `Modern 3 BHK Apartment Available for Rent in Bashundhara R/A!
Location: Block C, Road 5, Bashundhara R/A, Dhaka
- Apartment Size: 1650 sqft
- 3 Bedrooms, 3 Bathrooms, 2 Verandas, Large Kitchen
- Fully Furnished with high-end interior and split ACs
- Facilities: Lift, Full Generator Backup, 24/7 Security, 1 Car Parking in Basement
- Monthly Rent: 55,000 BDT (Negotiable) + Service Charge 5000 BDT
Contact for visit: 01819001122`,
  },
  {
    label: "ডুপ্লেক্স ভিলা বিক্রি (Uttara)",
    text: `উত্তরা সেক্টর ৪ এ ৪২০০ স্কয়ার ফিটের এক্সক্লুসিভ ডুপ্লেক্স ভিলা বিক্রি!
- ৫ বেডরুম, ৫ বাথরুম, ড্রয়িং, ডাইনিং, ফ্যামিলি লাউঞ্জ, সার্ভেন্ট রুম
- নিজস্ব সুইমিং পুল ও রুফটপ লন
- পার্কিং: ২ টি গাড়ির
- মূল্য: ৫ কোটি ৫০ লাখ (দাম আলোচনা সাপেক্ষ)
যোগাযোগ: 01912334455`,
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
                  {idx === 0 ? "Bangla" : idx === 1 ? "English" : "Villa"}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={7}
            value={card.caption}
            onChange={(e) => onUpdateCaption(card.id, e.target.value)}
            placeholder="Paste raw Facebook property post here in Bangla or English...&#10;&#10;Example:&#10;৩ বেডরুমের ১৮৫০ স্কয়ার ফিট ফ্ল্যাট বিক্রি হবে গুলশান-২ এ। ৩ বাথ, ১ পার্কিং। মূল্য: ২ কোটি ২৫ লাখ (আলোচনা সাপেক্ষ)। যোগাযোগ: ০১৭১১..."
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
