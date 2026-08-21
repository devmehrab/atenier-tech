"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ISessionUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth.actions";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import { getDashboardNavigation } from "./DashboardSidebar";
import {
  LogOut,
  Plus,
  ExternalLink,
  Building,
  Menu,
  X,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface DashboardHeaderProps {
  user: ISessionUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { success } = useToast();

  const isOwnerOrAdmin = user.role === "OWNER" || user.role === "SYSTEM_ADMIN";
  const navigation = getDashboardNavigation(isOwnerOrAdmin);

  const handleLogout = async () => {
    await logoutAction();
    success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Open Mobile Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="truncate max-w-[140px] sm:max-w-none">
              {user.organizationName || "Agency Workspace"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user.organizationSlug && (
            <Link href={`/${user.organizationSlug}`} target="_blank">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-1.5 text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3.5 w-3.5" />
                Live Site
              </Button>
            </Link>
          )}

          <Link href="/dashboard/properties/new">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">New Listing</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Mobile Drawer Overlay & Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col justify-between bg-card p-5 shadow-2xl border-r border-border/60 animate-in slide-in-from-left duration-300 overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Top / Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
                    <Building className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-extrabold text-card-foreground truncate">
                      {user.organizationName || "Agency Workspace"}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground truncate">
                      /{user.organizationSlug || "agency"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close Mobile Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Public Website Link Button */}
              {user.organizationSlug && (
                <Link
                  href={`/${user.organizationSlug}`}
                  target="_blank"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-card-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  <span>View Public Website</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer Info & Logout */}
            <div className="pt-5 border-t border-border/50 space-y-3 mt-6">
              {user.role === "SYSTEM_ADMIN" && (
                <Link
                  href="/system-admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors border border-destructive/20"
                >
                  <ShieldAlert className="h-4 w-4" />
                  System Administration
                </Link>
              )}

              <div className="px-2 py-1 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-card-foreground truncate">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                </div>
                <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-extrabold uppercase text-muted-foreground shrink-0">
                  {user.role}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 justify-center gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

