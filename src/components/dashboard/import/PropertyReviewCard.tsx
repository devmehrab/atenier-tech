"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IPropertyImportCard } from "@/lib/validations/ai-import";
import { PropertyFormValues } from "@/lib/validations/property";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Building,
  DollarSign,
  MapPin,
  ListChecks,
  Image as ImageIcon,
  Sparkles,
  Edit3,
} from "lucide-react";

interface PropertyReviewCardProps {
  card: IPropertyImportCard;
  index: number;
  formData: PropertyFormValues;
  onChange: (updated: PropertyFormValues) => void;
}

const COMMON_AMENITIES = [
  "Full Generator Backup (100%)",
  "24/7 Security & CCTV Surveillance",
  "High-Speed Passenger Lift",
  "Covered Car Parking",
  "Titas Gas Connection / Central LPG",
  "Dedicated Prayer Room (Namaz Hall)",
  "Rooftop Garden & Community Hall",
  "Fitness Center / Gymnasium",
  "Swimming Pool",
  "Intercom & Video Door Phone",
];

export function PropertyReviewCard({
  card,
  index,
  formData,
  onChange,
}: PropertyReviewCardProps) {
  const [expanded, setExpanded] = useState(true);

  // Field validation checks
  const hasTitle = Boolean(formData.title && formData.title.trim().length >= 3);
  const hasPrice = Boolean(formData.price && formData.price > 0);
  const hasAddress = Boolean(formData.location?.address && formData.location.address.trim().length >= 2);
  const hasArea = Boolean(formData.location?.area && formData.location.area.trim().length >= 2);
  const hasCity = Boolean(formData.location?.city && formData.location.city.trim().length >= 2);
  const hasSize = Boolean(formData.specifications?.propertySize && formData.specifications.propertySize > 0);

  const isValid = hasTitle && hasPrice && hasAddress && hasArea && hasCity && hasSize;

  const handleFieldChange = (field: string, value: any) => {
    const updated = { ...formData };
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      (updated as any)[parent] = {
        ...(updated as any)[parent],
        [child]: value,
      };
    } else {
      (updated as any)[field] = value;
    }
    onChange(updated);
  };

  const toggleAmenity = (amenity: string) => {
    const current = formData.amenities || [];
    if (current.includes(amenity)) {
      onChange({
        ...formData,
        amenities: current.filter((a) => a !== amenity),
      });
    } else {
      onChange({
        ...formData,
        amenities: [...current, amenity],
      });
    }
  };

  return (
    <div
      className={`rounded-2xl border bg-card shadow-sm transition-all overflow-hidden ${
        isValid
          ? "border-border/70 hover:border-border"
          : "border-amber-500/50 bg-amber-500/[0.01]"
      }`}
    >
      {/* Header Summary Row */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/50"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm shrink-0">
            #{index + 1}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-card-foreground truncate">
                {formData.title || `Property #${index + 1} (Untitled)`}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {formData.location?.area ? `${formData.location.area}, ` : ""}
              {formData.location?.city || "Dhaka"} •{" "}
              {formData.listingType === "RENT" ? "For Rent" : "For Sale"} •{" "}
              {formData.price
                ? formData.price >= 10000000
                  ? `৳${(formData.price / 10000000).toFixed(2)} Cr`
                  : formData.price >= 100000
                  ? `৳${(formData.price / 100000).toFixed(1)} Lakh`
                  : `৳${formData.price.toLocaleString()}`
                : "No Price Set"}
            </p>
          </div>
        </div>

        {/* Validation Status Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {isValid ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle className="h-3.5 w-3.5" />
              Ready to Publish
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <AlertTriangle className="h-3.5 w-3.5" />
              Review Missing Fields
            </span>
          )}

          <div className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-muted/20 border-b border-border/40 text-xs overflow-x-auto scrollbar-none">
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            hasPrice ? "text-foreground" : "text-amber-600 font-bold"
          }`}
        >
          Price:{" "}
          {hasPrice
            ? `৳${formData.price?.toLocaleString()} ${hasPrice ? "✓" : ""}`
            : "Missing ⚠"}
        </span>
        <span className="text-muted-foreground">•</span>
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            hasAddress ? "text-foreground" : "text-amber-600 font-bold"
          }`}
        >
          Address: {hasAddress ? `${formData.location.address} ✓` : "Missing ⚠"}
        </span>
        <span className="text-muted-foreground">•</span>
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            hasSize ? "text-foreground" : "text-amber-600 font-bold"
          }`}
        >
          Size: {hasSize ? `${formData.specifications.propertySize} sqft ✓` : "Missing ⚠"}
        </span>
        <span className="text-muted-foreground">•</span>
        <span className="font-semibold text-muted-foreground">
          Photos: {card.localImages.length} attached
        </span>
      </div>

      {/* Editable Form Body */}
      {expanded && (
        <div className="p-5 sm:p-6 space-y-6 animate-in slide-in-from-top-1 duration-200">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-card-foreground mb-1">
                Property Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="e.g. Modern 3BHK Apartment in Bashundhara R/A"
                className={!hasTitle ? "border-amber-500" : ""}
              />
              {!hasTitle && (
                <p className="text-[11px] font-semibold text-amber-600 mt-1">
                  Title is required (at least 3 characters)
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-card-foreground mb-1">
                  Listing Purpose *
                </label>
                <Select
                  value={formData.listingType}
                  onChange={(e) => handleFieldChange("listingType", e.target.value)}
                >
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                  <option value="LEASE">Commercial Lease</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-bold text-card-foreground mb-1">
                  Property Category *
                </label>
                <Select
                  value={formData.propertyType}
                  onChange={(e) => handleFieldChange("propertyType", e.target.value)}
                >
                  <option value="APARTMENT">Apartment / Flat</option>
                  <option value="HOUSE">Independent House</option>
                  <option value="VILLA">Luxury Duplex / Villa</option>
                  <option value="PENTHOUSE">Penthouse</option>
                  <option value="COMMERCIAL">Commercial Space</option>
                  <option value="OFFICE">Corporate Office</option>
                  <option value="LAND">Plot / Land</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-bold text-card-foreground mb-1">
                  Listing Status *
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                >
                  <option value="PUBLISHED">Published (Live immediately)</option>
                  <option value="DRAFT">Draft</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-card-foreground mb-1">
                Property Description *
              </label>
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Full description of the property..."
              />
            </div>
          </div>

          {/* Section 2: Pricing & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
            {/* Pricing */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                Pricing Details
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-card-foreground mb-1">
                    Price (BDT) *
                  </label>
                  <Input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) =>
                      handleFieldChange("price", e.target.value ? Number(e.target.value) : 0)
                    }
                    placeholder="e.g. 18500000"
                    className={!hasPrice ? "border-amber-500" : ""}
                  />
                  {!hasPrice && (
                    <p className="text-[11px] font-semibold text-amber-600 mt-1">
                      Price is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-card-foreground mb-1">
                    Currency
                  </label>
                  <Select
                    value={formData.currency}
                    onChange={(e) => handleFieldChange("currency", e.target.value)}
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id={`neg_${card.id}`}
                  checked={formData.priceNegotiable || false}
                  onChange={(e) => handleFieldChange("priceNegotiable", e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary accent-primary cursor-pointer"
                />
                <label
                  htmlFor={`neg_${card.id}`}
                  className="text-xs font-semibold text-card-foreground cursor-pointer"
                >
                  Price is negotiable
                </label>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Location
              </h4>

              <div>
                <label className="block text-xs font-bold text-card-foreground mb-1">
                  Street / Holding Address *
                </label>
                <Input
                  value={formData.location?.address || ""}
                  onChange={(e) => handleFieldChange("location.address", e.target.value)}
                  placeholder="e.g. House 42, Road 11, Block D"
                  className={!hasAddress ? "border-amber-500" : ""}
                />
                {!hasAddress && (
                  <p className="text-[11px] font-semibold text-amber-600 mt-1">
                    Address is required
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-card-foreground mb-1">
                    Area / Neighborhood *
                  </label>
                  <Input
                    value={formData.location?.area || ""}
                    onChange={(e) => handleFieldChange("location.area", e.target.value)}
                    placeholder="e.g. Gulshan-2, Bashundhara"
                    className={!hasArea ? "border-amber-500" : ""}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-card-foreground mb-1">
                    City *
                  </label>
                  <Input
                    value={formData.location?.city || ""}
                    onChange={(e) => handleFieldChange("location.city", e.target.value)}
                    placeholder="Dhaka"
                    className={!hasCity ? "border-amber-500" : ""}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Specifications */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5 text-primary" />
              Specifications & Room Layout
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-card-foreground mb-1">
                  Bedrooms *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.specifications?.bedrooms ?? 1}
                  onChange={(e) =>
                    handleFieldChange(
                      "specifications.bedrooms",
                      e.target.value ? Number(e.target.value) : 1
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-card-foreground mb-1">
                  Bathrooms *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.specifications?.bathrooms ?? 1}
                  onChange={(e) =>
                    handleFieldChange(
                      "specifications.bathrooms",
                      e.target.value ? Number(e.target.value) : 1
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-card-foreground mb-1">
                  Floor Area (sqft) *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.specifications?.propertySize || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "specifications.propertySize",
                      e.target.value ? Number(e.target.value) : 0
                    )
                  }
                  placeholder="e.g. 1850"
                  className={!hasSize ? "border-amber-500" : ""}
                />
                {!hasSize && (
                  <p className="text-[11px] font-semibold text-amber-600 mt-1">
                    Size is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-card-foreground mb-1">
                  Parking Spaces
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.specifications?.parkingSpaces ?? 0}
                  onChange={(e) =>
                    handleFieldChange(
                      "specifications.parkingSpaces",
                      e.target.value ? Number(e.target.value) : 0
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Section 4: Amenities Tags */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Building Amenities & Backup Facilities
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {COMMON_AMENITIES.map((amenity) => {
                const isSelected = (formData.amenities || []).includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-2 rounded-xl text-left text-xs font-semibold transition-all border ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`h-3 w-3 rounded-full shrink-0 border ${
                          isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                        }`}
                      />
                      <span className="truncate">{amenity}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attached Photos Preview */}
          {card.localImages.length > 0 && (
            <div className="pt-4 border-t border-border/50 space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-primary" />
                Attached Photos ({card.localImages.length})
              </label>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {card.localImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative h-16 w-20 rounded-lg overflow-hidden border border-border/60 shrink-0 bg-neutral-900"
                  >
                    <Image
                      src={img.previewUrl}
                      alt={`Photo ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    {img.isFeatured && (
                      <div className="absolute bottom-0 inset-x-0 bg-primary text-[8px] font-bold text-primary-foreground text-center py-0.5">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
