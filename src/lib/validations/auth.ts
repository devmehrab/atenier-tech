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
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z)")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z)")
  .regex(/[0-9]/, "Password must contain at least one numerical digit (0-9)")
  .regex(
    /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\]/,
    "Password must contain at least one special symbol (@, #, $, etc.)"
  );

export const genuineEmailSchema = z
  .string()
  .email("Please enter a valid email address")
  .refine(
    (email) => {
      const res = isDisposableEmail(email);
      return !res.isDisposable;
    },
    {
      message:
        "Disposable or temporary email addresses are not permitted. Please use a valid work or personal email.",
    }
  );

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: genuineEmailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const registerOrgSchema = z
  .object({
    userName: z.string().min(2, "Full name must be at least 2 characters"),
    email: genuineEmailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z.string().optional(),
    organizationName: z.string().min(2, "Agency name must be at least 2 characters"),
    organizationSlug: z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .max(50, "Slug cannot exceed 50 characters")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      ),
    city: z.string().min(2, "City / Region is required"),
    country: z.string().default("US"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterOrgInput = z.infer<typeof registerOrgSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email address").optional(),
    token: z.string().optional(),
    otp: z.string().optional(),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.token || (data.email && data.otp), {
    message: "A reset token or email with OTP code is required",
    path: ["token"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
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
    message: "A verification token or email with OTP code is required",
  });

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
