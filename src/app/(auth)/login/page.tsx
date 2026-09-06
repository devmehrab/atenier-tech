"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { loginAction } from "@/lib/actions/auth.actions";
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Building,
  UserCheck,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { success, error, info } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUnverifiedEmail(null);

    try {
      const res = await loginAction(formData);
      if (res.success && res.data) {
        success("Signed in successfully!");
        router.push(res.data.redirectUrl || "/dashboard");
        router.refresh();
      } else if (res.requiresVerification) {
        setUnverifiedEmail(res.unverifiedEmail || formData.email);
        error(res.message || "Email verification required");
      } else {
        error(res.message || "Invalid credentials, please check and try again");
      }
    } catch (err: any) {
      error(err.message || "An unexpected error occurred");
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
          Sign In to Broker Portal
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Access your real estate brokerage dashboard, inventory, and client inquiries
        </p>
      </div>

      {unverifiedEmail && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2.5">
          <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 font-semibold">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Email verification pending</span>
          </div>
          <p className="text-muted-foreground text-[11px]">
            Please verify your email address to unlock your account. We sent a verification code to your inbox.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              router.push(`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`)
            }
            className="w-full h-8 text-xs font-bold border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
          >
            Verify Email Now →
          </Button>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Work Email Address
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
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
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
        </div>

        <Button
          type="submit"
          isLoading={loading}
          size="lg"
          className="w-full h-11 text-sm font-bold shadow-md gap-2 mt-2"
        >
          <span>Sign In to Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Quick Demo Logins Section */}
      <div className="pt-5 border-t border-border/50">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center mb-3">
          1-Click Demo Showcase Access
        </span>
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => fillCredentials("alexander@apexrealty.com", "password123")}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-card/60 hover:border-primary hover:bg-primary/10 text-left transition-all group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Building className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-foreground block truncate">Apex Realty</span>
              <span className="text-[10px] text-muted-foreground">Brokerage Principal</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fillCredentials("sarah@apexrealty.com", "password123")}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-card/60 hover:border-primary hover:bg-primary/10 text-left transition-all group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <UserCheck className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-foreground block truncate">Sarah Jenkins</span>
              <span className="text-[10px] text-muted-foreground">Senior Associate</span>
            </div>
          </button>
        </div>
      </div>

      <div className="text-center pt-2 text-xs text-muted-foreground">
        Managing a real estate agency?{" "}
        <Link
          href="/register-organization"
          className="font-bold text-primary hover:underline"
        >
          Register your brokerage
        </Link>
      </div>
    </div>
  );
}
