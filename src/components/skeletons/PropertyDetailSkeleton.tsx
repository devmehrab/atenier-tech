import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";

export function PropertyDetailSkeleton() {
  return (
    <div className="bg-background text-foreground pb-20">
      {/* Breadcrumb Header Skeleton */}
      <div className="border-b border-border/60 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Title & Price Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl flex-1">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-md" />
              <Skeleton className="h-6 w-32 rounded-md" />
            </div>

            {/* Title */}
            <Skeleton className="h-9 sm:h-10 w-4/5" />

            {/* Location */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full shrink-0" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>

          {/* Price Block */}
          <div className="flex flex-col lg:items-end space-y-1">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>

        {/* Gallery Skeleton */}
        <div className="space-y-3">
          {/* Main Hero Image */}
          <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
            <Skeleton className="h-full w-full rounded-none" />
          </div>

          {/* Thumbnail Bar */}
          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="relative aspect-[16/10] h-16 sm:h-20 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/50"
              >
                <Skeleton className="h-full w-full rounded-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Specs Grid */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <Skeleton className="h-5 w-48 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Card */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-4">
              <Skeleton className="h-5 w-44" />
              <div className="space-y-2.5 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Amenities Card */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-4">
              <Skeleton className="h-5 w-52" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl bg-muted/50 px-3.5 py-2.5 border border-border/50"
                  >
                    <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                    <Skeleton className="h-3.5 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA & Agent Details Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Inquiry Card Skeleton */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3.5 w-56" />
              </div>

              <div className="space-y-3 pt-2">
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>

              <div className="pt-3 border-t border-border/50">
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>

            {/* Agent Card Skeleton */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-9 w-full rounded-xl" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties Section */}
        <div className="pt-12 border-t border-border/60 space-y-6">
          <Skeleton className="h-7 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
