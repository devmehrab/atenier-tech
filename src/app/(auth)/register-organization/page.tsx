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
    country: "BD",
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
          "ডিসপোজেবল বা ফেক ইমেইল গ্রহণযোগ্য নয়। অনুগ্রহ করে আপনার আসল ইমেইল ব্যবহার করুন।"
      );
      return;
    }

    // 2. Force strong password
    if (!passwordStatus.isStrong) {
      error(
        "অনুগ্রহ করে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন (কমপক্ষে ৮ অক্ষর, বড় ও ছোট হাতের অক্ষর, সংখ্যা এবং বিশেষ চিহ্ন আবশ্যক)"
      );
      return;
    }

    // 3. Confirm password check
    if (formData.password !== formData.confirmPassword) {
      error("পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!");
      return;
    }

    setLoading(true);

    try {
      const res = await registerOrgAction(formData);
      if (res.success && res.data) {
        success(res.message || "এজেন্সি সফলভাবে তৈরি হয়েছে!");
        info("আপনার ইমেইলে পাঠানো ভেরিফিকেশন কোড দিয়ে অ্যাকাউন্ট ভেরিফাই করুন।");
        router.push(res.data.redirectUrl);
      } else {
        error(res.message || "এজেন্সি রেজিস্ট্রেশন ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      error(err.message || "একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-foreground">
          নতুন এজেন্সি রেজিস্ট্রেশন
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground">
          আপনার রিয়েল এস্টেট এজেন্সির জন্য নিজস্ব ব্র্যান্ডেড স্টোরফ্রন্ট ও ক্লাউড ম্যানেজমেন্ট ড্যাশবোর্ড তৈরি করুন
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Organization Name */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            এজেন্সি / ব্রোকারেজ নাম *
          </label>
          <div className="relative">
            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              required
              placeholder="যেমন: স্কাইলাইন রিয়েল এস্টেট"
              className="pl-10 h-11 bg-background border-input text-foreground text-sm"
              value={formData.organizationName}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
        </div>

        {/* Organization Slug */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            এজেন্সি ওয়েব হ্যান্ডেল (URL Slug) *
          </label>
          <Input
            required
            placeholder="skyline-real-estate"
            className="h-11 bg-background border-input text-foreground text-sm font-mono"
            value={formData.organizationSlug}
            onChange={(e) =>
              setFormData({ ...formData, organizationSlug: slugify(e.target.value) })
            }
          />
          <p className="mt-1.5 text-[11px] font-mono text-primary font-medium">
            পাবলিক স্টোরফ্রন্ট লিংক: /{formData.organizationSlug || "your-agency-slug"}
          </p>
        </div>

        {/* Location (City & Country) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              শহর / লোকেশন *
            </label>
            <Input
              required
              placeholder="ঢাকা / চট্টগ্রাম"
              className="h-11 bg-background border-input text-foreground text-sm"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              দেশ
            </label>
            <Input
              required
              placeholder="BD / US"
              className="h-11 bg-background border-input text-foreground text-sm"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <span className="block text-xs font-bold text-foreground mb-3">
            এজেন্সি ওনার অ্যাকাউন্ট ও নিরাপত্তা তথ্য
          </span>

          <div className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                আপনার পুরো নাম *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  placeholder="যেমন: তানভীর আহমেদ"
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
                  অফিসিয়াল ইমেইল এড্রেস *
                </label>
                <span className="text-[10px] text-muted-foreground">
                  (Gmail, Outlook, Yahoo বা অফিসিয়াল ডোমেইন)
                </span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="owner@agency.com বা owner@gmail.com"
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
                শক্তিশালী পাসওয়ার্ড *
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
                পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *
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
                      ✓ পাসওয়ার্ড মিলেছে (Passwords match)
                    </span>
                  ) : (
                    <span className="text-destructive font-medium flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      পাসওয়ার্ড মিলছে না (Passwords do not match)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                মোবাইল / হোয়াটসঅ্যাপ নম্বর
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="+880 1700-000000"
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
          <span>এজেন্সি তৈরি ও ইমেইল ভেরিফাই করুন</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center pt-2 text-xs text-muted-foreground">
        ইতিমধ্যে এজেন্সি একাউন্ট আছে?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          লগইন করুন
        </Link>
      </div>
    </div>
  );
}
