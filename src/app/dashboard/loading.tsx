import { Skeleton } from "@/components/ui/skeleton";
import { StatsRowSkeleton } from "@/components/skeletons/StatsCardSkeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 sm:h-9 w-64" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Metrics Row */}
      <StatsRowSkeleton count={5} />

      {/* Recent Properties Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-3.5 w-64" />
          </div>
          <Skeleton className="h-8 w-36" />
        </div>

        <TableSkeleton rows={5} />
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/60">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-3"
          >
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-40" />
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
