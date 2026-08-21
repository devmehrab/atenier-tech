"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IOrganization, OrganizationStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Pagination } from "@/components/shared/Pagination";
import { useToast } from "@/components/ui/toast";
import {
  toggleOrgStatusAction,
  deleteOrgAction,
} from "@/lib/actions/admin.actions";
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
  Trash2,
  Search,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface OrgManagementClientProps {
  organizations: IOrganization[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
}

export function OrgManagementClient({
  organizations,
  totalPages,
  currentPage,
  searchQuery,
}: OrgManagementClientProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [search, setSearch] = useState(searchQuery);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/system-admin/organizations?search=${encodeURIComponent(search)}`);
  };

  const handleStatusToggle = async (orgId: string, currentStatus: OrganizationStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setActionLoadingId(orgId);

    try {
      const res = await toggleOrgStatusAction(orgId, newStatus);
      if (res.success) {
        success(res.message || `Organization ${newStatus.toLowerCase()}`);
        router.refresh();
      } else {
        error(res.message || "Failed to update status");
      }
    } catch (err: any) {
      error(err.message || "Error updating organization");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      const res = await deleteOrgAction(deleteId);
      if (res.success) {
        success("Organization and assets deleted");
        setDeleteId(null);
        router.refresh();
      } else {
        error(res.message || "Failed to delete organization");
      }
    } catch (err: any) {
      error(err.message || "Error deleting organization");
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
            placeholder="Search agencies by name, slug, city..."
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
              <TableHead>Agency Name</TableHead>
              <TableHead>Slug / Handle</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Admin Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => {
              const isWorking = actionLoadingId === org._id;

              return (
                <TableRow key={org._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs">
                        <Building className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-neutral-900 block">
                          {org.name}
                        </span>
                        <span className="text-xs text-neutral-500">{org.email || "No email"}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-mono text-neutral-600">
                    /{org.slug}
                  </TableCell>

                  <TableCell className="text-xs text-neutral-600">
                    {org.city}, {org.country}
                  </TableCell>

                  <TableCell>
                    <Badge variant={org.status === "ACTIVE" ? "default" : "destructive"}>
                      {org.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-neutral-500">
                    {formatDate(org.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/${org.slug}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Visit Public Website"
                          className="h-8 w-8 text-neutral-600 hover:text-emerald-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isWorking}
                        onClick={() => handleStatusToggle(org._id, org.status)}
                        className={`h-8 text-xs ${org.status === "ACTIVE"
                            ? "text-amber-700 border-amber-300 hover:bg-amber-50"
                            : "text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                          }`}
                      >
                        {org.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(org._id)}
                        className="h-8 w-8 text-rose-600 hover:bg-rose-50"
                        title="Delete Agency"
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
        title="Delete Organization & All Data?"
        description="WARNING: This will permanently delete this real estate agency, all its properties, Cloudinary images, and staff accounts. This action is irreversible."
        confirmText="Delete Organization"
        variant="destructive"
        isLoading={deleteLoading}
        onConfirm={handleDelete}
      />
    </>
  );
}
