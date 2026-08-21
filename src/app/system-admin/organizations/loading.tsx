import { Skeleton } from "@/components/ui/skeleton";
import { GenericTableSkeleton } from "@/components/skeletons/TableSkeleton";

export default function SystemAdminOrganizationsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Skeleton className="h-8 sm:h-9 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <GenericTableSkeleton rows={8} />
    </div>
  );
}
