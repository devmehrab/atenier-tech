"use client";

import React, { useState } from "react";
import { IProperty, IOrganization } from "@/lib/types";
import { generateFacebookCaption } from "@/lib/utils/facebookCaption";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Copy,
  Check,
  Share2,
  FileText,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CopyFacebookCaptionButtonProps {
  property: IProperty;
  organization?: Partial<IOrganization> | null;
  publicUrl?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function CopyFacebookCaptionButton({
  property,
  organization,
  publicUrl,
  variant = "outline",
  size = "sm",
  className,
}: CopyFacebookCaptionButtonProps) {
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const { success, error } = useToast();

  const handleCopyDirect = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const caption = generateFacebookCaption(property, organization, publicUrl);
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      success("Facebook caption copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard copy error:", err);
      error("Failed to copy to clipboard");
    }
  };

  const handleOpenPreview = () => {
    const caption = generateFacebookCaption(property, organization, publicUrl);
    setCustomText(caption);
    setPreviewOpen(true);
  };

  const handleCopyFromPreview = async () => {
    try {
      await navigator.clipboard.writeText(customText);
      setCopied(true);
      success("Facebook caption copied!");
      setPreviewOpen(false);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      error("Failed to copy caption");
    }
  };

  return (
    <>
      <div className="inline-flex items-center rounded-lg border border-border/70 bg-card shadow-sm">
        <Button
          type="button"
          variant={variant}
          size={size}
          onClick={handleCopyDirect}
          className={cn(
            "gap-1.5 font-medium border-0 rounded-r-none transition-colors",
            copied ? "text-primary bg-primary/5" : "text-card-foreground hover:bg-muted",
            className
          )}
          title="Copy ready-to-post Facebook caption"
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary animate-in zoom-in-75 duration-200" />
          ) : (
            <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          )}
          <span>{copied ? "Copied!" : "Facebook Caption"}</span>
        </Button>

        <div className="h-4 w-[1px] bg-border/60" />

        <Button
          type="button"
          variant={variant}
          size={size}
          onClick={handleOpenPreview}
          className="px-2 border-0 rounded-l-none text-muted-foreground hover:text-foreground hover:bg-muted"
          title="Preview and edit caption"
        >
          <FileText className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Caption Preview & Edit Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle>Facebook Post Caption</DialogTitle>
              <DialogDescription>
                Ready-to-post caption generated directly from verified listing data
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 font-sans">
          <Textarea
            rows={14}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="text-xs sm:text-sm font-mono overflow-y-auto bg-muted/30"
            placeholder="Generating caption..."
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Includes verified property specs & pricing details
            </span>
            <span>{customText.length} characters</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCopyFromPreview}
            className="gap-2 shadow-sm font-medium"
          >
            <Copy className="h-4 w-4" />
            Copy Caption
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
