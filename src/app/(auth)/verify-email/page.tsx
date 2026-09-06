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
        success("Your email has been verified successfully!");
        setTimeout(() => {
          router.push(res.data?.redirectUrl || "/dashboard");
        }, 2000);
      } else {
        error(res.message || "Verification failed. Please try with your 6-digit OTP.");
      }
    } catch (err: any) {
      error(err.message || "Verification error occurred");
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
      error("Please enter your email address");
      return;
    }

    if (fullOtp.length !== 6) {
      error("Please enter the complete 6-digit code");
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
        success("Your email has been verified successfully!");
        setTimeout(() => {
          router.push(res.data?.redirectUrl || "/dashboard");
        }, 1500);
      } else {
        error(res.message || "Email verification failed");
      }
    } catch (err: any) {
      error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Resend Verification Email
  const handleResend = async () => {
    if (!email) {
      error("Email address is required");
      return;
    }

    setResending(true);
    try {
      const res = await resendVerificationAction(email);
      if (res.success) {
        info("A new verification code has been sent to your email.");
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        error(res.message || "Failed to resend code");
      }
    } catch (err: any) {
      error(err.message || "Error resending code");
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
          Verifying your email address...
        </h3>
        <p className="text-xs text-muted-foreground">
          Please wait a few moments
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
          Email Verified Successfully!
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Your account is now active. Redirecting to dashboard...
        </p>
        <div className="pt-3">
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full h-11 text-sm font-bold gap-2"
          >
            <span>Proceed to Dashboard</span>
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
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
          Email Verification
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto">
          To secure your brokerage account, we sent a 6-digit code to{" "}
          <span className="font-semibold text-foreground">
            {email || "your email address"}
          </span>.
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-5">
        {/* Email Field (Editable if needed) */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Work Email Address
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
            Enter 6-Digit Verification Code
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
          <span>Verify Email & Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Resend Code Section */}
      <div className="text-center pt-2 text-xs space-y-2 border-t border-border/50">
        <p className="text-muted-foreground">Didn't receive the email code?</p>
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
            ? `Resend code in ${countdown}s`
            : "Resend verification code"}
        </button>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        Need to switch accounts?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Back to sign in
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
          Loading...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
