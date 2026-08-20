"use server";

import { revalidatePath } from "next/cache";
import { requireOrganizationOwner } from "@/lib/auth/guards";
import { orgUpdateSchema, OrgUpdateInput } from "@/lib/validations/organization";
import { updateOrganizationProfile } from "@/lib/services/organization.service";
import { setSessionCookie } from "@/lib/auth/session";
import { ActionResult } from "./auth.actions";

export async function updateOrganizationAction(
  data: OrgUpdateInput
): Promise<ActionResult> {
  try {
    const session = await requireOrganizationOwner(null, false);

    const validated = orgUpdateSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid organization fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const updated = await updateOrganizationProfile(
      session.organizationId!,
      validated.data,
      session
    );

    // If slug or name changed, update cookie session
    if (updated.slug !== session.organizationSlug || updated.name !== session.organizationName) {
      await setSessionCookie({
        ...session,
        organizationSlug: updated.slug,
        organizationName: updated.name,
      });
    }

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/settings");
    revalidatePath(`/${updated.slug}`);

    return {
      success: true,
      message: "Agency profile updated successfully",
    };
  } catch (error: any) {
    console.error("Update org action error:", error);
    return {
      success: false,
      message: error.message || "Failed to update agency profile",
    };
  }
}
