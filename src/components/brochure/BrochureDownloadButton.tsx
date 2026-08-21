"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IProperty, IOrganization, IUser } from "@/lib/types";
import { generateBrochureHtml } from "./generateBrochureHtml";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Printer,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface BrochureDownloadButtonProps {
  property: IProperty;
  organization?: Partial<IOrganization> | null;
  agent?: Partial<IUser> | null;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
  showIcon?: boolean;
}

export function BrochureDownloadButton({
  property,
  organization,
  agent,
  variant = "outline",
  size = "default",
  className,
  label = "Download Brochure",
  showIcon = true,
}: BrochureDownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const getHtml = () => {
    return generateBrochureHtml({
      property,
      organization,
      agent,
      publicUrl: typeof window !== "undefined" ? window.location.href : "",
    });
  };

  const handleDirectPrintOrSave = () => {
    setIsGenerating(true);

    try {
      const html = getHtml();

      // Create or reuse hidden iframe
      let iframe = iframeRef.current;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.style.visibility = "hidden";
        document.body.appendChild(iframe);
        iframeRef.current = iframe;
      }

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        // Allow images & fonts to load before triggering print
        setTimeout(() => {
          setIsGenerating(false);
          iframe?.contentWindow?.focus();
          iframe?.contentWindow?.print();
        }, 500);
      } else {
        setIsGenerating(false);
      }
    } catch (err) {
      console.error("Failed to generate brochure:", err);
      setIsGenerating(false);
    }
  };

  const handleOpenPreview = () => {
    setIsOpen(true);
  };

  const modalContent = isOpen && mounted ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative z-10 flex flex-col h-[92vh] max-h-[950px] w-full max-w-4xl overflow-hidden rounded-2xl bg-card border border-border/80 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1">
                Property Brochure Preview
              </h3>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Ready to save as PDF or print
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleDirectPrintOrSave}
              disabled={isGenerating}
              className="gap-1.5 shadow-sm font-medium"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Printer className="h-4 w-4" />
              )}
              <span>Print / Save PDF</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Modal Body / Iframe Preview */}
        <div className="flex-1 overflow-y-auto bg-neutral-100 p-2 sm:p-6 dark:bg-neutral-900/50">
          <div className="mx-auto max-w-[800px] overflow-hidden rounded-xl bg-white shadow-xl border border-neutral-200">
            <iframe
              title="Brochure Preview"
              srcDoc={getHtml()}
              className="w-full min-h-[900px] border-0"
              style={{ height: "1050px" }}
            />
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="border-t border-border/60 bg-card px-4 py-2.5 sm:px-6 flex items-center justify-between text-xs text-muted-foreground font-sans">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>Executive A4 Format with High-Resolution Imagery</span>
          </div>
          <div className="hidden sm:block">
            Choose <strong className="text-foreground">&quot;Save as PDF&quot;</strong> in your print dialog destination
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenPreview}
        className={cn("gap-2 shadow-sm font-semibold transition-all", className)}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : showIcon ? (
          <FileText className="h-4 w-4 text-primary shrink-0" />
        ) : null}
        <span>{label}</span>
      </Button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
