import React from "react";
import { cn } from "@/lib/utils/cn";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color?: "emerald" | "amber" | "blue" | "purple" | "rose";
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "emerald",
}: StatsCardProps) {
  const colorMap = {
    emerald: "bg-primary/10 text-primary border-primary/20",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    blue: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    rose: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border shrink-0",
            colorMap[color]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-card-foreground">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-primary">{trend}</span>
        )}
      </div>

      {description && (
        <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

