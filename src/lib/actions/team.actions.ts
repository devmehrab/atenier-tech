"use server";

import { revalidatePath } from "next/cache";
import { requireOrganizationOwner } from "@/lib/auth/guards";
import {
  teamInviteSchema,
  updateMemberRoleSchema,
  TeamInviteInput,
  UpdateMemberRoleInput,
} from "@/lib/validations/team";
import {
  inviteTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
} from "@/lib/services/user.service";
import { ActionResult } from "./auth.actions";

export async function inviteTeamMemberAction(
  data: TeamInviteInput
): Promise<ActionResult> {
  try {
    const session = await requireOrganizationOwner(null, false);

    const validated = teamInviteSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid invitation data",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await inviteTeamMember(validated.data, session);

    revalidatePath("/dashboard/team");
    return {
      success: true,
      message: `Agent ${validated.data.name} has been added to your team.`,
    };
  } catch (error: any) {
    console.error("Invite team action error:", error);
    return {
      success: false,
      message: error.message || "Failed to invite team member",
    };
  }
}

export async function updateTeamMemberRoleAction(
  data: UpdateMemberRoleInput
): Promise<ActionResult> {
  try {
    const session = await requireOrganizationOwner(null, false);

    const validated = updateMemberRoleSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, message: "Invalid role update data" };
    }

    await updateTeamMemberRole(validated.data.userId, validated.data.role, session);

    revalidatePath("/dashboard/team");
    return { success: true, message: "Role updated successfully" };
  } catch (error: any) {
    console.error("Update role action error:", error);
    return {
      success: false,
      message: error.message || "Failed to update member role",
    };
  }
}

export async function removeTeamMemberAction(
  userId: string
): Promise<ActionResult> {
  try {
    const session = await requireOrganizationOwner(null, false);
    await removeTeamMember(userId, session);

    revalidatePath("/dashboard/team");
    return { success: true, message: "Team member removed" };
  } catch (error: any) {
    console.error("Remove member action error:", error);
    return {
      success: false,
      message: error.message || "Failed to remove member",
    };
  }
}
