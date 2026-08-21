import { Skeleton } from "@/components/ui/skeleton";

export function TenantHeroSkeleton() {
  return (
    <div className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-background text-foreground">
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8 space-y-6 w-full">
        {/* Badge */}
        <div className="flex justify-center">
          <Skeleton className="h-7 w-48 rounded-full" />
        </div>

        {/* Headline */}
        <div className="space-y-3 max-w-3xl mx-auto flex flex-col items-center">
          <Skeleton className="h-10 sm:h-14 w-4/5" />
          <Skeleton className="h-10 sm:h-14 w-3/5" />
        </div>

        {/* Subtitle */}
        <div className="space-y-2 max-w-2xl mx-auto flex flex-col items-center pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Search Box */}
        <div className="mt-10 mx-auto max-w-3xl rounded-2xl bg-card/95 p-3 sm:p-4 shadow-2xl border border-border/60 text-left space-y-3">
          {/* Tabs */}
          <div className="flex items-center gap-2 pb-2.5 border-b border-border/50">
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-7 w-16 rounded-lg" />
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3">
            <div className="sm:col-span-6">
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="sm:col-span-3">
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="sm:col-span-3">
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
