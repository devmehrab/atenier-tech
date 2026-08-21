import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      {/* Image & Badges Placeholder */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Skeleton className="h-full w-full rounded-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-full bg-background/60" />
          <Skeleton className="h-5 w-24 rounded-md bg-background/60" />
        </div>

        {/* Price on Image Bottom */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-7 w-32 rounded-lg bg-background/60" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        {/* Location Pin & Area */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
          <Skeleton className="h-3.5 w-40" />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-4/5" />

        {/* Description (2 lines) */}
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Specs Footer */}
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}
