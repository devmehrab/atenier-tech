import { connectToDatabase } from "@/lib/db/connection";
import { User, IUserDocument } from "@/lib/db/models/User";
import { IUser, ISessionUser, UserRole } from "@/lib/types";
import { hashPassword } from "@/lib/auth/password";
import { TeamInviteInput } from "@/lib/validations/team";
import mongoose from "mongoose";

export async function listTeamMembers(
  organizationId: string,
  sessionUser: ISessionUser
): Promise<IUser[]> {
  await connectToDatabase();

  if (
    sessionUser.role !== "SYSTEM_ADMIN" &&
    sessionUser.organizationId !== organizationId
  ) {
    throw new Error("Forbidden: Cannot view other organization team members");
  }

  const users = await User.find({
    organizationId: new mongoose.Types.ObjectId(organizationId),
  })
    .select("-passwordHash")
    .sort({ role: 1, createdAt: -1 })
    .lean();

  return users.map((u) => ({
    ...u,
    _id: u._id.toString(),
    organizationId: u.organizationId ? u.organizationId.toString() : null,
  })) as unknown as IUser[];
}

export async function inviteTeamMember(
  input: TeamInviteInput,
  sessionUser: ISessionUser
): Promise<IUser> {
  await connectToDatabase();

  if (
    sessionUser.role !== "SYSTEM_ADMIN" &&
    sessionUser.role !== "OWNER"
  ) {
    throw new Error("Forbidden: Only organization owners can invite team members");
  }

  if (!sessionUser.organizationId && sessionUser.role !== "SYSTEM_ADMIN") {
    throw new Error("Invalid organization context");
  }

  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new Error("A user with this email address already exists");
  }

  const passwordHash = await hashPassword(input.initialPassword);

  const newUser = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    passwordHash,
    role: input.role,
    organizationId: sessionUser.organizationId,
    status: "ACTIVE",
    isEmailVerified: true,
  });

  const json = newUser.toJSON();
  return json as unknown as IUser;
}

export async function updateTeamMemberRole(
  targetUserId: string,
  newRole: UserRole,
  sessionUser: ISessionUser
): Promise<boolean> {
  await connectToDatabase();

  if (sessionUser.role !== "SYSTEM_ADMIN" && sessionUser.role !== "OWNER") {
    throw new Error("Forbidden: Only owners can update member roles");
  }

  const target = await User.findById(targetUserId);
  if (!target) throw new Error("User not found");

  if (
    sessionUser.role !== "SYSTEM_ADMIN" &&
    target.organizationId?.toString() !== sessionUser.organizationId
  ) {
    throw new Error("Forbidden: Cannot modify member from another organization");
  }

  target.role = newRole;
  await target.save();
  return true;
}

export async function removeTeamMember(
  targetUserId: string,
  sessionUser: ISessionUser
): Promise<boolean> {
  await connectToDatabase();

  if (sessionUser.role !== "SYSTEM_ADMIN" && sessionUser.role !== "OWNER") {
    throw new Error("Forbidden: Only owners can remove team members");
  }

  if (targetUserId === sessionUser.userId) {
    throw new Error("Cannot remove yourself from the organization");
  }

  const target = await User.findById(targetUserId);
  if (!target) return false;

  if (
    sessionUser.role !== "SYSTEM_ADMIN" &&
    target.organizationId?.toString() !== sessionUser.organizationId
  ) {
    throw new Error("Forbidden: Cannot delete member from another organization");
  }

  await User.deleteOne({ _id: target._id });
  return true;
}
