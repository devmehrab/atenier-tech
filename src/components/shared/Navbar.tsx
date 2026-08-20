"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { ISessionUser } from "@/lib/types";
import { logoutAction } from "@/lib/actions/auth.actions";
import { useToast } from "@/components/ui/toast";
import {
  Menu,
  X,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  PlusCircle,
  Building,
  Compass,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  user?: ISessionUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { success } = useToast();

  const handleLogout = async () => {
    await logoutAction();
    success("সফলভাবে লগআউট হয়েছে");
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md font-sans transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link
              href="/explore"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Compass className="h-4 w-4 stroke-[1.5]" />
              প্রপার্টি খুঁজুন
            </Link>
            <Link
              href="/#features"
              className="transition-colors hover:text-primary"
            >
              আমাদের সেবাসমূহ
            </Link>
            <Link
              href="/#agencies"
              className="transition-colors hover:text-primary"
            >
              পার্টনার এজেন্সিসমূহ
            </Link>
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "SYSTEM_ADMIN" ? (
                <Link href="/system-admin">
                  <Button variant="outline" size="sm" className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 rounded-full font-medium">
                    <ShieldAlert className="h-4 w-4 stroke-[1.5]" />
                    অ্যাডমিন প্যানেল
                  </Button>
                </Link>
              ) : (
                <>
                  {user.organizationSlug && (
                    <Link href={`/${user.organizationSlug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary rounded-full font-medium">
                        <Building className="h-4 w-4 stroke-[1.5]" />
                        আপনার সাইট
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary hover:bg-primary/5 rounded-full font-medium">
                      <LayoutDashboard className="h-4 w-4 stroke-[1.5]" />
                      ড্যাশবোর্ড
                    </Button>
                  </Link>
                  <Link href="/dashboard/properties/new">
                    <Button size="sm" className="gap-2 rounded-full font-medium shadow-sm">
                      <PlusCircle className="h-4 w-4 stroke-[1.5]" />
                      প্রপার্টি যোগ করুন
                    </Button>
                  </Link>
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive rounded-full h-9 w-9 p-0 flex items-center justify-center"
                title="লগআউট করুন"
              >
                <LogOut className="h-4 w-4 stroke-[1.5]" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="font-medium hover:text-primary rounded-full">

                <Link href="/login">লগইন
                </Link>
              </Button>
              <Button size="sm" className="shadow-sm rounded-full font-medium px-5">
                <Link href="/register-organization">
                  একাউন্ট তৈরি করুন
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
          aria-label="Toggle Navigation"
        >
          <ThemeToggle />

          {mobileOpen ? <X className="h-6 w-6 stroke-[1.5]" /> : <Menu className="h-6 w-6 stroke-[1.5]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border/50 bg-background/95 backdrop-blur-md px-4 pt-4 pb-8 space-y-6 animate-in slide-in-from-top-2 shadow-lg">
          <nav className="flex flex-col space-y-4 text-base font-medium text-foreground/90">
            <Link
              href="/explore"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
            >
              <Compass className="h-5 w-5 stroke-[1.5] text-muted-foreground" />
              প্রপার্টি খুঁজুন
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-primary transition-colors pl-7"
            >
              আমাদের সেবাসমূহ
            </Link>
            <Link
              href="/#agencies"
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-primary transition-colors pl-7"
            >
              পার্টনার এজেন্সিসমূহ
            </Link>
          </nav>

          <div className="pt-6 border-t border-border/50 flex flex-col gap-3">
            {user ? (
              <>
                <div className="text-sm text-muted-foreground font-light px-1 mb-2">
                  লগইন অবস্থায় আছেন: <span className="font-medium text-foreground">{user.name}</span>
                </div>
                {user.role === "SYSTEM_ADMIN" ? (
                  <Link href="/system-admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full justify-center text-destructive border-destructive/30 rounded-full h-11">
                      অ্যাডমিন প্যানেল
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full justify-center rounded-full h-11 font-medium shadow-sm">
                      ড্যাশবোর্ডে যান
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-destructive border-destructive/20 justify-center hover:bg-destructive/5 rounded-full h-11"
                >
                  লগআউট করুন
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-center rounded-full h-11 border-border/60">
                    লগইন করুন
                  </Button>
                </Link>
                <Link href="/register-organization" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full justify-center rounded-full h-11 shadow-sm font-medium">
                    একাউন্ট তৈরি করুন
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}