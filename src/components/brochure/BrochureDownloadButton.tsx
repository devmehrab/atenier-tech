"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  RotateCcw,
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

// Base A4 dimensions in px (210mm x 297mm at standard 96 DPI)
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

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
  const [containerDims, setContainerDims] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [zoomLevel, setZoomLevel] = useState<number | null>(null); // null = auto-fit
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update container dimensions with ResizeObserver for precise responsive measurement
  useEffect(() => {
    if (!isOpen || !previewContainerRef.current) return;

    const el = previewContainerRef.current;
    const updateSize = () => {
      if (el) {
        setContainerDims({
          width: el.clientWidth,
          height: el.clientHeight,
        });
      }
    };

    updateSize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        updateSize();
      });
      ro.observe(el);
    }

    window.addEventListener("resize", updateSize);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updateSize);
    };
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

  const getHtml = useCallback(() => {
    return generateBrochureHtml({
      property,
      organization,
      agent,
      publicUrl: typeof window !== "undefined" ? window.location.href : "",
    });
  }, [property, organization, agent]);

  // Calculate auto scale factor to fit mobile or desktop screen width
  const isMobile = containerDims.width > 0 && containerDims.width < 640;
  const paddingX = isMobile ? 20 : 48;
  const availableWidth = containerDims.width > 0 ? Math.max(100, containerDims.width - paddingX) : A4_WIDTH;

  // Fit scale based on available container width
  const autoScale = Math.min(1.05, Math.max(0.3, parseFloat((availableWidth / A4_WIDTH).toFixed(3))));
  const activeScale = zoomLevel !== null ? zoomLevel : autoScale;

  // Scaled bounding box dimensions
  const scaledWidth = Math.round(A4_WIDTH * activeScale);
  const scaledHeight = Math.round(A4_HEIGHT * activeScale);

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
      return Math.min(1.4, +(current + 0.15).toFixed(2));
    });
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const current = prev !== null ? prev : autoScale;
      return Math.max(0.3, +(current - 0.15).toFixed(2));
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(null);
  };

  const modalContent = isOpen && mounted ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 flex flex-col h-full sm:h-[94vh] sm:max-h-[960px] w-full max-w-5xl overflow-hidden rounded-none sm:rounded-2xl bg-card border-0 sm:border sm:border-border/80 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 border-b border-border/60 bg-muted/60 px-3 py-2.5 sm:px-6 sm:py-3.5 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-base font-bold text-foreground truncate">
                Property Brochure Preview
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block truncate">
                A4 Print-Ready Document • Atenier Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="flex items-center rounded-xl border border-border/70 bg-card p-0.5 text-xs shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={activeScale <= 0.35}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-1.5 sm:px-2 py-1 font-mono text-[10px] sm:text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
                title="Reset to Fit Width"
              >
                {Math.round(activeScale * 100)}%
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={activeScale >= 1.4}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
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
              className="hidden md:flex gap-1.5 shadow-sm font-medium h-8 sm:h-9"
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
              className="gap-1.5 sm:gap-2 shadow-md font-semibold h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>{isDownloading ? "Generating..." : "Download PDF"}</span>
            </Button>

            {/* Close */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Modal Body: Responsive Centered A4 Preview */}
        <div
          ref={previewContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto bg-neutral-200/90 dark:bg-neutral-950 p-2 sm:p-6 flex items-start justify-center"
        >
          {/* Outer Exact-Size Wrapper (Matches visually scaled dimensions to prevent ghost whitespace or scroll bugs) */}
          <div
            className="relative transition-all duration-200 ease-out shadow-2xl rounded-lg sm:rounded-xl bg-white border border-neutral-300 dark:border-neutral-800 my-auto"
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              minWidth: `${scaledWidth}px`,
              minHeight: `${scaledHeight}px`,
            }}
          >
            {/* Inner Scaled Document */}
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{
                width: `${A4_WIDTH}px`,
                height: `${A4_HEIGHT}px`,
                transform: `scale(${activeScale})`,
                transformOrigin: "top left",
              }}
            >
              <iframe
                ref={iframeRef}
                title="Brochure Preview"
                srcDoc={getHtml()}
                className="w-full h-full border-0 rounded-lg sm:rounded-xl"
                style={{
                  width: `${A4_WIDTH}px`,
                  height: `${A4_HEIGHT}px`,
                  backgroundColor: "#ffffff",
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-border/60 bg-card px-3 py-2 sm:px-6 sm:py-3 flex flex-row items-center justify-between gap-2 text-xs text-muted-foreground font-sans shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate text-[11px] sm:text-xs">
              High-resolution A4 printable PDF
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {zoomLevel !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetZoom}
                className="h-7 px-2 text-[11px] text-muted-foreground hover:text-primary gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Fit Width
              </Button>
            )}

            <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground">
              {A4_WIDTH} × {A4_HEIGHT} px (A4)
            </span>
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
