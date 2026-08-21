import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  hasThumbnails?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  hasThumbnails = true,
}: TableSkeletonProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {hasThumbnails && <TableHead className="w-[80px]">Image</TableHead>}
            <TableHead>Listing Details</TableHead>
            <TableHead className="hidden sm:table-cell">Type & Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r}>
              {hasThumbnails && (
                <TableCell>
                  <div className="relative h-12 w-14 sm:h-14 sm:w-16 overflow-hidden rounded-lg bg-muted border border-border/60">
                    <Skeleton className="h-full w-full rounded-none" />
                  </div>
                </TableCell>
              )}
              <TableCell>
                <div className="flex flex-col space-y-1.5">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="flex flex-col space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1.5 items-start">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-3.5 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function GenericTableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center justify-between gap-4 py-2 border-b border-border/40 last:border-0">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-full hidden sm:block" />
            <Skeleton className="h-4 w-24 hidden md:block" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
