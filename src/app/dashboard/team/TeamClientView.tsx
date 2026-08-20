"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IUser, UserRole } from "@/lib/types";
import { formatDate } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import {
  inviteTeamMemberAction,
  updateTeamMemberRoleAction,
  removeTeamMemberAction,
} from "@/lib/actions/team.actions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { UserPlus, UserCheck, ShieldCheck, Trash2, Mail, Phone } from "lucide-react";

interface TeamClientViewProps {
  initialMembers: IUser[];
  currentUserId: string;
}

export function TeamClientView({
  initialMembers,
  currentUserId,
}: TeamClientViewProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [removeUserId, setRemoveUserId] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const [inviteData, setInviteData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "AGENT" as UserRole,
    initialPassword: "",
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);

    try {
      const res = await inviteTeamMemberAction({
        name: inviteData.name,
        email: inviteData.email,
        phone: inviteData.phone,
        role: inviteData.role as any,
        initialPassword: inviteData.initialPassword,
      });

      if (res.success) {
        success(res.message || "Agent invited");
        setInviteModalOpen(false);
        setInviteData({
          name: "",
          email: "",
          phone: "",
          role: "AGENT",
          initialPassword: "",
        });
        router.refresh();
      } else {
        error(res.message || "Failed to invite agent");
      }
    } catch (err: any) {
      error(err.message || "Error inviting member");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const res = await updateTeamMemberRoleAction({
        userId,
        role: newRole as any,
      });

      if (res.success) {
        success("Member role updated");
        router.refresh();
      } else {
        error(res.message || "Failed to update role");
      }
    } catch (err: any) {
      error(err.message || "Error updating role");
    }
  };

  const handleRemove = async () => {
    if (!removeUserId) return;
    setRemoveLoading(true);

    try {
      const res = await removeTeamMemberAction(removeUserId);
      if (res.success) {
        success("Team member removed");
        setRemoveUserId(null);
        router.refresh();
      } else {
        error(res.message || "Failed to remove member");
      }
    } catch (err: any) {
      error(err.message || "Error removing member");
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setInviteModalOpen(true)} className="gap-1.5 shadow-sm">
          <UserPlus className="h-4 w-4" />
          Add Agent / Staff Member
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member Name & Email</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialMembers.map((member) => {
              const isSelf = member._id === currentUserId;

              return (
                <TableRow key={member._id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-card-foreground truncate">
                          {member.name} {isSelf && "(You)"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {member.phone || "—"}
                  </TableCell>

                  <TableCell>
                    {isSelf ? (
                      <Badge variant="default">{member.role}</Badge>
                    ) : (
                      <Select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member._id, e.target.value as UserRole)
                        }
                        className="h-8 text-xs w-28 sm:w-32 bg-background border-input"
                      >
                        <option value="AGENT">AGENT</option>
                        <option value="OWNER">OWNER</option>
                      </Select>
                    )}
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {formatDate(member.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    {!isSelf && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setRemoveUserId(member._id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Remove Member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <form onSubmit={handleInvite} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Team Member / Agent</DialogTitle>
            <DialogDescription>
              Create login credentials for an agent to manage listings under your agency.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Full Name *
              </label>
              <Input
                required
                placeholder="Agent Full Name"
                value={inviteData.name}
                onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                required
                placeholder="agent@agency.com"
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-1">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={inviteData.phone}
                onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-card-foreground mb-1">
                  Role
                </label>
                <Select
                  value={inviteData.role}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, role: e.target.value as UserRole })
                  }
                >
                  <option value="AGENT">AGENT (Manage Listings)</option>
                  <option value="OWNER">OWNER (Full Admin)</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-card-foreground mb-1">
                  Initial Password *
                </label>
                <Input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={inviteData.initialPassword}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, initialPassword: e.target.value })
                  }
                />
              </div>
            </div>
          </div>


          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={inviteLoading} className="gap-1.5">
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Remove Confirmation */}
      <ConfirmDialog
        open={Boolean(removeUserId)}
        onOpenChange={(open) => !open && setRemoveUserId(null)}
        title="Remove Team Member?"
        description="Are you sure you want to remove this member from your organization? They will no longer be able to log into this workspace."
        confirmText="Remove Member"
        variant="destructive"
        isLoading={removeLoading}
        onConfirm={handleRemove}
      />
    </>
  );
}
