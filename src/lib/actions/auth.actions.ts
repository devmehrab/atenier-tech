"use server";

import crypto from "crypto";
import { connectToDatabase } from "@/lib/db/connection";
import { User } from "@/lib/db/models/User";
import { Organization } from "@/lib/db/models/Organization";
import { comparePassword, hashPassword } from "@/lib/auth/password";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session";
import {
  loginSchema,
  registerSchema,
  registerOrgSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  LoginInput,
  RegisterInput,
  RegisterOrgInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "@/lib/validations/auth";
import { ISessionUser, UserRole } from "@/lib/types";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/services/mail.service";

export type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  requiresVerification?: boolean;
  unverifiedEmail?: string;
};

/**
 * Generate cryptographically secure random token & 6-digit OTP
 */
function generateTokens() {
  const token = crypto.randomBytes(32).toString("hex");
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return { token, otp };
}

/**
 * User Login Action
 */
export async function loginAction(
  data: LoginInput
): Promise<ActionResult<{ user?: ISessionUser; redirectUrl?: string }>> {
  try {
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Please provide valid credentials",
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
      return {
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      };
    }

    const isMatch = await comparePassword(
      validated.data.password,
      user.passwordHash
    );

    if (!isMatch) {
      return { success: false, message: "Invalid email or password" };
    }

    // Check if email is verified
    if (user.isEmailVerified === false) {
      // If token expired or not set, generate a fresh one
      const now = new Date();
      if (!user.emailVerificationToken || !user.emailVerificationExpires || user.emailVerificationExpires < now) {
        const { token, otp } = generateTokens();
        user.emailVerificationToken = token;
        user.emailVerificationOtp = otp;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();

        await sendVerificationEmail({
          to: user.email,
          name: user.name,
          token,
          otp,
        });
      }

      return {
        success: false,
        requiresVerification: true,
        unverifiedEmail: user.email,
        message:
          "Your email is not verified yet. Please verify using the code or link sent to your inbox.",
      };
    }

    let organizationSlug = null;
    let organizationName = null;

    if (user.organizationId) {
      const org = await Organization.findById(user.organizationId);
      if (org) {
        if (org.status === "SUSPENDED") {
          return {
            success: false,
            message: "Your brokerage account has been suspended.",
          };
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
      isEmailVerified: user.isEmailVerified,
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

/**
 * Register Organization & Agency Owner
 * Generates verification token/OTP, sends Mailtrap email, forces email verification
 */
export async function registerOrgAction(
  data: RegisterOrgInput
): Promise<ActionResult<{ email: string; redirectUrl: string }>> {
  try {
    const validated = registerOrgSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation error in submitted data. Please review.",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await connectToDatabase();

    // Check if user email already exists
    const existingUser = await User.findOne({
      email: validated.data.email.toLowerCase(),
    });
    if (existingUser) {
      return {
        success: false,
        message: "An account already exists with this email. Please sign in.",
      };
    }

    // Check if organization slug is taken
    const existingOrg = await Organization.findOne({
      slug: validated.data.organizationSlug.toLowerCase(),
    });
    if (existingOrg) {
      return {
        success: false,
        message:
          "This agency URL handle is already taken. Please choose another name.",
      };
    }

    const passwordHash = await hashPassword(validated.data.password);
    const { token, otp } = generateTokens();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user initially as unverified OWNER
    const user = await User.create({
      name: validated.data.userName,
      email: validated.data.email.toLowerCase(),
      phone: validated.data.phone,
      passwordHash,
      role: "OWNER",
      status: "ACTIVE",
      isEmailVerified: false,
      emailVerificationToken: token,
      emailVerificationOtp: otp,
      emailVerificationExpires: tokenExpires,
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

    // Send verification email via Mailtrap
    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      token,
      otp,
    });

    return {
      success: true,
      message:
        "Brokerage registered successfully! Verification instructions have been sent to your email.",
      data: {
        email: user.email,
        redirectUrl: `/verify-email?email=${encodeURIComponent(user.email)}`,
      },
    };
  } catch (error: any) {
    console.error("Org register error:", error);
    return {
      success: false,
      message: error.message || "Failed to complete brokerage registration",
    };
  }
}

/**
 * Verify Email Action (supports both token and 6-digit OTP)
 */
export async function verifyEmailAction(
  data: VerifyEmailInput
): Promise<ActionResult<{ user?: ISessionUser; redirectUrl: string }>> {
  try {
    const validated = verifyEmailSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Please provide a verification token or OTP",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await connectToDatabase();
    const now = new Date();

    let user: any = null;

    if (validated.data.token) {
      user = await User.findOne({
        emailVerificationToken: validated.data.token,
        emailVerificationExpires: { $gt: now },
      });
    } else if (validated.data.email && validated.data.otp) {
      user = await User.findOne({
        email: validated.data.email.toLowerCase(),
        emailVerificationOtp: validated.data.otp.trim(),
        emailVerificationExpires: { $gt: now },
      });
    }

    if (!user) {
      return {
        success: false,
        message:
          "Verification link or OTP is invalid or has expired. Please request a new code.",
      };
    }

    // Mark user as verified
    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = null;
    user.emailVerificationOtp = null;
    user.emailVerificationExpires = null;
    await user.save();

    // Fetch org info for session
    let organizationSlug = null;
    let organizationName = null;

    if (user.organizationId) {
      const org = await Organization.findById(user.organizationId);
      if (org) {
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
      isEmailVerified: true,
    };

    // Auto-login upon successful verification
    await setSessionCookie(sessionUser);

    let redirectUrl = "/dashboard";
    if (user.role === "SYSTEM_ADMIN") {
      redirectUrl = "/system-admin";
    }

    return {
      success: true,
      message: "Your email has been verified successfully! Redirecting to dashboard...",
      data: { user: sessionUser, redirectUrl },
    };
  } catch (error: any) {
    console.error("Verify email error:", error);
    return {
      success: false,
      message: error.message || "Failed to complete email verification",
    };
  }
}

/**
 * Resend Email Verification Action
 */
export async function resendVerificationAction(
  email: string
): Promise<ActionResult> {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, message: "Please provide a valid email address" };
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return { success: false, message: "No account found with this email" };
    }

    if (user.isEmailVerified) {
      return {
        success: false,
        message: "Your email is already verified. Please sign in.",
      };
    }

    const { token, otp } = generateTokens();
    user.emailVerificationToken = token;
    user.emailVerificationOtp = otp;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      token,
      otp,
    });

    return {
      success: true,
      message: "A new verification code and link have been dispatched to your email.",
    };
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return {
      success: false,
      message: error.message || "Failed to resend verification code",
    };
  }
}

/**
 * Forgot Password Request Action
 * Generates password reset token & OTP and sends Mailtrap email
 */
export async function forgotPasswordAction(
  data: ForgotPasswordInput
): Promise<ActionResult<{ email: string }>> {
  try {
    const validated = forgotPasswordSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Please provide a valid email address",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await connectToDatabase();

    const user = await User.findOne({
      email: validated.data.email.toLowerCase(),
    });

    if (!user) {
      return {
        success: false,
        message: "No account found with this email address.",
      };
    }

    if (user.status === "DISABLED") {
      return {
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      };
    }

    const { token, otp } = generateTokens();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = token;
    user.passwordResetOtp = otp;
    user.passwordResetExpires = expires;
    await user.save();

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      token,
      otp,
    });

    return {
      success: true,
      message:
        "Password reset instructions have been dispatched to your email.",
      data: { email: user.email },
    };
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: error.message || "Failed to process password reset request",
    };
  }
}

/**
 * Reset Password Action
 * Validates token / OTP, checks strong password, updates user password
 */
export async function resetPasswordAction(
  data: ResetPasswordInput
): Promise<ActionResult<{ redirectUrl: string }>> {
  try {
    const validated = resetPasswordSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation error in submitted data",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await connectToDatabase();
    const now = new Date();

    let user: any = null;

    if (validated.data.token) {
      user = await User.findOne({
        passwordResetToken: validated.data.token,
        passwordResetExpires: { $gt: now },
      });
    } else if (validated.data.email && validated.data.otp) {
      user = await User.findOne({
        email: validated.data.email.toLowerCase(),
        passwordResetOtp: validated.data.otp.trim(),
        passwordResetExpires: { $gt: now },
      });
    }

    if (!user) {
      return {
        success: false,
        message:
          "Password reset link or OTP code is invalid or has expired. Please request a new code.",
      };
    }

    const newPasswordHash = await hashPassword(validated.data.password);

    user.passwordHash = newPasswordHash;
    user.passwordResetToken = null;
    user.passwordResetOtp = null;
    user.passwordResetExpires = null;
    await user.save();

    return {
      success: true,
      message:
        "Password updated successfully! Please sign in with your new credentials.",
      data: { redirectUrl: "/login" },
    };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: error.message || "Failed to reset password",
    };
  }
}

/**
 * Logout Action
 */
export async function logoutAction(): Promise<ActionResult> {
  await clearSessionCookie();
  return { success: true, message: "Signed out successfully" };
}
