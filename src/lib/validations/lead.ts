import { z } from "zod";

export const leadInquirySchema = z.object({
  organizationId: z.string().min(1, "Organization is required"),
  propertyId: z.string().optional(),
  name: z.string().min(2, "Your name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export type LeadInquiryInput = z.infer<typeof leadInquirySchema>;
