"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IProperty, PropertyStatus } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  deletePropertyAction,
  updatePropertyStatusAction,
  duplicatePropertyAction,
} from "@/lib/actions/property.actions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  ExternalLink,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  DollarSign,
  MoreVertical,
  Eye,
  Plus,
} from "lucide-react";

interface PropertyTableProps {
  properties: IProperty[];
  tenantSlug?: string | null;
}

export function PropertyTable({ properties, tenantSlug }: PropertyTableProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deletePropertyAction(deleteId);
      if (res.success) {
        success(res.message || "Property deleted");
        setDeleteId(null);
        router.refresh();
      } else {
        error(res.message || "Failed to delete");
      }
    } catch (err: any) {
      error(err.message || "Error deleting property");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: PropertyStatus) => {
    setActionLoadingId(id);
    try {
      const res = await updatePropertyStatusAction(id, newStatus);
      if (res.success) {
        success(res.message || "Status updated");
        router.refresh();
      } else {
        error(res.message || "Failed to update status");
      }
    } catch (err: any) {
      error(err.message || "Error changing status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await duplicatePropertyAction(id);
      if (res.success) {
        success("Property duplicated as a draft!");
        router.refresh();
      } else {
        error(res.message || "Failed to duplicate");
      }
    } catch (err: any) {
      error(err.message || "Error duplicating property");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (properties.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 sm:p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <Plus className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-card-foreground">No properties in this view</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          Get started by adding your first real estate listing with high-resolution photos and details.
        </p>
        <div className="mt-6">
          <Link href="/dashboard/properties/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Create First Listing
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Listing Details</TableHead>
              <TableHead className="hidden sm:table-cell">Type & Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => {
              const imageUrl =
                property.featuredImage ||
                property.images?.[0]?.secureUrl ||
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80";

              const publicUrl = tenantSlug
                ? `/${tenantSlug}/properties/${property.slug}`
                : `/explore`;

              const isWorking = actionLoadingId === property._id;

              return (
                <TableRow key={property._id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="relative h-12 w-14 sm:h-14 sm:w-16 overflow-hidden rounded-lg bg-muted border border-border/60">
                      <Image
                        src={imageUrl}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <Link
                        href={`/dashboard/properties/${property._id}`}
                        className="font-bold text-card-foreground hover:text-primary text-sm line-clamp-1 transition-colors"
                      >
                        {property.title}
                      </Link>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {property.location.area}, {property.location.city}
                      </span>
                      {/* Show price on mobile under title */}
                      <span className="sm:hidden text-xs font-extrabold text-foreground mt-0.5">
                        {formatPrice(property.price, property.currency, property.pricePeriod)}
                      </span>
                      <span className="hidden sm:inline text-[11px] font-mono text-muted-foreground mt-0.5">
                        /{property.slug}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-card-foreground">
                        {formatPrice(property.price, property.currency, property.pricePeriod)}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {property.propertyType} • {property.listingType}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      <StatusBadge status={property.status} />
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        <span>{property.viewsCount || 0} views</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {formatDate(property.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View on Public Website */}
                      {property.status === "PUBLISHED" && (
                        <Link href={publicUrl} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View on Public Storefront"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}

                      {/* Edit */}
                      <Link href={`/dashboard/properties/${property._id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit Listing"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>

                      {/* Duplicate */}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Duplicate as Draft"
                        disabled={isWorking}
                        onClick={() => handleDuplicate(property._id)}
                        className="hidden sm:inline-flex h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      {/* Status quick switch: Publish / Unpublish / Sold */}
                      {property.status === "DRAFT" || property.status === "UNPUBLISHED" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Publish Listing"
                          disabled={isWorking}
                          onClick={() => handleStatusChange(property._id, "PUBLISHED")}
                          className="h-8 w-8 text-primary hover:bg-primary/10"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      ) : property.status === "PUBLISHED" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Mark as Sold"
                          disabled={isWorking}
                          onClick={() => handleStatusChange(property._id, "SOLD")}
                          className="h-8 w-8 text-amber-600 hover:bg-amber-500/10"
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      ) : null}

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete Permanently"
                        onClick={() => setDeleteId(property._id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Property Listing?"
        description="Are you sure you want to permanently delete this property listing? This action cannot be undone and will delete all associated photos."
        confirmText="Delete Property"
        variant="destructive"
        isLoading={deleteLoading}
        onConfirm={handleDelete}
      />
    </>
  );
}
