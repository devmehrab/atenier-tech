"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { registerOrgAction } from "@/lib/actions/auth.actions";
import { slugify } from "@/lib/utils/slugify";
import { Building, User, Mail, Lock, Phone, Globe, ArrowRight } from "lucide-react";

export default function RegisterOrgPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerOrgAction(formData);
      if (res.success && res.data) {
        success("এজেন্সি সফলভাবে তৈরি হয়েছে!");
        router.push(res.data.redirectUrl);
        router.refresh();
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
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
          নতুন এজেন্সি রেজিস্ট্রেশন
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
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
            এজেন্সি ওনার অ্যাকাউন্ট তথ্য
          </span>

          <div className="space-y-3.5">
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

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                অফিসিয়াল ইমেইল এড্রেস *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="owner@agency.com"
                  className="pl-10 h-11 bg-background border-input text-foreground text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *
              </label>
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

        <Button type="submit" isLoading={loading} size="lg" className="w-full h-11 text-sm font-bold shadow-md gap-2 mt-4">
          <span>এজেন্সি তৈরি ও লঞ্চ করুন</span>
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

