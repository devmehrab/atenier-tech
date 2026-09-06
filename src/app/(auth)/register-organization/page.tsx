"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { registerOrgAction } from "@/lib/actions/auth.actions";
import { slugify } from "@/lib/utils/slugify";
import { isDisposableEmail } from "@/lib/utils/email-validator";
import {
  PasswordStrengthMeter,
  checkPasswordStrength,
} from "@/components/auth/PasswordStrengthMeter";
import {
  Building,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

export default function RegisterOrgPage() {
  const router = useRouter();
  const { success, error, info } = useToast();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    organizationName: "",
    organizationSlug: "",
    city: "",
    country: "US",
  });

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      organizationName: val,
      organizationSlug: slugify(val),
    }));
  };

  // Real-time email validation check for disposable / temporary domains
  const emailDisposableCheck = useMemo(() => {
    if (!formData.email || !formData.email.includes("@")) {
      return { isDisposable: false };
    }
    return isDisposableEmail(formData.email);
  }, [formData.email]);

  // Password strength check
  const passwordStatus = useMemo(() => {
    return checkPasswordStrength(formData.password);
  }, [formData.password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check disposable email
    if (emailDisposableCheck.isDisposable) {
      error(
        emailDisposableCheck.reason ||
          "Disposable or temporary email addresses are not permitted. Please use a valid work or personal email."
      );
      return;
    }

    // 2. Force strong password
    if (!passwordStatus.isStrong) {
      error(
        "Please use a strong password (at least 8 characters with upper & lowercase letters, numbers, and symbols)"
      );
      return;
    }

    // 3. Confirm password check
    if (formData.password !== formData.confirmPassword) {
      error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await registerOrgAction(formData);
      if (res.success && res.data) {
        success(res.message || "Brokerage registered successfully!");
        info("A verification code has been sent to your email to activate your account.");
        router.push(res.data.redirectUrl);
      } else {
        error(res.message || "Failed to register brokerage");
      }
    } catch (err: any) {
      error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
          Create Brokerage Account
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Launch your agency's branded digital storefront and cloud inventory platform
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Organization Name */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Agency / Brokerage Name *
          </label>
          <div className="relative">
            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              required
              placeholder="e.g. Skyline Capital Realty"
              className="pl-10 h-11 bg-background border-input text-foreground text-sm"
              value={formData.organizationName}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
        </div>

        {/* Organization Slug */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Agency URL Handle (Slug) *
          </label>
          <Input
            required
            placeholder="skyline-capital"
            className="h-11 bg-background border-input text-foreground text-sm font-mono"
            value={formData.organizationSlug}
            onChange={(e) =>
              setFormData({ ...formData, organizationSlug: slugify(e.target.value) })
            }
          />
          <p className="mt-1.5 text-[11px] font-mono text-primary font-medium">
            Public storefront link: /{formData.organizationSlug || "your-agency-slug"}
          </p>
        </div>

        {/* Location (City & Country) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              City / Region *
            </label>
            <Input
              required
              placeholder="New York, NY"
              className="h-11 bg-background border-input text-foreground text-sm"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Country Code
            </label>
            <Input
              required
              placeholder="US"
              className="h-11 bg-background border-input text-foreground text-sm"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <span className="block text-xs font-bold text-foreground mb-3">
            Principal Account & Credentials
          </span>

          <div className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  placeholder="e.g. Alexander Wright"
                  className="pl-10 h-11 bg-background border-input text-foreground text-sm"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                />
              </div>
            </div>

            {/* Email Address with Disposable Email Warning */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Official Email Address *
                </label>
                <span className="text-[10px] text-muted-foreground">
                  (Corporate domain, Gmail, or Outlook)
                </span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="principal@brokerage.com"
                  className={`pl-10 h-11 bg-background text-foreground text-sm ${
                    emailDisposableCheck.isDisposable
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-input"
                  }`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {emailDisposableCheck.isDisposable && (
                <div className="mt-1.5 flex items-start gap-1.5 text-xs text-destructive bg-destructive/10 p-2 rounded-lg border border-destructive/20">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{emailDisposableCheck.reason}</span>
                </div>
              )}
            </div>

            {/* Strong Password */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Master Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-background border-input text-foreground text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Real-time Password Strength Meter */}
              <PasswordStrengthMeter
                password={formData.password}
                confirmPassword={formData.confirmPassword}
                showMatchIndicator={false}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className={`pl-10 pr-10 h-11 bg-background text-foreground text-sm ${
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-input"
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Match Feedback */}
              {formData.confirmPassword && (
                <div className="mt-1.5 text-xs">
                  {formData.password === formData.confirmPassword ? (
                    <span className="text-emerald-500 font-medium flex items-center gap-1">
                      ✓ Passwords match
                    </span>
                  ) : (
                    <span className="text-destructive font-medium flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Phone / WhatsApp Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  className="pl-10 h-11 bg-background border-input text-foreground text-sm"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          size="lg"
          className="w-full h-11 text-sm font-bold shadow-md gap-2 mt-4"
        >
          <span>Create Agency & Verify Email</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center pt-2 text-xs text-muted-foreground">
        Already have a brokerage account?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
