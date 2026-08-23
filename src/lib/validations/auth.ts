import { z } from "zod";
import { isDisposableEmail } from "@/lib/utils/email-validator";

// Strong password regex and rules
// Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
export const passwordStrengthRegex = {
  minLength: 8,
  hasUpper: /[A-Z]/,
  hasLower: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\]/,
};

export const strongPasswordSchema = z
  .string()
  .min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে (Password must be at least 8 characters)")
  .regex(/[A-Z]/, "কমপক্ষে একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে (At least one uppercase letter)")
  .regex(/[a-z]/, "কমপক্ষে একটি ছোট হাতের অক্ষর (a-z) থাকতে হবে (At least one lowercase letter)")
  .regex(/[0-9]/, "কমপক্ষে একটি সংখ্যা (0-9) থাকতে হবে (At least one number)")
  .regex(
    /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\]/,
    "কমপক্ষে একটি বিশেষ চিহ্ন (@, #, $, %, !, ইত্যাদি) থাকতে হবে (At least one special character)"
  );

export const genuineEmailSchema = z
  .string()
  .email("অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস প্রদান করুন")
  .refine(
    (email) => {
      const res = isDisposableEmail(email);
      return !res.isDisposable;
    },
    {
      message:
        "ডিসপোজেবল বা ফেক ইমেইল গ্রহণযোগ্য নয়। অনুগ্রহ করে আপনার আসল ইমেইল ব্যবহার করুন। (Temporary/disposable emails are not allowed)",
    }
  );

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "পাসওয়ার্ড প্রদান করুন"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: genuineEmailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন (Please confirm password)"),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটি মিলছে না (Passwords do not match)",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const registerOrgSchema = z
  .object({
    userName: z.string().min(2, "পুরো নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
    email: genuineEmailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন (Please confirm password)"),
    phone: z.string().optional(),
    organizationName: z.string().min(2, "এজেন্সির নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
    organizationSlug: z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .max(50, "Slug cannot exceed 50 characters")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      ),
    city: z.string().min(2, "শহরের নাম আবশ্যক"),
    country: z.string().default("BD"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটি মিলছে না (Passwords do not match)",
    path: ["confirmPassword"],
  });

export type RegisterOrgInput = z.infer<typeof registerOrgSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস প্রদান করুন"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    email: z.string().email("অনুগ্রহ করে সঠিক ইমেইল প্রদান করুন").optional(),
    token: z.string().optional(),
    otp: z.string().optional(),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
  })
  .refine((data) => data.token || (data.email && data.otp), {
    message: "রিসেট টোকেন অথবা ইমেইল ও ওটিপি কোড প্রদান করা আবশ্যক",
    path: ["token"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "নতুন পাসওয়ার্ড দুটি মিলছে না (Passwords do not match)",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Verify Email Schema
export const verifyEmailSchema = z
  .object({
    email: z.string().email().optional(),
    token: z.string().optional(),
    otp: z.string().optional(),
  })
  .refine((data) => data.token || (data.email && data.otp), {
    message: "ভেরিফিকেশন টোকেন অথবা ইমেইল ও ওটিপি কোড আবশ্যক",
  });

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
