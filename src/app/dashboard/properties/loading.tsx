import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";

export default function DashboardPropertiesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 sm:h-9 w-52" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-lg" />
          ))}
        </div>

        {/* Search Bar */}
        <Skeleton className="h-9 w-full sm:max-w-xs rounded-lg" />
      </div>

      {/* Table */}
      <TableSkeleton rows={10} />

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  );
}
