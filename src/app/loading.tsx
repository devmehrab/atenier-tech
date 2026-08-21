import { Skeleton } from "@/components/ui/skeleton";
import { PropertyGridSkeleton } from "@/components/skeletons/PropertyGridSkeleton";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden bg-background py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8 flex flex-col items-center">
          {/* Badge */}
          <Skeleton className="h-9 w-60 rounded-full" />

          {/* Heading */}
          <div className="space-y-4 max-w-4xl w-full flex flex-col items-center">
            <Skeleton className="h-12 sm:h-16 w-4/5" />
            <Skeleton className="h-12 sm:h-16 w-3/5" />
          </div>

          {/* Subtitle */}
          <div className="space-y-2 max-w-2xl w-full flex flex-col items-center pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Skeleton className="h-14 w-56 rounded-full" />
            <Skeleton className="h-14 w-56 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Real Estate Agencies Section */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3 flex flex-col items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-3.5 w-28" />
                  </div>
                </div>
                <div className="space-y-1.5 pt-2">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-64" />
            </div>
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>

          <PropertyGridSkeleton count={6} />
        </div>
      </section>
    </div>
  );
}
