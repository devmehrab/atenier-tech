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
        message: "সঠিক তথ্য প্রদান করুন",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await connectToDatabase();

    const user = await User.findOne({
      email: validated.data.email.toLowerCase(),
    });

    if (!user) {
      return { success: false, message: "ভুল ইমেইল অথবা পাসওয়ার্ড" };
    }

    if (user.status === "DISABLED") {
      return {
        success: false,
        message: "আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে। সাপোর্টে যোগাযোগ করুন।",
      };
    }

    const isMatch = await comparePassword(
      validated.data.password,
      user.passwordHash
    );

    if (!isMatch) {
      return { success: false, message: "ভুল ইমেইল অথবা পাসওয়ার্ড" };
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
          "আপনার ইমেইল এখনও ভেরিফাই করা হয়নি। আপনার ইনবক্সে পাঠানো ভেরিফিকেশন লিংক বা ওটিপি দিয়ে ভেরিফাই করুন।",
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
            message: "আপনার এজেন্সি অ্যাকাউন্ট স্থগিত রাখা হয়েছে।",
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
      message: "সফলভাবে সাইন ইন হয়েছে",
      data: { user: sessionUser, redirectUrl },
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "সাইন ইন করার সময় একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে",
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
        message: "প্রদত্ত তথ্যে ত্রুটি রয়েছে। অনুগ্রহ করে চেক করুন।",
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
        message: "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে লগইন করুন।",
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
          "এই এজেন্সি ওয়েব হ্যান্ডেলটি (URL Slug) ইতিমধ্যে ব্যবহৃত হচ্ছে। অন্য একটি নাম দিন।",
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
      country: validated.data.country || "BD",
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
        "এজেন্সি সফলভাবে রেজিস্টার হয়েছে! আপনার ইমেইলে ভেরিফিকেশন কোড ও লিংক পাঠানো হয়েছে।",
      data: {
        email: user.email,
        redirectUrl: `/verify-email?email=${encodeURIComponent(user.email)}`,
      },
    };
  } catch (error: any) {
    console.error("Org register error:", error);
    return {
      success: false,
      message: error.message || "এজেন্সি রেজিস্ট্রেশন সম্পন্ন করা যায়নি",
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
        message: "ভেরিফিকেশন টোকেন অথবা ওটিপি প্রদান করুন",
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
          "ভেরিফিকেশন লিংক বা ওটিপি কোডটি সঠিক নয় অথবা এর মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন কোড রিকোয়েস্ট করুন।",
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
      message: "আপনার ইমেইল সফলভাবে ভেরিফাই হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...",
      data: { user: sessionUser, redirectUrl },
    };
  } catch (error: any) {
    console.error("Verify email error:", error);
    return {
      success: false,
      message: error.message || "ইমেইল ভেরিফিকেশন সম্পন্ন করা যায়নি",
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
      return { success: false, message: "সঠিক ইমেইল এড্রেস প্রদান করুন" };
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return { success: false, message: "এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি" };
    }

    if (user.isEmailVerified) {
      return {
        success: false,
        message: "আপনার ইমেইল ইতিমধ্যে ভেরিফাই করা আছে। অনুগ্রহ করে লগইন করুন।",
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
      message: "নতুন ভেরিফিকেশন কোড ও লিংক আপনার ইমেইলে পাঠানো হয়েছে।",
    };
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return {
      success: false,
      message: error.message || "ভেরিফিকেশন কোড পুনরায় পাঠানো যায়নি",
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
        message: "অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস প্রদান করুন",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await connectToDatabase();

    const user = await User.findOne({
      email: validated.data.email.toLowerCase(),
    });

    if (!user) {
      // Return clear message or generic message for security
      return {
        success: false,
        message: "এই ইমেইল অ্যাড্রেস দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।",
      };
    }

    if (user.status === "DISABLED") {
      return {
        success: false,
        message: "আপনার অ্যাকাউন্ট নিষ্ক্রিয় রয়েছে। সাপোর্টে যোগাযোগ করুন।",
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
        "পাসওয়ার্ড রিসেট লিংক ও ওটিপি কোড আপনার ইমেইলে পাঠানো হয়েছে। আপনার ইনবক্স চেক করুন।",
      data: { email: user.email },
    };
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: error.message || "পাসওয়ার্ড রিসেট রিকোয়েস্ট সম্পন্ন করা যায়নি",
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
        message: "প্রদত্ত তথ্যে ত্রুটি রয়েছে",
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
          "পাসওয়ার্ড রিসেট লিংক বা ওটিপি কোডটি সঠিক নয় অথবা এর মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার রিকোয়েস্ট করুন।",
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
        "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! অনুগ্রহ করে নতুন পাসওয়ার্ড দিয়ে লগইন করুন।",
      data: { redirectUrl: "/login" },
    };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: error.message || "পাসওয়ার্ড রিসেট করা সম্ভব হয়নি",
    };
  }
}

/**
 * Logout Action
 */
export async function logoutAction(): Promise<ActionResult> {
  await clearSessionCookie();
  return { success: true, message: "সফলভাবে সাইন আউট হয়েছে" };
}
