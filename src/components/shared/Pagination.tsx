"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      {currentPage > 1 ? (
        <Link href={createPageURL(currentPage - 1)}>
          <Button variant="outline" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      )}

      <div className="flex items-center space-x-1 px-2 text-sm font-medium text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>


      {currentPage < totalPages ? (
        <Link href={createPageURL(currentPage + 1)}>
          <Button variant="outline" size="sm" className="gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-1">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
