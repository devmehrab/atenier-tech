"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ISessionUser } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import {
  ShieldAlert,
  Building,
  Users,
  Home,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";

interface AdminSidebarProps {
  user: ISessionUser;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Platform Overview",
      href: "/system-admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Agencies & Orgs",
      href: "/system-admin/organizations",
      icon: Building,
      exact: false,
    },
    {
      name: "All Users",
      href: "/system-admin/users",
      icon: Users,
      exact: false,
    },
    {
      name: "Property Moderation",
      href: "/system-admin/properties",
      icon: Home,
      exact: false,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 bg-neutral-900 text-neutral-200 min-h-screen flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white font-bold shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white">
                SYSTEM ADMIN
              </span>
              <span className="block text-[10px] text-neutral-400 font-mono">
                Platform Console
              </span>
            </div>
          </div>
        </div>

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
                    ? "bg-rose-600/20 text-rose-400 font-semibold border border-rose-500/30"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-rose-400" : "text-neutral-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-neutral-800 space-y-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agency Dashboard
        </Link>

        <div className="px-3 py-1">
          <div className="text-xs font-bold text-white truncate">{user.name}</div>
          <div className="text-[11px] text-neutral-400 truncate">{user.email}</div>
        </div>
      </div>
    </aside>
  );
}
