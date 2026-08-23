"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ISessionUser } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  Sparkles,
  Users,
  Building,
  Settings,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

interface DashboardSidebarProps {
  user: ISessionUser;
}

export const getDashboardNavigation = (isOwnerOrAdmin: boolean) => [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Properties",
    href: "/dashboard/properties",
    icon: Home,
    exact: true,
  },
  {
    name: "Add Property",
    href: "/dashboard/properties/new",
    icon: PlusCircle,
    exact: true,
  },
  {
    name: "Import Properties",
    href: "/dashboard/properties/import",
    icon: Sparkles,
    exact: true,
  },
  {
    name: "Inquiries & Leads",
    href: "/dashboard/leads",
    icon: MessageSquare,
    exact: true,
  },
  ...(isOwnerOrAdmin
    ? [
      {
        name: "Team & Agents",
        href: "/dashboard/team",
        icon: Users,
        exact: true,
      },
      {
        name: "Agency Branding",
        href: "/dashboard/profile",
        icon: Building,
        exact: true,
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        exact: true,
      },
    ]
    : []),
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const isOwnerOrAdmin = user.role === "OWNER" || user.role === "SYSTEM_ADMIN";
  const navigation = getDashboardNavigation(isOwnerOrAdmin);

  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-64 shrink-0 flex-col justify-between border-r border-border/60 bg-card p-4 overflow-y-auto z-20">
      <div className="space-y-6">
        {/* Organization Header */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm shrink-0">
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

          {/* Public Website Link Button */}
          {user.organizationSlug && (
            <Link
              href={`/${user.organizationSlug}`}
              target="_blank"
              className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-card-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Navigation */}
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

      {/* Footer Info */}
      <div className="pt-4 border-t border-border/50 space-y-3">
        {user.role === "SYSTEM_ADMIN" && (
          <Link
            href="/system-admin"
            className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors border border-destructive/20"
          >
            <ShieldAlert className="h-4 w-4" />
            System Administration
          </Link>
        )}

        <div className="px-3 py-1 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-xs font-bold text-card-foreground truncate">{user.name}</div>
            <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
            <div className="mt-1">
              <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-extrabold uppercase text-muted-foreground">
                {user.role}
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

