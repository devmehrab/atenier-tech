"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { forgotPasswordAction } from "@/lib/actions/auth.actions";
import { KeyRound, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { success, error, info } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const res = await forgotPasswordAction({ email });
      if (res.success) {
        setEmailSent(true);
        success("Password reset instructions have been sent to your email!");
        info("Please check your email inbox for the reset code.");
      } else {
        error(res.message || "Failed to process password reset request");
      }
    } catch (err: any) {
      error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-4 shadow-xl">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Password Reset Code Dispatched
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          We sent password reset instructions and a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
        </p>

        <div className="pt-3 space-y-2.5">
          <Button
            onClick={() =>
              router.push(`/reset-password?email=${encodeURIComponent(email)}`)
            }
            className="w-full h-11 text-sm font-bold gap-2"
          >
            <span>Proceed to Reset Password</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={() => setEmailSent(false)}
            className="w-full h-10 text-xs font-semibold"
          >
            Try another email address
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
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
          Forgot Password
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Enter your registered email address and we will dispatch a secure recovery code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Registered Email Address
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

        <Button
          type="submit"
          isLoading={loading}
          size="lg"
          className="w-full h-11 text-sm font-bold shadow-md gap-2"
        >
          <span>Send Recovery Code</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center pt-2 text-xs text-muted-foreground">
        <Link
          href="/login"
          className="font-bold text-primary hover:underline inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </div>
  );
}
