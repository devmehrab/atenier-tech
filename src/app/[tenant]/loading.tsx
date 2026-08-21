import { Skeleton } from "@/components/ui/skeleton";
import { TenantHeroSkeleton } from "@/components/skeletons/TenantHeroSkeleton";
import { PropertyGridSkeleton } from "@/components/skeletons/PropertyGridSkeleton";

export default function TenantHomeLoading() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <TenantHeroSkeleton />

      {/* Featured Properties Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-8 w-60" />
          </div>
          <Skeleton className="h-4 w-36" />
        </div>

        <PropertyGridSkeleton count={3} />
      </section>

      {/* Property Categories Quick Browse */}
      <section className="bg-muted/30 py-16 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2 flex flex-col items-center">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-8 w-64" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4"
              >
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>

        <PropertyGridSkeleton count={6} />
      </section>

      {/* Agency Bio Card */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <Skeleton className="h-6 w-44 rounded-full" />
              <Skeleton className="h-9 w-72" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="pt-2 flex flex-wrap gap-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-6 space-y-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3.5 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
