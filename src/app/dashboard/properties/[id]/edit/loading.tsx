import { FormSkeleton } from "@/components/skeletons/FormSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPropertyLoading() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="space-y-1.5">
        <Skeleton className="h-8 sm:h-9 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <FormSkeleton fields={8} hasImageUpload={true} />
    </div>
  );
}
