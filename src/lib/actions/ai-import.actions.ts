"use server";

import { revalidatePath } from "next/cache";
import { requireOrganizationAccess } from "@/lib/auth/guards";
import { propertyFormSchema, PropertyFormValues } from "@/lib/validations/property";
import { createProperty } from "@/lib/services/property.service";
import {
  extractPropertyFromCaption,
} from "@/lib/services/ai-import.service";
import {
  ExtractedPropertyValues,
  singleExtractRequestSchema,
  batchExtractRequestSchema,
} from "@/lib/validations/ai-import";
import { ActionResult } from "./auth.actions";

/**
 * Extracts structured property information from a single caption.
 */
export async function extractSingleCaptionAction(
  caption: string
): Promise<ActionResult<ExtractedPropertyValues>> {
  try {
    await requireOrganizationAccess(null, false);

    const validated = singleExtractRequestSchema.safeParse({ caption });
    if (!validated.success) {
      return {
        success: false,
        message: "Caption is required for extraction",
      };
    }

    const data = await extractPropertyFromCaption(validated.data.caption);

    return {
      success: true,
      message: "Property details extracted successfully",
      data,
    };
  } catch (error: any) {
    console.error("AI Single Extraction Action Error:", error);
    return {
      success: false,
      message: error.message || "Failed to extract property details from caption",
    };
  }
}

export interface IBatchExtractResult {
  id: string;
  success: boolean;
  data?: ExtractedPropertyValues;
  error?: string;
}

/**
 * Extracts structured property information for multiple captions in batch.
 * Resilient: Failure in one caption does not fail the entire batch.
 */
export async function extractBatchCaptionsAction(
  items: { id: string; caption: string }[]
): Promise<ActionResult<IBatchExtractResult[]>> {
  try {
    await requireOrganizationAccess(null, false);

    const validated = batchExtractRequestSchema.safeParse({ items });
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid batch extraction payload",
      };
    }

    // Process all items in parallel using Promise.allSettled for maximum fault tolerance
    const results = await Promise.all(
      validated.data.items.map(async (item) => {
        if (!item.caption || item.caption.trim() === "") {
          return {
            id: item.id,
            success: false,
            error: "Caption was empty",
          };
        }

        try {
          const data = await extractPropertyFromCaption(item.caption);
          return {
            id: item.id,
            success: true,
            data,
          };
        } catch (err: any) {
          return {
            id: item.id,
            success: false,
            error: err.message || "Extraction failed for this caption",
          };
        }
      })
    );

    return {
      success: true,
      message: "Batch extraction completed",
      data: results,
    };
  } catch (error: any) {
    console.error("AI Batch Extraction Action Error:", error);
    return {
      success: false,
      message: error.message || "Failed to process batch extraction",
    };
  }
}

export interface IBulkCreateSummary {
  createdCount: number;
  failedCount: number;
  results: {
    index: number;
    title: string;
    success: boolean;
    propertyId?: string;
    error?: string;
  }[];
}

/**
 * Bulk creates verified properties in MongoDB using the existing property creation service.
 */
export async function createBulkPropertiesAction(
  properties: PropertyFormValues[]
): Promise<ActionResult<IBulkCreateSummary>> {
  try {
    const session = await requireOrganizationAccess(null, false);

    if (!properties || properties.length === 0) {
      return {
        success: false,
        message: "No properties provided to create",
      };
    }

    const summaryResults: IBulkCreateSummary["results"] = [];
    let createdCount = 0;
    let failedCount = 0;

    for (let i = 0; i < properties.length; i++) {
      const propData = properties[i];
      const validated = propertyFormSchema.safeParse(propData);

      if (!validated.success) {
        failedCount++;
        const fieldErrors = validated.error.flatten().fieldErrors;
        const errMessages = Object.entries(fieldErrors)
          .map(([field, msgs]) => `${field}: ${msgs?.join(", ")}`)
          .join("; ");

        summaryResults.push({
          index: i,
          title: propData.title || `Property #${i + 1}`,
          success: false,
          error: errMessages || "Validation failed on one or more fields",
        });
        continue;
      }

      try {
        const created = await createProperty(validated.data, session);
        createdCount++;
        summaryResults.push({
          index: i,
          title: created.title,
          success: true,
          propertyId: created._id,
        });
      } catch (err: any) {
        failedCount++;
        summaryResults.push({
          index: i,
          title: propData.title || `Property #${i + 1}`,
          success: false,
          error: err.message || "Failed to save property to database",
        });
      }
    }

    // Revalidate dashboard and tenant storefront caches
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/properties");
    if (session.organizationSlug) {
      revalidatePath(`/${session.organizationSlug}`);
      revalidatePath(`/${session.organizationSlug}/properties`);
    }

    return {
      success: createdCount > 0,
      message: `Successfully created ${createdCount} of ${properties.length} property listings`,
      data: {
        createdCount,
        failedCount,
        results: summaryResults,
      },
    };
  } catch (error: any) {
    console.error("Bulk Property Creation Action Error:", error);
    return {
      success: false,
      message: error.message || "Failed to create properties in bulk",
    };
  }
}
