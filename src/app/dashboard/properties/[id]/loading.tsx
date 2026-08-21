import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPropertyViewLoading() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm space-y-6">
        {/* Image Stage */}
        <div className="relative aspect-[21/9] w-full bg-muted">
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        {/* Info */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-4/5" />
              <Skeleton className="h-4 w-60" />
            </div>
            <div className="space-y-1 sm:text-right">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-36" />
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/40 border border-border/50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
