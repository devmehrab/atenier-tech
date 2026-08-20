"use server";

import { revalidatePath } from "next/cache";
import { requireOrganizationAccess } from "@/lib/auth/guards";
import { propertyFormSchema, PropertyFormValues } from "@/lib/validations/property";
import {
  createProperty,
  updateProperty,
  deleteProperty,
  duplicateProperty,
  updatePropertyStatus,
} from "@/lib/services/property.service";
import { ActionResult } from "./auth.actions";
import { PropertyStatus } from "@/lib/types";

export async function createPropertyAction(
  data: PropertyFormValues
): Promise<ActionResult<{ propertyId: string }>> {
  try {
    const session = await requireOrganizationAccess(null, false);

    const validated = propertyFormSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed on one or more fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const created = await createProperty(validated.data, session);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/properties");
    if (session.organizationSlug) {
      revalidatePath(`/${session.organizationSlug}`);
    }

    return {
      success: true,
      message: "Property listing created successfully",
      data: { propertyId: created._id },
    };
  } catch (error: any) {
    console.error("Create property action error:", error);
    return {
      success: false,
      message: error.message || "Failed to create property",
    };
  }
}

export async function updatePropertyAction(
  propertyId: string,
  data: PropertyFormValues
): Promise<ActionResult<{ propertyId: string }>> {
  try {
    const session = await requireOrganizationAccess(null, false);

    const validated = propertyFormSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed on one or more fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const updated = await updateProperty(propertyId, validated.data, session);
    if (!updated) {
      return { success: false, message: "Property not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/properties");
    revalidatePath(`/dashboard/properties/${propertyId}`);
    if (session.organizationSlug) {
      revalidatePath(`/${session.organizationSlug}`);
      revalidatePath(`/${session.organizationSlug}/properties/${updated.slug}`);
    }

    return {
      success: true,
      message: "Property listing updated successfully",
      data: { propertyId: updated._id },
    };
  } catch (error: any) {
    console.error("Update property action error:", error);
    return {
      success: false,
      message: error.message || "Failed to update property",
    };
  }
}

export async function deletePropertyAction(
  propertyId: string
): Promise<ActionResult> {
  try {
    const session = await requireOrganizationAccess(null, false);
    const success = await deleteProperty(propertyId, session);

    if (!success) {
      return { success: false, message: "Property not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/properties");
    if (session.organizationSlug) {
      revalidatePath(`/${session.organizationSlug}`);
    }

    return { success: true, message: "Property listing permanently deleted" };
  } catch (error: any) {
    console.error("Delete property action error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete property",
    };
  }
}

export async function duplicatePropertyAction(
  propertyId: string
): Promise<ActionResult<{ propertyId: string }>> {
  try {
    const session = await requireOrganizationAccess(null, false);
    const duplicated = await duplicateProperty(propertyId, session);

    if (!duplicated) {
      return { success: false, message: "Failed to duplicate property" };
    }

    revalidatePath("/dashboard/properties");
    return {
      success: true,
      message: "Property duplicated as draft",
      data: { propertyId: duplicated._id },
    };
  } catch (error: any) {
    console.error("Duplicate property action error:", error);
    return {
      success: false,
      message: error.message || "Failed to duplicate property",
    };
  }
}

export async function updatePropertyStatusAction(
  propertyId: string,
  status: PropertyStatus
): Promise<ActionResult> {
  try {
    const session = await requireOrganizationAccess(null, false);
    const success = await updatePropertyStatus(propertyId, status, session);

    if (!success) {
      return { success: false, message: "Failed to update property status" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/properties");
    revalidatePath(`/dashboard/properties/${propertyId}`);
    if (session.organizationSlug) {
      revalidatePath(`/${session.organizationSlug}`);
    }

    return {
      success: true,
      message: `Property marked as ${status.toLowerCase()}`,
    };
  } catch (error: any) {
    console.error("Update property status error:", error);
    return {
      success: false,
      message: error.message || "Failed to update status",
    };
  }
}
