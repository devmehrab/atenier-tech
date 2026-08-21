import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export default function DashboardSettingsLoading() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1.5">
        <Skeleton className="h-8 sm:h-9 w-52" />
        <Skeleton className="h-4 w-80" />
      </div>

      <FormSkeleton fields={4} hasImageUpload={false} />
    </div>
  );
}
