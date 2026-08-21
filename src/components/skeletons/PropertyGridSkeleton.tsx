import { PropertyCardSkeleton } from "./PropertyCardSkeleton";

interface PropertyGridSkeletonProps {
  count?: number;
  className?: string;
}

export function PropertyGridSkeleton({
  count = 6,
  className = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
}: PropertyGridSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}
