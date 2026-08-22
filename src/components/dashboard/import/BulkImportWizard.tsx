"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IPropertyImportCard,
  ILocalPropertyImage,
  ExtractedPropertyValues,
} from "@/lib/validations/ai-import";
import { PropertyFormValues } from "@/lib/validations/property";
import { ICloudinaryImage } from "@/lib/types";
import {
  extractBatchCaptionsAction,
  extractSingleCaptionAction,
  createBulkPropertiesAction,
  IBulkCreateSummary,
} from "@/lib/actions/ai-import.actions";
import { BulkImportCard } from "./BulkImportCard";
import { PropertyReviewCard } from "./PropertyReviewCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Sparkles,
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileSpreadsheet,
  Building2,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

interface BulkImportWizardProps {
  organizationSlug?: string | null;
}

export function BulkImportWizard({ organizationSlug }: BulkImportWizardProps) {
  const router = useRouter();
  const { success, error, info } = useToast();

  const [step, setStep] = useState<"input" | "review" | "complete">("input");
  const [cards, setCards] = useState<IPropertyImportCard[]>([
    {
      id: "card_1",
      caption: "",
      localImages: [],
      status: "idle",
    },
    {
      id: "card_2",
      caption: "",
      localImages: [],
      status: "idle",
    },
  ]);

  const [reviewForms, setReviewForms] = useState<Record<string, PropertyFormValues>>({});
  const [isExtractingAll, setIsExtractingAll] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState("");
  const [publishSummary, setPublishSummary] = useState<IBulkCreateSummary | null>(null);

  // Card Management
  const handleAddCard = () => {
    if (cards.length >= 15) {
      info("Maximum 15 properties can be imported in one session.");
      return;
    }

    const newId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setCards((prev) => [
      ...prev,
      {
        id: newId,
        caption: "",
        localImages: [],
        status: "idle",
      },
    ]);
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setReviewForms((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, caption, errorMessage: null } : c))
    );
  };

  const handleAddImages = (id: string, newImages: ILocalPropertyImage[]) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              localImages: [...c.localImages, ...newImages],
            }
          : c
      )
    );
  };

  const handleRemoveImage = (cardId: string, imageId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const updatedImages = c.localImages.filter((img) => img.id !== imageId);
        if (
          c.localImages.find((img) => img.id === imageId)?.isFeatured &&
          updatedImages.length > 0
        ) {
          updatedImages[0].isFeatured = true;
        }
        return { ...c, localImages: updatedImages };
      })
    );
  };

  const handleSetFeaturedImage = (cardId: string, imageId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              localImages: c.localImages.map((img) => ({
                ...img,
                isFeatured: img.id === imageId,
              })),
            }
          : c
      )
    );
  };

  const handleReorderImages = (cardId: string, fromIdx: number, toIdx: number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        if (toIdx < 0 || toIdx >= c.localImages.length) return c;
        const updated = [...c.localImages];
        const [moved] = updated.splice(fromIdx, 1);
        updated.splice(toIdx, 0, moved);
        return { ...c, localImages: updated };
      })
    );
  };

  // Convert Extracted Values to PropertyFormValues
  const mapExtractedToForm = (extracted: ExtractedPropertyValues): PropertyFormValues => {
    return {
      title: extracted.title || "Luxury Property",
      description: extracted.description || "Detailed property description",
      listingType: extracted.listingType || "SALE",
      propertyType: extracted.propertyType || "APARTMENT",
      status: "PUBLISHED",
      price: extracted.price || 15000000,
      currency: extracted.currency || "BDT",
      priceNegotiable: extracted.priceNegotiable ?? false,
      pricePeriod: extracted.pricePeriod || undefined,
      location: {
        address: extracted.location?.address || "",
        city: extracted.location?.city || "Dhaka",
        area: extracted.location?.area || "",
        state: extracted.location?.state || "Dhaka Division",
        country: extracted.location?.country || "Bangladesh",
        zipCode: extracted.location?.zipCode || "",
      },
      specifications: {
        bedrooms: extracted.specifications?.bedrooms ?? 3,
        bathrooms: extracted.specifications?.bathrooms ?? 3,
        parkingSpaces: extracted.specifications?.parkingSpaces ?? 0,
        propertySize: extracted.specifications?.propertySize ?? 1500,
        propertySizeUnit: extracted.specifications?.propertySizeUnit || "sqft",
        landSize: extracted.specifications?.landSize || undefined,
        landSizeUnit: extracted.specifications?.landSizeUnit || undefined,
        floorNumber: extracted.specifications?.floorNumber || undefined,
        totalFloors: extracted.specifications?.totalFloors || undefined,
        yearBuilt: extracted.specifications?.yearBuilt || undefined,
        furnishedStatus: extracted.specifications?.furnishedStatus || "UNFURNISHED",
      },
      amenities: extracted.amenities || [],
      features: extracted.features || [],
      images: [],
      featuredImage: "",
      isFeatured: false,
    };
  };

  // Single Caption Extraction
  const handleExtractSingle = async (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || !card.caption.trim()) {
      error("Please paste a Facebook post caption first");
      return;
    }

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: "extracting", errorMessage: null } : c))
    );

    const res = await extractSingleCaptionAction(card.caption);

    if (res.success && res.data) {
      const extracted = res.data;
      const initialForm = mapExtractedToForm(extracted);

      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? { ...c, status: "extracted", extractedData: extracted }
            : c
        )
      );

      setReviewForms((prev) => ({
        ...prev,
        [cardId]: initialForm,
      }));

      success("Property details extracted successfully!");
    } else {
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? {
                ...c,
                status: "error",
                errorMessage: res.message || "Failed to extract details",
              }
            : c
        )
      );
      error(res.message || "Extraction failed");
    }
  };

  // Batch Extraction
  const handleExtractAll = async () => {
    const validCards = cards.filter((c) => c.caption.trim().length > 0);
    if (validCards.length === 0) {
      error("Please paste captions for at least one property");
      return;
    }

    setIsExtractingAll(true);

    // Mark all as extracting
    setCards((prev) =>
      prev.map((c) =>
        c.caption.trim().length > 0
          ? { ...c, status: "extracting", errorMessage: null }
          : c
      )
    );

    const payload = validCards.map((c) => ({
      id: c.id,
      caption: c.caption,
    }));

    const res = await extractBatchCaptionsAction(payload);

    if (res.success && res.data) {
      const newReviewForms = { ...reviewForms };

      setCards((prev) =>
        prev.map((c) => {
          const itemRes = res.data?.find((r) => r.id === c.id);
          if (!itemRes) return c;

          if (itemRes.success && itemRes.data) {
            newReviewForms[c.id] = mapExtractedToForm(itemRes.data);
            return {
              ...c,
              status: "extracted",
              extractedData: itemRes.data,
              errorMessage: null,
            };
          } else {
            return {
              ...c,
              status: "error",
              errorMessage: itemRes.error || "Extraction failed for this card",
            };
          }
        })
      );

      setReviewForms(newReviewForms);
      success("Extraction complete! Proceeding to review step.");
      setStep("review");
    } else {
      error(res.message || "Batch extraction failed");
    }

    setIsExtractingAll(false);
  };

  // Upload local images to Cloudinary for a specific card
  const uploadCardImages = async (
    localImages: ILocalPropertyImage[]
  ): Promise<ICloudinaryImage[]> => {
    if (localImages.length === 0) return [];

    const uploaded: ICloudinaryImage[] = [];

    for (let i = 0; i < localImages.length; i++) {
      const local = localImages[i];
      const formData = new FormData();
      formData.append("file", local.file);

      try {
        const res = await fetch("/api/upload/direct", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.image) {
          uploaded.push({
            publicId: data.image.publicId,
            secureUrl: data.image.secureUrl,
            width: data.image.width,
            height: data.image.height,
            format: data.image.format,
            isFeatured: local.isFeatured,
            order: uploaded.length,
          });
        }
      } catch (err) {
        console.error("Image upload failed for card image:", err);
      }
    }

    return uploaded;
  };

  // Create All Properties Action
  const handleCreateAllProperties = async () => {
    setIsPublishing(true);

    const validCards = cards.filter((c) => Boolean(reviewForms[c.id]));
    if (validCards.length === 0) {
      error("No extracted properties ready to publish");
      setIsPublishing(false);
      return;
    }

    const payloadList: PropertyFormValues[] = [];

    for (let i = 0; i < validCards.length; i++) {
      const card = validCards[i];
      const form = reviewForms[card.id];

      setPublishProgress(
        `Uploading images for property ${i + 1} of ${validCards.length}...`
      );

      let uploadedImages: ICloudinaryImage[] = [];
      if (card.localImages && card.localImages.length > 0) {
        uploadedImages = await uploadCardImages(card.localImages);
      }

      const featuredImage =
        uploadedImages.find((img) => img.isFeatured)?.secureUrl ||
        uploadedImages[0]?.secureUrl ||
        "";

      payloadList.push({
        ...form,
        images: uploadedImages,
        featuredImage,
      });
    }

    setPublishProgress("Saving properties to database...");

    const res = await createBulkPropertiesAction(payloadList);

    if (res.success && res.data) {
      setPublishSummary(res.data);
      setStep("complete");
      success(res.message || "Bulk import completed successfully!");
    } else {
      error(res.message || "Failed to create properties");
    }

    setIsPublishing(false);
    setPublishProgress("");
  };

  const filledCardsCount = cards.filter((c) => c.caption.trim().length > 0).length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Wizard Step Indicator */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-card-foreground">
                AI Bulk Property Onboarding
              </h2>
              <p className="text-xs text-muted-foreground">
                Paste Facebook property posts &bull; Attach photos &bull; Review &bull; Publish in 1 click
              </p>
            </div>
          </div>

          {/* Step Pill */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span
              className={`px-3 py-1.5 rounded-full ${
                step === "input"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1. Add Posts ({filledCardsCount})
            </span>
            <span className="text-muted-foreground">→</span>
            <span
              className={`px-3 py-1.5 rounded-full ${
                step === "review"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2. Review & Publish
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: INPUT CARDS */}
      {step === "input" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-foreground">
                Property Cards ({cards.length} Total)
              </h3>
              <p className="text-xs text-muted-foreground">
                Paste each Facebook post into its own card. You can prepare up to 15 properties.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCard}
                disabled={cards.length >= 15}
                className="gap-1.5 text-xs font-semibold"
              >
                <Plus className="h-4 w-4" />
                Add Another Property
              </Button>

              <Button
                type="button"
                onClick={handleExtractAll}
                isLoading={isExtractingAll}
                disabled={isExtractingAll || filledCardsCount === 0}
                className="gap-1.5 shadow-sm font-bold text-xs"
              >
                <Sparkles className="h-4 w-4" />
                Extract All Properties ({filledCardsCount})
              </Button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-6">
            {cards.map((card, idx) => (
              <BulkImportCard
                key={card.id}
                card={card}
                index={idx}
                totalCards={cards.length}
                onUpdateCaption={handleUpdateCaption}
                onAddImages={handleAddImages}
                onRemoveImage={handleRemoveImage}
                onSetFeaturedImage={handleSetFeaturedImage}
                onReorderImages={handleReorderImages}
                onDeleteCard={handleDeleteCard}
                onExtractSingle={handleExtractSingle}
              />
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCard}
              disabled={cards.length >= 15}
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="h-4 w-4" />
              Add Property Card
            </Button>

            <Button
              type="button"
              size="lg"
              onClick={handleExtractAll}
              isLoading={isExtractingAll}
              disabled={isExtractingAll || filledCardsCount === 0}
              className="gap-2 shadow-lg font-bold"
            >
              <Sparkles className="h-4 w-4" />
              Extract All Properties ({filledCardsCount})
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW CARDS */}
      {step === "review" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-foreground">
                Review Extracted Properties
              </h3>
              <p className="text-xs text-muted-foreground">
                Verify AI extracted details, fill any missing fields, and confirm before saving.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep("input")}
              className="gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Captions
            </Button>
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {cards
              .filter((c) => Boolean(reviewForms[c.id]))
              .map((card, idx) => (
                <PropertyReviewCard
                  key={card.id}
                  card={card}
                  index={idx}
                  formData={reviewForms[card.id]}
                  onChange={(updated) =>
                    setReviewForms((prev) => ({
                      ...prev,
                      [card.id]: updated,
                    }))
                  }
                />
              ))}
          </div>

          {/* Review Sticky Footer */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("input")}
              disabled={isPublishing}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {isPublishing && (
                <span className="text-xs font-semibold text-primary animate-pulse">
                  {publishProgress}
                </span>
              )}

              <Button
                type="button"
                size="lg"
                onClick={handleCreateAllProperties}
                isLoading={isPublishing}
                disabled={isPublishing}
                className="gap-2 shadow-lg font-bold"
              >
                <CheckCircle2 className="h-4 w-4" />
                Create All Properties
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: COMPLETION SCREEN */}
      {step === "complete" && publishSummary && (
        <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-12 text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Bulk Property Import Complete!
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Successfully created {publishSummary.createdCount} new property listings in your agency catalog.
            </p>
          </div>

          {/* Summary Details Box */}
          <div className="max-w-lg mx-auto rounded-2xl border border-border/50 bg-muted/20 p-4 text-left space-y-2 text-xs">
            {publishSummary.results.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
                <span className="font-semibold text-foreground truncate max-w-xs">
                  #{i + 1}. {r.title}
                </span>
                {r.success ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Created
                  </span>
                ) : (
                  <span className="text-destructive font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Failed: {r.error}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/dashboard/properties">
              <Button size="lg" className="gap-2 shadow font-bold w-full sm:w-auto">
                <Building2 className="h-4 w-4" />
                View in Dashboard
              </Button>
            </Link>

            {organizationSlug && (
              <Link href={`/${organizationSlug}`} target="_blank">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <span>Visit Live Agency Website</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                setCards([
                  { id: "card_1", caption: "", localImages: [], status: "idle" },
                  { id: "card_2", caption: "", localImages: [], status: "idle" },
                ]);
                setReviewForms({});
                setPublishSummary(null);
                setStep("input");
              }}
              className="gap-2 w-full sm:w-auto text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Import More Properties
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
