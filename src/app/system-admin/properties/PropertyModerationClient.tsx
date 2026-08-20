"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Pagination } from "@/components/shared/Pagination";
import { useToast } from "@/components/ui/toast";
import { deletePropertyAdminAction } from "@/lib/actions/admin.actions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ExternalLink, Trash2, Search, Building } from "lucide-react";

interface PropertyModerationClientProps {
  properties: any[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
}

export function PropertyModerationClient({
  properties,
  totalPages,
  currentPage,
  searchQuery,
}: PropertyModerationClientProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [search, setSearch] = useState(searchQuery);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/system-admin/properties?search=${encodeURIComponent(search)}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      const res = await deletePropertyAdminAction(deleteId);
      if (res.success) {
        success("Property listing removed by admin");
        setDeleteId(null);
        router.refresh();
      } else {
        error(res.message || "Failed to delete property");
      }
    } catch (err: any) {
      error(err.message || "Error deleting property");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search listings by title, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-neutral-200 bg-neutral-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Agency</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((prop) => {
              const imgUrl =
                prop.featuredImage ||
                prop.images?.[0]?.secureUrl ||
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80";

              return (
                <TableRow key={prop._id}>
                  <TableCell>
                    <div className="relative h-12 w-14 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                      <Image
                        src={imgUrl}
                        alt={prop.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-neutral-900 line-clamp-1">
                        {prop.title}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {prop.location?.area}, {prop.location?.city}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-emerald-800">
                      <Building className="h-3.5 w-3.5 shrink-0" />
                      <span>{prop.organizationName}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      /{prop.organizationSlug}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm font-extrabold text-neutral-900">
                    {formatPrice(prop.price, prop.currency, prop.pricePeriod)}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={prop.status} />
                  </TableCell>

                  <TableCell className="text-xs text-neutral-500">
                    {formatDate(prop.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {prop.status === "PUBLISHED" && prop.organizationSlug && (
                        <Link
                          href={`/${prop.organizationSlug}/properties/${prop.slug}`}
                          target="_blank"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Public Page"
                            className="h-8 w-8 text-neutral-600 hover:text-emerald-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(prop._id)}
                        className="h-8 w-8 text-rose-600 hover:bg-rose-50"
                        title="Delete Property as Admin"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} />

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Admin Delete Property Listing?"
        description="Are you sure you want to remove this property listing from the platform? This action cannot be undone."
        confirmText="Remove Property"
        variant="destructive"
        isLoading={deleteLoading}
        onConfirm={handleDelete}
      />
    </>
  );
}
