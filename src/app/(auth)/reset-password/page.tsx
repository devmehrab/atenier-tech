"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { resetPasswordAction } from "@/lib/actions/auth.actions";
import {
  PasswordStrengthMeter,
  checkPasswordStrength,
} from "@/components/auth/PasswordStrengthMeter";
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();

  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [token, setToken] = useState(tokenParam);
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);
  }, [tokenParam, emailParam]);

  const passwordStatus = useMemo(() => {
    return checkPasswordStrength(password);
  }, [password]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check strong password
    if (!passwordStatus.isStrong) {
      error(
        "অনুগ্রহ করে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন (কমপক্ষে ৮ অক্ষর, বড় ও ছোট হাতের অক্ষর, সংখ্যা এবং বিশেষ চিহ্ন আবশ্যক)"
      );
      return;
    }

    // 2. Confirm password check
    if (password !== confirmPassword) {
      error("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!");
      return;
    }

    if (!token && (!email || !otp)) {
      error("রিসেট টোকেন অথবা ইমেইল ও ওটিপি কোড প্রদান করুন");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPasswordAction({
        token: token || undefined,
        email: email || undefined,
        otp: otp || undefined,
        password,
        confirmPassword,
      });

      if (res.success) {
        setIsSuccess(true);
        success("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
        setTimeout(() => {
          router.push(res.data?.redirectUrl || "/login");
        }, 2000);
      } else {
        error(res.message || "পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      error(err.message || "একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-border text-center space-y-4 shadow-xl">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-foreground">
          পাসওয়ার্ড সফলভাবে রিসেট হয়েছে!
        </h3>
        <p className="text-xs text-muted-foreground">
          আপনার নতুন পাসওয়ার্ড দিয়ে এখন লগইন করতে পারবেন। লগইন পেজে নিয়ে যাওয়া হচ্ছে...
        </p>
        <div className="pt-2">
          <Button
            onClick={() => router.push("/login")}
            className="w-full h-11 text-sm font-bold gap-2"
          >
            <span>লগইন পেজে যান</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">
          নতুন পাসওয়ার্ড সেট করুন
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground">
          আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী নতুন পাসওয়ার্ড তৈরি করুন
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        {/* If token is NOT present in URL, ask for email and OTP */}
        {!token && (
          <div className="space-y-3.5 p-3.5 rounded-xl bg-card/60 border border-border/60">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                অফিসিয়াল ইমেইল ایڈ্রেস *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="you@agency.com"
                  className="pl-10 h-11 bg-background border-input text-foreground text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                ৬-সংখ্যার রিসেট কোড (OTP) *
              </label>
              <Input
                type="text"
                required
                maxLength={6}
                placeholder="যেমন: 481920"
                className="h-11 bg-background border-input text-foreground text-sm font-mono tracking-wider"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            নতুন পাসওয়ার্ড *
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="pl-10 pr-10 h-11 bg-background border-input text-foreground text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Password Strength Meter */}
          <PasswordStrengthMeter
            password={password}
            confirmPassword={confirmPassword}
            showMatchIndicator={false}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            নতুন পাসওয়ার্ড নিশ্চিত করুন *
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className={`pl-10 pr-10 h-11 bg-background text-foreground text-sm ${
                confirmPassword && password !== confirmPassword
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-input"
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          {confirmPassword && (
            <div className="mt-1.5 text-xs">
              {password === confirmPassword ? (
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

        <Button
          type="submit"
          isLoading={loading}
          size="lg"
          className="w-full h-11 text-sm font-bold shadow-md gap-2 mt-3"
        >
          <span>পাসওয়ার্ড সংরক্ষণ করুন</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center pt-2 text-xs text-muted-foreground">
        মনে পড়েছে?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          লগইন করুন
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-8 text-muted-foreground text-xs">
          লোড হচ্ছে...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
