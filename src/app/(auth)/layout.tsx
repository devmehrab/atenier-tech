import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background text-foreground relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-md group-hover:scale-105 transition-transform">
            <Building2 className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold text-foreground">
            <span className="text-primary">ATENIER</span>
          </span>
        </Link>
      </div>

      {/* Auth Content Container - Seamlessly Blended with Background */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4 sm:px-0">
        <div className="w-full">
          {children}
        </div>
      </div>

      {/* Security Footer Note */}
      <div className="mt-8 text-center text-xs text-muted-foreground relative z-10 flex items-center justify-center gap-1.5 font-medium">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span>নিরাপদ ও নির্ভরযোগ্য এন্টারপ্রাইজ রিয়েল এস্টেট ক্লাউড প্ল্যাটফর্ম</span>
      </div>
    </div>
  );
}

