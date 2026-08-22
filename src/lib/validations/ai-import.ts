import { z } from "zod";
import { ICloudinaryImage } from "@/lib/types";
import { PropertyFormValues } from "./property";

export const extractedPropertySchema = z.object({
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  listingType: z.enum(["SALE", "RENT", "LEASE"]).nullable().optional(),
  propertyType: z
    .enum([
      "APARTMENT",
      "HOUSE",
      "VILLA",
      "COMMERCIAL",
      "LAND",
      "OFFICE",
      "PENTHOUSE",
      "TOWNHOUSE",
    ])
    .nullable()
    .optional(),
  price: z.number().nullable().optional(),
  currency: z.string().default("BDT"),
  priceNegotiable: z.boolean().default(false),
  pricePeriod: z.enum(["MONTHLY", "YEARLY"]).nullable().optional(),
  location: z
    .object({
      address: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      area: z.string().nullable().optional(),
      state: z.string().nullable().optional(),
      country: z.string().default("Bangladesh"),
      zipCode: z.string().nullable().optional(),
    })
    .default({
      city: "Dhaka",
      country: "Bangladesh",
    }),
  specifications: z
    .object({
      bedrooms: z.number().nullable().optional(),
      bathrooms: z.number().nullable().optional(),
      parkingSpaces: z.number().nullable().optional(),
      propertySize: z.number().nullable().optional(),
      propertySizeUnit: z.enum(["sqft", "sqm", "katha"]).default("sqft"),
      landSize: z.number().nullable().optional(),
      landSizeUnit: z
        .enum(["sqft", "sqm", "katha", "acre", "decimal", "bigha"])
        .nullable()
        .optional(),
      floorNumber: z.number().nullable().optional(),
      totalFloors: z.number().nullable().optional(),
      yearBuilt: z.number().nullable().optional(),
      furnishedStatus: z
        .enum(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"])
        .default("UNFURNISHED"),
    })
    .default({
      bedrooms: null,
      bathrooms: null,
      propertySize: null,
      propertySizeUnit: "sqft",
      furnishedStatus: "UNFURNISHED",
    }),
  amenities: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  contactInfo: z
    .object({
      phone: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      whatsapp: z.string().nullable().optional(),
    })
    .optional(),
});

export type ExtractedPropertyValues = z.infer<typeof extractedPropertySchema>;

export interface ILocalPropertyImage {
  id: string;
  file: File;
  previewUrl: string;
  isFeatured: boolean;
}

export interface IPropertyImportCard {
  id: string;
  caption: string;
  localImages: ILocalPropertyImage[];
  status: "idle" | "extracting" | "extracted" | "error" | "uploading" | "created";
  errorMessage?: string | null;
  extractedData?: ExtractedPropertyValues | null;
  editedData?: PropertyFormValues | null;
  uploadedImages?: ICloudinaryImage[];
  createdPropertyId?: string | null;
}

export const singleExtractRequestSchema = z.object({
  caption: z.string().min(1, "Caption cannot be empty"),
});

export const batchExtractRequestSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      caption: z.string(),
    })
  ),
});
