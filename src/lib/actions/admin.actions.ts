"use server";

import { revalidatePath } from "next/cache";
import { requireSystemAdmin } from "@/lib/auth/guards";
import {
  toggleOrganizationStatus,
  deleteOrganizationAdmin,
  toggleUserStatus,
  updateUserRoleAdmin,
  deletePropertyAdmin,
} from "@/lib/services/admin.service";
import { OrganizationStatus, UserStatus, UserRole } from "@/lib/types";
import { ActionResult } from "./auth.actions";

export async function toggleOrgStatusAction(
  orgId: string,
  newStatus: OrganizationStatus
): Promise<ActionResult> {
  try {
    await requireSystemAdmin(false);
    await toggleOrganizationStatus(orgId, newStatus);

    revalidatePath("/system-admin/organizations");
    revalidatePath("/system-admin");
    return {
      success: true,
      message: `Organization status changed to ${newStatus}`,
    };
  } catch (error: any) {
    console.error("Toggle org status error:", error);
    return {
      success: false,
      message: error.message || "Failed to update organization status",
    };
  }
}

export async function deleteOrgAction(orgId: string): Promise<ActionResult> {
  try {
    await requireSystemAdmin(false);
    await deleteOrganizationAdmin(orgId);

    revalidatePath("/system-admin/organizations");
    revalidatePath("/system-admin");
    return {
      success: true,
      message: "Organization and associated assets deleted",
    };
  } catch (error: any) {
    console.error("Delete org error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete organization",
    };
  }
}

export async function toggleUserStatusAction(
  userId: string,
  newStatus: UserStatus
): Promise<ActionResult> {
  try {
    await requireSystemAdmin(false);
    await toggleUserStatus(userId, newStatus);

    revalidatePath("/system-admin/users");
    revalidatePath("/system-admin");
    return {
      success: true,
      message: `User status changed to ${newStatus}`,
    };
  } catch (error: any) {
    console.error("Toggle user status error:", error);
    return {
      success: false,
      message: error.message || "Failed to update user status",
    };
  }
}

export async function updateUserRoleAdminAction(
  userId: string,
  newRole: UserRole
): Promise<ActionResult> {
  try {
    await requireSystemAdmin(false);
    await updateUserRoleAdmin(userId, newRole);

    revalidatePath("/system-admin/users");
    return { success: true, message: `User role updated to ${newRole}` };
  } catch (error: any) {
    console.error("Admin update role error:", error);
    return {
      success: false,
      message: error.message || "Failed to update user role",
    };
  }
}

export async function deletePropertyAdminAction(
  propertyId: string
): Promise<ActionResult> {
  try {
    await requireSystemAdmin(false);
    await deletePropertyAdmin(propertyId);

    revalidatePath("/system-admin/properties");
    revalidatePath("/system-admin");
    return { success: true, message: "Property listing removed by admin" };
  } catch (error: any) {
    console.error("Admin delete property error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete property",
    };
  }
}
