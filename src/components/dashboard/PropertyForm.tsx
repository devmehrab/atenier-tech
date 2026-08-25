"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyFormSchema, PropertyFormValues } from "@/lib/validations/property";
import { createPropertyAction, updatePropertyAction } from "@/lib/actions/property.actions";
import { useToast } from "@/components/ui/toast";
import { ImageUploadManager } from "./ImageUploadManager";
import { OpenFreeMapPicker } from "./OpenFreeMapPicker";
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
  "Full Generator Backup (100%)",
  "24/7 Security & CCTV Surveillance",
  "High-Speed Passenger Lift",
  "Bed / Cargo Lift",
  "Covered Car Parking",
  "Dedicated Prayer Room (Namaz Hall)",
  "Rooftop Garden & Community Hall",
  "Fitness Center / Gymnasium",
  "Titas Gas Connection / Central LPG",
  "Deep Tube-well & Water Filtration",
  "Intercom & Video Door Phone",
  "Fire Hydrant & Suppression System",
  "Driver Waiting Area & Restroom",
  "Swimming Pool",
  "Caretaker & Guard Quarter",
  "Solar Panel Backup System",
  "South-Facing Open Verandas",
  "Waste Management Chute",
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
    price: initialData?.price || 17500000,
    currency: initialData?.currency || "BDT",
    priceNegotiable: initialData?.priceNegotiable ?? false,
    pricePeriod: initialData?.pricePeriod,
    location: {
      address: initialData?.location?.address || "",
      city: initialData?.location?.city || "Dhaka",
      area: initialData?.location?.area || "",
      state: initialData?.location?.state || "Dhaka Division",
      country: initialData?.location?.country || "Bangladesh",
      zipCode: initialData?.location?.zipCode || "",
      latitude: initialData?.location?.latitude,
      longitude: initialData?.location?.longitude,
    },
    specifications: {
      bedrooms: initialData?.specifications?.bedrooms ?? 3,
      bathrooms: initialData?.specifications?.bathrooms ?? 3,
      parkingSpaces: initialData?.specifications?.parkingSpaces ?? 1,
      propertySize: initialData?.specifications?.propertySize ?? 2150,
      propertySizeUnit: initialData?.specifications?.propertySizeUnit || "sqft",
      landSize: initialData?.specifications?.landSize,
      landSizeUnit: initialData?.specifications?.landSizeUnit || "katha",
      floorNumber: initialData?.specifications?.floorNumber,
      totalFloors: initialData?.specifications?.totalFloors,
      yearBuilt: initialData?.specifications?.yearBuilt ?? 2024,
      furnishedStatus: initialData?.specifications?.furnishedStatus || "UNFURNISHED",
    },
    amenities: initialData?.amenities || [
      "Full Generator Backup (100%)",
      "24/7 Security & CCTV Surveillance",
      "High-Speed Passenger Lift",
      "Covered Car Parking",
    ],
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
            <p className="text-xs text-muted-foreground">Property title, category, purpose, and visibility status</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Property Title *
            </label>
            <Input
              placeholder="e.g. South-Facing 3BHK Luxury Apartment in Gulshan-2 (Road 104)"
              error={errors.title?.message}
              {...register("title")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Listing Purpose*
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
                <option value="APARTMENT">Apartment / Flat</option>
                <option value="HOUSE">Independent House / Building</option>
                <option value="VILLA">Luxury Duplex / Villa</option>
                <option value="PENTHOUSE">Penthouse</option>
                <option value="COMMERCIAL">Commercial Space / Floor</option>
                <option value="OFFICE">Corporate Office Space</option>
                <option value="LAND">Plot / Land</option>
                <option value="TOWNHOUSE">Townhouse</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Listing Status *
              </label>
              <Select {...register("status")}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
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
              placeholder="e.g. Luxuriously designed 3 bedroom apartment featuring 3 attached bathrooms, 3 wide verandas, drawing, dining, family living, servant room with bath, modern kitchen with imported fittings, 100% full load backup generator, 2 dedicated car parking spaces in basement. RAJUK approved plan, ready for immediate handover."
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
            <p className="text-xs text-muted-foreground">Set asking price in BDT (Taka), currency, and negotiable options</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Price / Rent Amount *
            </label>
            <Input
              type="number"
              placeholder="e.g. 18500000 (1.85 Cr) or 65000"
              error={errors.price?.message}
              {...register("price")}
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Enter numbers (e.g. 15000000 for 1.5 Crore BDT)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Currency
            </label>
            <Select {...register("currency")}>
              <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="AED">AED (AED) - UAE Dirham</option>
              <option value="SAR">SAR (SAR) - Saudi Riyal</option>
            </Select>
          </div>

          {watchListingType === "RENT" && (
            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Rental Period
              </label>
              <Select {...register("pricePeriod")}>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
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
            Price is negotiable upon discussion
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
            <p className="text-xs text-muted-foreground">Road, holding address, neighborhood/thana, district, and postal code</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Street / Holding Address *
            </label>
            <Input
              placeholder="e.g. House 42, Road 11, Block D or Plot 12, Road 104"
              error={errors.location?.address?.message}
              {...register("location.address")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Area / Neighborhood / Thana *
              </label>
              <Input
                placeholder="e.g. Gulshan-2, Banani, Dhanmondi, Uttara, Bashundhara R/A"
                error={errors.location?.area?.message}
                {...register("location.area")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                City / District *
              </label>
              <Input
                placeholder="e.g. Dhaka, Chittagong, Sylhet, Cox's Bazar, Rajshahi"
                error={errors.location?.city?.message}
                {...register("location.city")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Country
              </label>
              <Input
                placeholder="Bangladesh"
                {...register("location.country")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Division / Region
              </label>
              <Input
                placeholder="e.g. Dhaka Division, Chittagong Division"
                {...register("location.state")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Postal / Zip Code
              </label>
              <Input
                placeholder="e.g. 1212, 1213, 1205, 1230, 4000"
                {...register("location.zipCode")}
              />
            </div>
          </div>

          {/* Interactive OpenFreeMap Location Picker */}
          <div className="pt-4 border-t border-border/50">
            <OpenFreeMapPicker
              latitude={watch("location.latitude")}
              longitude={watch("location.longitude")}
              address={watch("location.address")}
              area={watch("location.area")}
              city={watch("location.city")}
              onChange={({ latitude: newLat, longitude: newLng }) => {
                setValue("location.latitude", newLat, { shouldValidate: true, shouldDirty: true });
                setValue("location.longitude", newLng, { shouldValidate: true, shouldDirty: true });
              }}
            />
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
            <p className="text-xs text-muted-foreground">Rooms, attached baths, floor area, floor level, and furnishing details</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Bedrooms *
            </label>
            <Input type="number" min="0" placeholder="e.g. 3" {...register("specifications.bedrooms")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Bathrooms *
            </label>
            <Input type="number" min="0" step="0.5" placeholder="e.g. 3" {...register("specifications.bathrooms")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Floor Area *
            </label>
            <Input type="number" min="1" placeholder="e.g. 2150" {...register("specifications.propertySize")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Area Unit
            </label>
            <Select {...register("specifications.propertySizeUnit")}>
              <option value="sqft">Square Feet (sq ft)</option>
              <option value="katha">Katha</option>
              <option value="sqm">Square Meters (m²)</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Car Parking
            </label>
            <Input type="number" min="0" placeholder="e.g. 1 or 2" {...register("specifications.parkingSpaces")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Floor Level
            </label>
            <Input type="number" placeholder="e.g. 6 (6th Floor)" {...register("specifications.floorNumber")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Total Building Floors
            </label>
            <Input type="number" placeholder="e.g. 14 (G+13)" {...register("specifications.totalFloors")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Furnishing
            </label>
            <Select {...register("specifications.furnishedStatus")}>
              <option value="UNFURNISHED">Unfurnished </option>
              <option value="SEMI_FURNISHED">Semi-Furnished </option>
              <option value="FULLY_FURNISHED">Fully Furnished </option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Land / Plot Size (Optional)
            </label>
            <Input type="number" step="0.01" placeholder="e.g. 5" {...register("specifications.landSize")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Land Unit
            </label>
            <Select {...register("specifications.landSizeUnit")}>
              <option value="katha">Katha </option>
              <option value="decimal">Decimal / Shatak </option>
              <option value="bigha">Bigha </option>
              <option value="sqft">Square Feet (sq ft)</option>
              <option value="acre">Acre</option>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Handover / Construction Year
            </label>
            <Input type="number" placeholder="e.g. 2024 (Handover 2025)" {...register("specifications.yearBuilt")} />
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
            <h3 className="text-base font-bold text-card-foreground">Property Imagery</h3>
            <p className="text-xs text-muted-foreground">Upload high resolution photos of interior, exterior, verandas, floor plans</p>
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
            <h3 className="text-base font-bold text-card-foreground">Amenities & Facilities</h3>
            <p className="text-xs text-muted-foreground">Select all building amenities, backup utilities, and conveniences</p>
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
                className={`flex items-center gap-2 rounded-xl border p-3 text-left text-xs font-semibold transition-all ${isChecked
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border/60 bg-muted/40 text-card-foreground hover:bg-muted"
                  }`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border ${isChecked
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

