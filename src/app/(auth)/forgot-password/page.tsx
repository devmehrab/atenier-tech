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
      error("অনুগ্রহ করে আপনার ইমেইল প্রদান করুন");
      return;
    }

    setLoading(true);

    try {
      const res = await forgotPasswordAction({ email });
      if (res.success) {
        setEmailSent(true);
        success("পাসওয়ার্ড রিসেট লিংক ও কোড আপনার ইমেইলে পাঠানো হয়েছে!");
        info("আপনার Mailtrap ইনবক্স চেক করুন।");
      } else {
        error(res.message || "পাসওয়ার্ড রিসেট রিকোয়েস্ট ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      error(err.message || "একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে");
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
          পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে!
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          আমরা <span className="font-semibold text-foreground">{email}</span> ঠিকানায় একটি পাসওয়ার্ড রিসেট লিংক ও ৬-সংখ্যার ওটিপি কোড পাঠিয়েছি।
        </p>

        <div className="pt-3 space-y-2.5">
          <Button
            onClick={() =>
              router.push(`/reset-password?email=${encodeURIComponent(email)}`)
            }
            className="w-full h-11 text-sm font-bold gap-2"
          >
            <span>পাসওয়ার্ড রিসেট পেজে যান</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={() => setEmailSent(false)}
            className="w-full h-10 text-xs font-semibold"
          >
            অন্য ইমেইল দিয়ে চেষ্টা করুন
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
          পাসওয়ার্ড রিসেট
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground">
          আপনার অ্যাকাউন্টের অফিসিয়াল ইমেইল লিখুন। আমরা আপনাকে পাসওয়ার্ড পরিবর্তন করার নিরাপদ লিংক পাঠাব।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            অফিসিয়াল ইমেইল এড্রেস
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
          <span>পাসওয়ার্ড রিসেট লিংক পাঠান</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center pt-2 text-xs text-muted-foreground">
        <Link
          href="/login"
          className="font-bold text-primary hover:underline inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>লগইন পেজে ফিরে যান</span>
        </Link>
      </div>
    </div>
  );
}
