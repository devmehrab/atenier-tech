"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyFormSchema, PropertyFormValues } from "@/lib/validations/property";
import { createPropertyAction, updatePropertyAction } from "@/lib/actions/property.actions";
import { useToast } from "@/components/ui/toast";
import { ImageUploadManager } from "./ImageUploadManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { IProperty, ICloudinaryImage } from "@/lib/types";
import {
  Building,
  DollarSign,
  MapPin,
  ListChecks,
  Image as ImageIcon,
  Save,
  CheckCircle,
  Eye,
} from "lucide-react";

interface PropertyFormProps {
  initialData?: IProperty;
  mode?: "create" | "edit";
  tenantSlug?: string | null;
}

const COMMON_AMENITIES = [
  "Swimming Pool",
  "Fitness Center / Gym",
  "24/7 Security & CCTV",
  "Elevator / Lift",
  "Backup Generator",
  "Private Balcony",
  "Landscaped Garden",
  "Covered Parking",
  "Central Air Conditioning",
  "High-Speed Fiber Internet",
  "Rooftop Terrace",
  "Pet Friendly",
  "Smart Home Automation",
  "Concierge Service",
  "Fire Suppression System",
];

export function PropertyForm({
  initialData,
  mode = "create",
  tenantSlug,
}: PropertyFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: PropertyFormValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    listingType: initialData?.listingType || "SALE",
    propertyType: initialData?.propertyType || "APARTMENT",
    status: initialData?.status || "DRAFT",
    price: initialData?.price || 500000,
    currency: initialData?.currency || "USD",
    priceNegotiable: initialData?.priceNegotiable ?? false,
    pricePeriod: initialData?.pricePeriod,
    location: {
      address: initialData?.location?.address || "",
      city: initialData?.location?.city || "",
      area: initialData?.location?.area || "",
      state: initialData?.location?.state || "",
      country: initialData?.location?.country || "US",
      zipCode: initialData?.location?.zipCode || "",
      latitude: initialData?.location?.latitude,
      longitude: initialData?.location?.longitude,
    },
    specifications: {
      bedrooms: initialData?.specifications?.bedrooms ?? 3,
      bathrooms: initialData?.specifications?.bathrooms ?? 2,
      parkingSpaces: initialData?.specifications?.parkingSpaces ?? 1,
      propertySize: initialData?.specifications?.propertySize ?? 1850,
      propertySizeUnit: initialData?.specifications?.propertySizeUnit || "sqft",
      landSize: initialData?.specifications?.landSize,
      landSizeUnit: initialData?.specifications?.landSizeUnit,
      floorNumber: initialData?.specifications?.floorNumber,
      totalFloors: initialData?.specifications?.totalFloors,
      yearBuilt: initialData?.specifications?.yearBuilt ?? 2024,
      furnishedStatus: initialData?.specifications?.furnishedStatus || "UNFURNISHED",
    },
    amenities: initialData?.amenities || ["24/7 Security & CCTV", "Elevator / Lift", "Covered Parking"],
    features: initialData?.features || [],
    images: initialData?.images || [],
    featuredImage: initialData?.featuredImage || "",
    isFeatured: initialData?.isFeatured ?? false,
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  });

  const selectedAmenities = watch("amenities") || [];
  const selectedImages = watch("images") || [];
  const watchListingType = watch("listingType");

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setValue(
        "amenities",
        selectedAmenities.filter((a) => a !== amenity)
      );
    } else {
      setValue("amenities", [...selectedAmenities, amenity]);
    }
  };

  const onSubmit = async (data: PropertyFormValues) => {
    setSubmitting(true);
    try {
      if (mode === "create") {
        const res = await createPropertyAction(data);
        if (res.success && res.data) {
          success("Property listing created successfully!");
          router.push("/dashboard/properties");
          router.refresh();
        } else {
          error(res.message || "Failed to create property");
        }
      } else if (initialData) {
        const res = await updatePropertyAction(initialData._id, data);
        if (res.success) {
          success("Property listing updated successfully!");
          router.push("/dashboard/properties");
          router.refresh();
        } else {
          error(res.message || "Failed to update property");
        }
      }
    } catch (err: any) {
      error(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl">
      {/* 1. Basic Listing Information */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <Building className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Basic Information</h3>
            <p className="text-xs text-muted-foreground">Title, category, purpose, and publication status</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Property Title *
            </label>
            <Input
              placeholder="e.g. Modern Penthouse with Panoramic City Skyline Views"
              error={errors.title?.message}
              {...register("title")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Listing Purpose *
              </label>
              <Select {...register("listingType")}>
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
                <option value="LEASE">Commercial Lease</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Property Category *
              </label>
              <Select {...register("propertyType")}>
                <option value="APARTMENT">Apartment / Condominium</option>
                <option value="HOUSE">House / Single Family Home</option>
                <option value="VILLA">Luxury Villa</option>
                <option value="PENTHOUSE">Penthouse</option>
                <option value="COMMERCIAL">Commercial Real Estate</option>
                <option value="OFFICE">Office Space</option>
                <option value="LAND">Land / Plot</option>
                <option value="TOWNHOUSE">Townhouse</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Listing Status *
              </label>
              <Select {...register("status")}>
                <option value="DRAFT">Draft (Unlisted)</option>
                <option value="PUBLISHED">Published (Live on Public Storefront)</option>
                <option value="SOLD">Sold</option>
                <option value="RENTED">Rented</option>
                <option value="UNPUBLISHED">Unpublished</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Detailed Property Description *
            </label>
            <Textarea
              rows={5}
              placeholder="Highlight architecture, floorplan, interior finishes, sunlight exposure, neighborhood perks..."
              error={errors.description?.message}
              {...register("description")}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              className="h-4 w-4 rounded border-input text-primary accent-primary focus:ring-ring cursor-pointer"
              {...register("isFeatured")}
            />
            <label htmlFor="isFeatured" className="text-xs font-semibold text-card-foreground cursor-pointer">
              Feature this property on agency homepage spotlight
            </label>
          </div>
        </div>
      </div>

      {/* 2. Pricing Section */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Pricing & Terms</h3>
            <p className="text-xs text-muted-foreground">Set asking price, currency, and negotiable options</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Price Amount *
            </label>
            <Input
              type="number"
              placeholder="e.g. 750000"
              error={errors.price?.message}
              {...register("price")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Currency
            </label>
            <Select {...register("currency")}>
              <option value="USD">USD ($)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="AED">AED (AED)</option>
            </Select>
          </div>

          {watchListingType === "RENT" && (
            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Rental Period
              </label>
              <Select {...register("pricePeriod")}>
                <option value="MONTHLY">Monthly (/mo)</option>
                <option value="YEARLY">Yearly (/yr)</option>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="priceNegotiable"
            className="h-4 w-4 rounded border-input text-primary accent-primary focus:ring-ring cursor-pointer"
            {...register("priceNegotiable")}
          />
          <label htmlFor="priceNegotiable" className="text-xs font-semibold text-card-foreground cursor-pointer">
            Price is negotiable upon viewing
          </label>
        </div>
      </div>

      {/* 3. Location */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Property Location</h3>
            <p className="text-xs text-muted-foreground">Street address, neighborhood, city, and coordinates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Street Address *
            </label>
            <Input
              placeholder="e.g. 142 Manhattan Avenue, Suite 12B"
              error={errors.location?.address?.message}
              {...register("location.address")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Area / Neighborhood *
              </label>
              <Input
                placeholder="e.g. Upper West Side / Gulshan-2"
                error={errors.location?.area?.message}
                {...register("location.area")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                City *
              </label>
              <Input
                placeholder="e.g. New York / Dhaka"
                error={errors.location?.city?.message}
                {...register("location.city")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Country
              </label>
              <Input
                placeholder="US"
                {...register("location.country")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Specifications */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <ListChecks className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Specifications & Dimensions</h3>
            <p className="text-xs text-muted-foreground">Rooms, bathrooms, floor area, floor level, and furnishing</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Bedrooms *
            </label>
            <Input type="number" min="0" {...register("specifications.bedrooms")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Bathrooms *
            </label>
            <Input type="number" min="0" step="0.5" {...register("specifications.bathrooms")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Floor Area *
            </label>
            <Input type="number" min="1" {...register("specifications.propertySize")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Area Unit
            </label>
            <Select {...register("specifications.propertySizeUnit")}>
              <option value="sqft">Square Feet (sq ft)</option>
              <option value="sqm">Square Meters (m²)</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Parking Spaces
            </label>
            <Input type="number" min="0" {...register("specifications.parkingSpaces")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Floor Number
            </label>
            <Input type="number" placeholder="e.g. 14" {...register("specifications.floorNumber")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Total Floors
            </label>
            <Input type="number" placeholder="e.g. 25" {...register("specifications.totalFloors")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Furnishing
            </label>
            <Select {...register("specifications.furnishedStatus")}>
              <option value="UNFURNISHED">Unfurnished</option>
              <option value="SEMI_FURNISHED">Semi-Furnished</option>
              <option value="FULLY_FURNISHED">Fully Furnished</option>
            </Select>
          </div>
        </div>
      </div>

      {/* 5. Cloudinary Image Management */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Property Imagery (Cloudinary)</h3>
            <p className="text-xs text-muted-foreground">Upload multiple photos, reorder, set primary cover</p>
          </div>
        </div>

        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUploadManager
              images={field.value}
              onChange={(newImages) => {
                field.onChange(newImages);
                const featured = newImages.find((img) => img.isFeatured)?.secureUrl || newImages[0]?.secureUrl || "";
                setValue("featuredImage", featured);
              }}
            />
          )}
        />
      </div>

      {/* 6. Amenities & Features */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <CheckCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Amenities & Features</h3>
            <p className="text-xs text-muted-foreground">Select all building amenities and conveniences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {COMMON_AMENITIES.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <button
                type="button"
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left text-xs font-semibold transition-all ${
                  isChecked
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border/60 bg-muted/40 text-card-foreground hover:bg-muted"
                }`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    isChecked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background"
                  }`}
                >
                  {isChecked && <CheckCircle className="h-3 w-3" />}
                </div>
                <span>{amenity}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/properties")}
        >
          Cancel
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            isLoading={submitting}
            size="lg"
            className="gap-2 shadow font-bold"
          >
            <Save className="h-4 w-4" />
            {mode === "create" ? "Create & Publish Listing" : "Save Listing Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

