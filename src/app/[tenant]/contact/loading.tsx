import { Skeleton } from "@/components/ui/skeleton";

export default function TenantContactLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 flex flex-col items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 sm:h-12 w-80" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left: Office Info */}
        <div className="space-y-6">
          <Skeleton className="h-7 w-40 pb-4 border-b border-border/50" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Agent / Card */}
        <div className="space-y-6">
          <Skeleton className="h-7 w-48 pb-4 border-b border-border/50" />
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
