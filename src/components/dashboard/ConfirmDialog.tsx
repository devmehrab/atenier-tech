"use client";

import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive sm:mx-0 mb-2">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => onOpenChange(false)}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          variant={variant}
          isLoading={isLoading}
          onClick={async () => {
            await onConfirm();
          }}
        >
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
