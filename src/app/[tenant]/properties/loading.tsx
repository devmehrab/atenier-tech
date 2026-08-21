import { Skeleton } from "@/components/ui/skeleton";
import { FilterBarSkeleton } from "@/components/skeletons/FilterBarSkeleton";
import { PropertyGridSkeleton } from "@/components/skeletons/PropertyGridSkeleton";

export default function TenantPropertiesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-60" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Filter Bar */}
      <FilterBarSkeleton />

      {/* Grid */}
      <PropertyGridSkeleton count={12} />

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-6">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  );
}
