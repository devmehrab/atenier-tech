import { Skeleton } from "@/components/ui/skeleton";
import { StatsRowSkeleton } from "@/components/skeletons/StatsCardSkeleton";

export default function SystemAdminOverviewLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-8 sm:h-9 w-80" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            </div>

            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/60">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-3"
          >
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
