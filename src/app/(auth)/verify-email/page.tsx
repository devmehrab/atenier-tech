"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  verifyEmailAction,
  resendVerificationAction,
} from "@/lib/actions/auth.actions";
import {
  MailCheck,
  Mail,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error, info } = useToast();

  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [autoVerifying, setAutoVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update email if query param changes
  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (tokenParam) {
      handleAutoVerify(tokenParam);
    }
  }, [tokenParam]);

  const handleAutoVerify = async (token: string) => {
    setAutoVerifying(true);
    try {
      const res = await verifyEmailAction({ token });
      if (res.success) {
        setIsVerified(true);
        success("আপনার ইমেইল সফলভাবে ভেরিফাই হয়েছে!");
        setTimeout(() => {
          router.push(res.data?.redirectUrl || "/dashboard");
        }, 2000);
      } else {
        error(res.message || "ভেরিফিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে ওটিপি দিয়ে চেষ্টা করুন।");
      }
    } catch (err: any) {
      error(err.message || "ভেরিফিকেশন ত্রুটি ঘটেছে");
    } finally {
      setAutoVerifying(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle pasted string
      const pasted = value.replace(/[^0-9]/g, "").slice(0, 6);
      if (pasted.length > 0) {
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = pasted[i] || "";
        }
        setOtp(newOtp);
        const nextIndex = Math.min(pasted.length, 5);
        inputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    const val = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Submit OTP Verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (!email) {
      error("অনুগ্রহ করে আপনার ইমেইল প্রদান করুন");
      return;
    }

    if (fullOtp.length !== 6) {
      error("অনুগ্রহ করে ৬-সংখ্যার ওটিপি কোডটি সম্পূর্ণ পূরণ করুন");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyEmailAction({
        email,
        otp: fullOtp,
      });

      if (res.success) {
        setIsVerified(true);
        success("আপনার ইমেইল সফলভাবে ভেরিফাই হয়েছে!");
        setTimeout(() => {
          router.push(res.data?.redirectUrl || "/dashboard");
        }, 1500);
      } else {
        error(res.message || "ভেরিফিকেশন ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      error(err.message || "একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে");
    } finally {
      setLoading(false);
    }
  };

  // Resend Verification Email
  const handleResend = async () => {
    if (!email) {
      error("ইমেইল অ্যাড্রেস প্রদান করা আবশ্যক");
      return;
    }

    setResending(true);
    try {
      const res = await resendVerificationAction(email);
      if (res.success) {
        info("নতুন ভেরিফিকেশন কোড আপনার ইমেইলে পাঠানো হয়েছে। ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।");
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        error(res.message || "কোড পুনরায় পাঠানো যায়নি");
      }
    } catch (err: any) {
      error(err.message || "কোড পুনরায় পাঠাতে সমস্যা হয়েছে");
    } finally {
      setResending(false);
    }
  };

  if (autoVerifying) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-border text-center space-y-4">
        <div className="flex justify-center">
          <RefreshCw className="h-12 w-12 text-primary animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          ইমেইল স্বয়ংক্রিয়ভাবে ভেরিফাই করা হচ্ছে...
        </h3>
        <p className="text-xs text-muted-foreground">
          অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন
        </p>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-border text-center space-y-4 shadow-xl">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-foreground">
          ইমেইল ভেরিফিকেশন সফল!
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          আপনার অ্যাকাউন্ট সক্রিয় হয়েছে। ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...
        </p>
        <div className="pt-3">
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full h-11 text-sm font-bold gap-2"
          >
            <span>সরাসরি ড্যাশবোর্ডে যান</span>
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
          <MailCheck className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">
          ইমেইল ভেরিফিকেশন
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto">
          আপনার অ্যাকাউন্টের সুরক্ষার জন্য আমরা{" "}
          <span className="font-semibold text-foreground">
            {email || "আপনার ইমেইলে"}
          </span>{" "}
          একটি ৬-সংখ্যার ওটিপি ও ভেরিফিকেশন লিংক পাঠিয়েছি (Mailtrap Inbox)।
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-5">
        {/* Email Field (Editable if needed) */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            অফিসিয়াল ইমেইল এড্রেস
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              required
              placeholder="owner@agency.com"
              className="pl-10 h-11 bg-background border-input text-foreground text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* 6-Digit OTP Boxes */}
        <div>
          <label className="block text-xs font-semibold text-foreground text-center mb-2.5">
            ৬-সংখ্যার ভেরিফিকেশন কোড (OTP) লিখুন
          </label>
          <div className="flex justify-between gap-2 max-w-sm mx-auto">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-bold bg-background border-2 border-input rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          size="lg"
          className="w-full h-11 text-sm font-bold shadow-md gap-2"
        >
          <span>কোড যাচাই করুন</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Resend Code Section */}
      <div className="text-center pt-2 text-xs space-y-2 border-t border-border/50">
        <p className="text-muted-foreground">ইমেইল বা কোড পাননি?</p>
        <button
          type="button"
          disabled={resending || countdown > 0}
          onClick={handleResend}
          className="font-bold text-primary hover:underline disabled:opacity-50 disabled:no-underline inline-flex items-center gap-1.5"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${resending ? "animate-spin" : ""}`}
          />
          {countdown > 0
            ? `পুনরায় কোড পাঠান (${countdown} সেকেন্ড পর)`
            : "নতুন ভেরিফিকেশন কোড পাঠান"}
        </button>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        অন্য একাউন্টে লগইন করতে চান?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          লগইন পেজে যান
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-8 text-muted-foreground text-xs">
          লোড হচ্ছে...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
