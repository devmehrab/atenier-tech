import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardSkeletonProps {
  count?: number;
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      </div>

      <div className="space-y-1.5 pt-1">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

export function StatsRowSkeleton({ count = 5 }: StatsCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}
