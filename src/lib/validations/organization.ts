import { z } from "zod";

const CloudinaryImageSchema = z.object({
  publicId: z.string(),
  secureUrl: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
});

export const orgUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(2, "City is required"),
  country: z.string().default("US"),
  logo: CloudinaryImageSchema.nullable().optional(),
  coverImage: CloudinaryImageSchema.nullable().optional(),
  socialLinks: z
    .object({
      website: z.string().url().optional().or(z.literal("")),
      facebook: z.string().optional().or(z.literal("")),
      instagram: z.string().optional().or(z.literal("")),
      linkedin: z.string().optional().or(z.literal("")),
      twitter: z.string().optional().or(z.literal("")),
    })
    .optional(),
  branding: z
    .object({
      primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      tagline: z.string().optional(),
    })
    .optional(),
  settings: z
    .object({
      defaultCurrency: z.string().min(2).max(4),
      unitSystem: z.enum(["SQFT", "SQM"]),
      allowAgentListings: z.boolean(),
    })
    .optional(),
});

export type OrgUpdateInput = z.infer<typeof orgUpdateSchema>;
