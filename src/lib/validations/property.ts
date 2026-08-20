import { z } from "zod";

const CloudinaryImageSchema = z.object({
  publicId: z.string(),
  secureUrl: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  isFeatured: z.boolean().optional(),
  caption: z.string().optional(),
  order: z.number().optional(),
});

export const propertyFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  listingType: z.enum(["SALE", "RENT", "LEASE"]),
  propertyType: z.enum([
    "APARTMENT",
    "HOUSE",
    "VILLA",
    "COMMERCIAL",
    "LAND",
    "OFFICE",
    "PENTHOUSE",
    "TOWNHOUSE",
  ]),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED", "SOLD", "RENTED"]).default("DRAFT"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  currency: z.string().default("USD"),
  priceNegotiable: z.boolean().default(false),
  pricePeriod: z.enum(["MONTHLY", "YEARLY"]).optional(),
  location: z.object({
    address: z.string().min(2, "Address is required"),
    city: z.string().min(2, "City is required"),
    area: z.string().min(2, "Area or Neighborhood is required"),
    state: z.string().optional(),
    country: z.string().default("US"),
    zipCode: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
  }),
  specifications: z.object({
    bedrooms: z.coerce.number().min(0).default(1),
    bathrooms: z.coerce.number().min(0).default(1),
    parkingSpaces: z.coerce.number().min(0).default(0),
    propertySize: z.coerce.number().min(1, "Property size is required"),
    propertySizeUnit: z.enum(["sqft", "sqm"]).default("sqft"),
    landSize: z.coerce.number().optional(),
    landSizeUnit: z.enum(["sqft", "sqm", "katha", "acre"]).optional(),
    floorNumber: z.coerce.number().optional(),
    totalFloors: z.coerce.number().optional(),
    yearBuilt: z.coerce.number().optional(),
    furnishedStatus: z.enum(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"]).default("UNFURNISHED"),
  }),
  amenities: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  images: z.array(CloudinaryImageSchema).default([]),
  featuredImage: z.string().optional(),
  contactInfo: z
    .object({
      phone: z.string().optional(),
      email: z.string().email().optional().or(z.literal("")),
      whatsapp: z.string().optional(),
    })
    .optional(),
  assignedAgent: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export const propertyFilterSchema = z.object({
  search: z.string().optional(),
  listingType: z.enum(["SALE", "RENT", "LEASE"]).optional(),
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
    .optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED", "SOLD", "RENTED"]).optional(),
  sortBy: z.enum(["newest", "price_asc", "price_desc", "popular"]).default("newest"),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
});

export type PropertyFilterValues = z.infer<typeof propertyFilterSchema>;
