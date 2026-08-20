"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { loginAction } from "@/lib/actions/auth.actions";
import { Lock, Mail, ArrowRight, Shield, Building, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginAction(formData);
      if (res.success && res.data) {
        success("সফলভাবে লগইন হয়েছে!");
        router.push(res.data.redirectUrl);
        router.refresh();
      } else {
        error(res.message || "লগইন ব্যর্থ হয়েছে, সঠিক তথ্য প্রদান করুন");
      }
    } catch (err: any) {
      error(err.message || "একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email: string, pass: string) => {
    setFormData({ email, password: pass });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
          এজেন্সি পোর্টালে লগইন
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
          আপনার রিয়েল এস্টেট এজেন্সি ড্যাশবোর্ড, প্রপার্টি লিস্টিং ও লিড ম্যানেজমেন্টে প্রবেশ করুন
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-foreground">
              পাসওয়ার্ড
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              required
              placeholder="••••••••"
              className="pl-10 h-11 bg-background border-input text-foreground text-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" isLoading={loading} size="lg" className="w-full h-11 text-sm font-bold shadow-md gap-2 mt-2">
          <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Quick Demo Logins Section */}
      <div className="pt-5 border-t border-border/50">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center mb-3">
          ১-ক্লিকে টেস্ট ডেমো অ্যাকাউন্ট লগইন
        </span>
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => fillCredentials("rahman@rahmanproperties.com", "password123")}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-card/60 hover:border-primary hover:bg-primary/10 text-left transition-all group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Building className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-foreground block truncate">রহমান প্রোপার্টিজ</span>
              <span className="text-[10px] text-muted-foreground">এজেন্সি ওনার</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fillCredentials("apex@apexrealty.com", "password123")}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-card/60 hover:border-primary hover:bg-primary/10 text-left transition-all group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Building className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-foreground block truncate">এপেক্স রিয়েলটি</span>
              <span className="text-[10px] text-muted-foreground">এজেন্সি ওনার</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fillCredentials("agent@rahmanproperties.com", "password123")}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-card/60 hover:border-primary hover:bg-primary/10 text-left transition-all group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <UserCheck className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-foreground block truncate">ফিল্ড এজেন্ট</span>
              <span className="text-[10px] text-muted-foreground">স্টাফ অ্যাকাউন্ট</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fillCredentials("admin@estatesphere.io", "admin123")}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 text-left transition-all group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/20 text-destructive shrink-0">
              <Shield className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-foreground block truncate">সুপার অ্যাডমিন</span>
              <span className="text-[10px] text-destructive">প্ল্যাটফর্ম রুট</span>
            </div>
          </button>
        </div>
      </div>

      <div className="text-center pt-2 text-xs text-muted-foreground">
        আপনার নতুন রিয়েল এস্টেট এজেন্সি আছে?{" "}
        <Link
          href="/register-organization"
          className="font-bold text-primary hover:underline"
        >
          নতুন এজেন্সি রেজিস্ট্রেশন করুন
        </Link>
      </div>
    </div>
  );
}

