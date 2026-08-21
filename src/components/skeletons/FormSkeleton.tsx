import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton({
  fields = 6,
  hasImageUpload = true,
}: {
  fields?: number;
  hasImageUpload?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
      {/* Form Header */}
      <div className="space-y-2 pb-4 border-b border-border/50">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Image Upload Area */}
      {hasImageUpload && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="rounded-2xl border-2 border-dashed border-border/70 p-8 flex flex-col items-center justify-center space-y-3">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      )}

      {/* Field Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Long Textarea */}
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
    </div>
  );
}
