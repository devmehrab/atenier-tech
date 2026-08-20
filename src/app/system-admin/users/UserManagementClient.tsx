"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IUser, UserRole, UserStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/shared/Pagination";
import { useToast } from "@/components/ui/toast";
import {
  toggleUserStatusAction,
  updateUserRoleAdminAction,
} from "@/lib/actions/admin.actions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Search, UserCheck, ShieldAlert, UserX } from "lucide-react";

interface UserManagementClientProps {
  users: IUser[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
}

export function UserManagementClient({
  users,
  totalPages,
  currentPage,
  searchQuery,
}: UserManagementClientProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [search, setSearch] = useState(searchQuery);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/system-admin/users?search=${encodeURIComponent(search)}`);
  };

  const handleStatusToggle = async (userId: string, currentStatus: UserStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    setLoadingId(userId);

    try {
      const res = await toggleUserStatusAction(userId, newStatus);
      if (res.success) {
        success(`User status changed to ${newStatus.toLowerCase()}`);
        router.refresh();
      } else {
        error(res.message || "Failed to update status");
      }
    } catch (err: any) {
      error(err.message || "Error updating user");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const res = await updateUserRoleAdminAction(userId, newRole);
      if (res.success) {
        success(`User role updated to ${newRole}`);
        router.refresh();
      } else {
        error(res.message || "Failed to update role");
      }
    } catch (err: any) {
      error(err.message || "Error updating role");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search users by name, email..."
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
              <TableHead>User</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const isWorking = loadingId === u._id;

              return (
                <TableRow key={u._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 font-bold text-xs">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-neutral-900 block">{u.name}</span>
                        <span className="text-xs text-neutral-500">{u.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-neutral-700">
                    {(u as any).organizationName ? (
                      <span className="font-medium">{(u as any).organizationName}</span>
                    ) : (
                      <span className="text-neutral-400 font-mono">Platform Global</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u._id, e.target.value as UserRole)
                      }
                      className="h-8 text-xs w-36"
                    >
                      <option value="AGENT">AGENT</option>
                      <option value="OWNER">OWNER</option>
                      <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Badge variant={u.status === "ACTIVE" ? "default" : "destructive"}>
                      {u.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-neutral-500">
                    {formatDate(u.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isWorking}
                      onClick={() => handleStatusToggle(u._id, u.status)}
                      className={`h-8 text-xs ${
                        u.status === "ACTIVE"
                          ? "text-rose-700 border-rose-200 hover:bg-rose-50"
                          : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      {u.status === "ACTIVE" ? "Disable" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}
