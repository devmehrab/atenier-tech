"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IProperty, IOrganization, IUser } from "@/lib/types";
import { generateBrochureHtml } from "./generateBrochureHtml";
import { downloadBrochurePdf } from "./generateBrochurePdf";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  FileText,
  Download,
  Printer,
  Loader2,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Sparkles,
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800);
  const [zoomLevel, setZoomLevel] = useState<number | null>(null); // null = auto-fit
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update container width for responsive scaling
  useEffect(() => {
    if (!isOpen) return;

    const updateDimensions = () => {
      if (previewContainerRef.current) {
        setContainerWidth(previewContainerRef.current.clientWidth);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setZoomLevel(null);
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

  // Base A4 dimensions in px (210mm x 297mm at 96 DPI)
  const A4_WIDTH = 794;
  const A4_HEIGHT = 1123;

  // Compute responsive fit scale
  const autoScale = Math.min(1, Math.max(0.32, (containerWidth - 32) / A4_WIDTH));
  const activeScale = zoomLevel !== null ? zoomLevel : autoScale;

  const handleDownloadPdf = async () => {
    setIsDownloading(true);

    try {
      await downloadBrochurePdf({
        property,
        organization,
        agent,
        publicUrl: typeof window !== "undefined" ? window.location.href : "",
      });

      success("ব্রোশিওর PDF সফলভাবে ডাউনলোড হয়েছে!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toastError("PDF ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => {
      const current = prev !== null ? prev : autoScale;
      return Math.min(1.2, +(current + 0.15).toFixed(2));
    });
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const current = prev !== null ? prev : autoScale;
      return Math.max(0.35, +(current - 0.15).toFixed(2));
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(null);
  };

  const modalContent = isOpen && mounted ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative z-10 flex flex-col h-[94vh] max-h-[960px] w-full max-w-5xl overflow-hidden rounded-2xl bg-card border border-border/80 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/50 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1">
                Executive Property Brochure
              </h3>
              <p className="text-xs text-muted-foreground hidden sm:block">
                A4 Printable Layout • Powered by Atenier PDF Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom controls for mobile & desktop */}
            <div className="hidden sm:flex items-center rounded-lg border border-border/70 bg-card p-0.5 text-xs">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={activeScale <= 0.4}
                className="h-7 w-7 rounded-md"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-2 py-1 font-mono text-[11px] font-medium text-muted-foreground hover:text-foreground"
                title="Fit to window"
              >
                {Math.round(activeScale * 100)}%
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={activeScale >= 1.2}
                className="h-7 w-7 rounded-md"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Direct Print (Desktop) */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="hidden md:flex gap-1.5 shadow-sm font-medium h-9"
              title="Browser Print"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>

            {/* Primary Download PDF Button */}
            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="gap-2 shadow-md font-semibold h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{isDownloading ? "Generating PDF..." : "Download PDF"}</span>
            </Button>

            {/* Close */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Modal Body / Responsive Scaled A4 Preview */}
        <div
          ref={previewContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto bg-neutral-200/70 p-3 sm:p-6 dark:bg-neutral-950/80 flex flex-col items-center"
        >
          {/* Scaled A4 Document Container */}
          <div
            className="transition-transform duration-200 ease-out origin-top shadow-2xl rounded-xl bg-white border border-neutral-300 dark:border-neutral-800"
            style={{
              width: `${A4_WIDTH}px`,
              height: `${A4_HEIGHT}px`,
              transform: `scale(${activeScale})`,
              transformOrigin: "top center",
              marginBottom: `${Math.max(0, A4_HEIGHT * (activeScale - 1))}px`,
            }}
          >
            <iframe
              ref={iframeRef}
              title="Brochure Preview"
              srcDoc={getHtml()}
              className="w-full h-full border-0 rounded-xl"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#ffffff",
              }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-border/60 bg-card px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground font-sans">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>High-resolution A4 PDF ready to share with clients via WhatsApp or Email</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex sm:hidden items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="h-8 px-2 text-xs"
              >
                <ZoomOut className="h-3 w-3 mr-1" /> Zoom -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="h-8 px-2 text-xs"
              >
                <ZoomIn className="h-3 w-3 mr-1" /> Zoom +
              </Button>
            </div>

            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="sm:hidden gap-1.5 h-8 text-xs font-semibold"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              Download PDF
            </Button>
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
        onClick={() => setIsOpen(true)}
        className={cn("gap-2 shadow-sm font-semibold transition-all", className)}
      >
        {isDownloading ? (
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
