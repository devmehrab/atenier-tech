import { Skeleton } from "@/components/ui/skeleton";

export function FilterBarSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm mb-8 space-y-4">
      {/* Top row: search + action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
      </div>

      {/* Facets row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-border/50">
        <div>
          <Skeleton className="h-3 w-16 mb-1.5" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
        <div>
          <Skeleton className="h-3 w-20 mb-1.5" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
        <div>
          <Skeleton className="h-3 w-16 mb-1.5" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
        <div>
          <Skeleton className="h-3 w-20 mb-1.5" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
        <div>
          <Skeleton className="h-3 w-14 mb-1.5" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
