"use server";

import { connectToDatabase } from "@/lib/db/connection";
import { User } from "@/lib/db/models/User";
import { Organization } from "@/lib/db/models/Organization";
import { comparePassword, hashPassword } from "@/lib/auth/password";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session";
import {
  loginSchema,
  registerSchema,
  registerOrgSchema,
  LoginInput,
  RegisterInput,
  RegisterOrgInput,
} from "@/lib/validations/auth";
import { ISessionUser, UserRole } from "@/lib/types";

export type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export async function loginAction(
  data: LoginInput
): Promise<ActionResult<{ user: ISessionUser; redirectUrl: string }>> {
  try {
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid input fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await connectToDatabase();

    const user = await User.findOne({
      email: validated.data.email.toLowerCase(),
    });

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    if (user.status === "DISABLED") {
      return { success: false, message: "Your account has been disabled. Please contact support." };
    }

    const isMatch = await comparePassword(
      validated.data.password,
      user.passwordHash
    );

    if (!isMatch) {
      return { success: false, message: "Invalid email or password" };
    }

    let organizationSlug = null;
    let organizationName = null;

    if (user.organizationId) {
      const org = await Organization.findById(user.organizationId);
      if (org) {
        if (org.status === "SUSPENDED") {
          return { success: false, message: "Your organization account has been suspended." };
        }
        organizationSlug = org.slug;
        organizationName = org.name;
      }
    }

    const sessionUser: ISessionUser = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      organizationId: user.organizationId ? user.organizationId.toString() : null,
      organizationSlug,
      organizationName,
    };

    await setSessionCookie(sessionUser);

    let redirectUrl = "/dashboard";
    if (user.role === "SYSTEM_ADMIN") {
      redirectUrl = "/system-admin";
    }

    return {
      success: true,
      message: "Signed in successfully",
      data: { user: sessionUser, redirectUrl },
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred during sign in",
    };
  }
}

export async function registerOrgAction(
  data: RegisterOrgInput
): Promise<ActionResult<{ user: ISessionUser; redirectUrl: string }>> {
  try {
    const validated = registerOrgSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Invalid input fields",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await connectToDatabase();

    // Check if user email exists
    const existingUser = await User.findOne({
      email: validated.data.email.toLowerCase(),
    });
    if (existingUser) {
      return { success: false, message: "An account with this email already exists" };
    }

    // Check if organization slug is taken
    const existingOrg = await Organization.findOne({
      slug: validated.data.organizationSlug.toLowerCase(),
    });
    if (existingOrg) {
      return { success: false, message: "This agency URL handle is already taken. Please choose another." };
    }

    const passwordHash = await hashPassword(validated.data.password);

    // Create user initially as OWNER
    const user = await User.create({
      name: validated.data.userName,
      email: validated.data.email.toLowerCase(),
      phone: validated.data.phone,
      passwordHash,
      role: "OWNER",
      status: "ACTIVE",
    });

    // Create organization
    const org = await Organization.create({
      name: validated.data.organizationName,
      slug: validated.data.organizationSlug.toLowerCase(),
      email: validated.data.email.toLowerCase(),
      phone: validated.data.phone,
      city: validated.data.city,
      country: validated.data.country || "US",
      ownerId: user._id,
      status: "ACTIVE",
    });

    // Link organizationId back to user
    user.organizationId = org._id as any;
    await user.save();

    const sessionUser: ISessionUser = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      organizationId: org._id.toString(),
      organizationSlug: org.slug,
      organizationName: org.name,
    };

    await setSessionCookie(sessionUser);

    return {
      success: true,
      message: "Agency registered successfully",
      data: { user: sessionUser, redirectUrl: "/dashboard" },
    };
  } catch (error: any) {
    console.error("Org register error:", error);
    return {
      success: false,
      message: error.message || "Failed to create organization",
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  await clearSessionCookie();
  return { success: true, message: "Signed out successfully" };
}
