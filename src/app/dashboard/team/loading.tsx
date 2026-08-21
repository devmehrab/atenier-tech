import { Skeleton } from "@/components/ui/skeleton";
import { GenericTableSkeleton } from "@/components/skeletons/TableSkeleton";

export default function DashboardTeamLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 sm:h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      <GenericTableSkeleton rows={5} />
    </div>
  );
}
