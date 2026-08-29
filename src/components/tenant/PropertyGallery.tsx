"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ICloudinaryImage } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Camera,
  Sparkles,
} from "lucide-react";

interface PropertyGalleryProps {
  images: ICloudinaryImage[];
  title: string;
  className?: string;
}

const AUTOPLAY_INTERVAL = 4500; // 4.5 seconds per slide

// Motion animation variants for smooth GPU-accelerated directional sliding
const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "35%" : "-35%",
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 320, damping: 32, mass: 0.8 },
      opacity: { duration: 0.28, ease: "easeOut" },
      scale: { duration: 0.35, ease: "easeOut" },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-35%" : "35%",
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: "spring" as const, stiffness: 320, damping: 32, mass: 0.8 },
      opacity: { duration: 0.22, ease: "easeIn" },
    },
  }),
};

export function PropertyGallery({ images, title, className }: PropertyGalleryProps) {
  // Normalize images to ensure at least one fallback image exists
  const displayImages = React.useMemo(() => {
    if (images && images.length > 0) {
      return images;
    }
    return [
      {
        publicId: "placeholder-1",
        secureUrl:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
        caption: "Front View",
      },
    ];
  }, [images]);

  // State
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [gridModalOpen, setGridModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Thumbnail container ref
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);
  const thumbnailButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Navigation handlers
  const goToNext = useCallback(() => {
    setDirection(1);
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  }, [displayImages.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  }, [displayImages.length]);

  const goToIndex = useCallback((index: number) => {
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  }, [selectedIndex]);

  // Lightbox navigation
  const nextLightbox = useCallback(() => {
    setZoomLevel(1);
    setLightboxIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  }, [displayImages.length]);

  const prevLightbox = useCallback(() => {
    setZoomLevel(1);
    setLightboxIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  }, [displayImages.length]);

  // Autoplay functionality with smooth pause on hover
  useEffect(() => {
    if (!isPlaying || isHovered || displayImages.length <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, displayImages.length, goToNext]);

  // Synchronize thumbnail scroll position to keep active thumbnail in view
  useEffect(() => {
    const activeThumb = thumbnailButtonsRef.current[selectedIndex];
    if (activeThumb && thumbnailContainerRef.current) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === "ArrowRight") nextLightbox();
        if (e.key === "ArrowLeft") prevLightbox();
        if (e.key === "Escape") {
          setLightboxOpen(false);
          setZoomLevel(1);
        }
        if (e.key === "+" || e.key === "=") setZoomLevel((z) => Math.min(z + 0.5, 3));
        if (e.key === "-") setZoomLevel((z) => Math.max(z - 0.5, 1));
      } else if (gridModalOpen) {
        if (e.key === "Escape") setGridModalOpen(false);
      } else {
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "ArrowLeft") goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, gridModalOpen, nextLightbox, prevLightbox, goToNext, goToPrev]);

  // Handle Drag & Swipe End
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -500) {
      goToNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 500) {
      goToPrev();
    }
  };

  // Scroll thumbnails manually
  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 240;
      thumbnailContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Open Lightbox
  const openLightbox = (index?: number) => {
    setLightboxIndex(index !== undefined ? index : selectedIndex);
    setZoomLevel(1);
    setLightboxOpen(true);
  };

  // Current active images
  const currentImage = displayImages[selectedIndex] || displayImages[0];
  const activeLightboxImage = displayImages[lightboxIndex] || displayImages[0];

  return (
    <section aria-label="Property Gallery" className={cn("space-y-3.5 select-none", className)}>
      {/* Main Slider Stage */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] lg:aspect-[16/9] w-full overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-950 shadow-xl ring-1 ring-white/10"
      >
        {/* Animated Slide Image Container with Drag gesture */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={selectedIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag={displayImages.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={handleDragEnd}
            onClick={() => openLightbox()}
            className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing will-change-transform"
          >
            <Image
              src={currentImage.secureUrl}
              alt={currentImage.caption || `${title} - Photo ${selectedIndex + 1}`}
              fill
              priority={selectedIndex <= 1}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Gradient Overlays for High Legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/50" />

        {/* Top Control Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          {/* Badge: HD Gallery */}
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/95 backdrop-blur-md border border-white/15 shadow-sm">
              <Camera className="h-3.5 w-3.5 text-primary-100" />
              <span>HD Gallery</span>
            </span>
            {currentImage.isFeatured && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-500/80 px-2.5 py-1 text-[11px] font-bold  -wide text-white uppercase backdrop-blur-md shadow-sm">
                <Sparkles className="h-3 w-3" /> Featured
              </span>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {/* Autoplay Toggle */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-white backdrop-blur-md border transition-all duration-200 hover:scale-105 active:scale-95 shadow-md",
                  isPlaying
                    ? "bg-primary text-primary-foreground border-primary/40 ring-2 ring-primary/30"
                    : "bg-black/45 hover:bg-black/65 border-white/15 text-white/90"
                )}
                title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                aria-label={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
            )}

            {/* Grid View Trigger */}
            {displayImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGridModalOpen(true);
                }}
                className="hidden sm:flex h-9 items-center gap-1.5 rounded-full bg-black/45 hover:bg-black/65 px-3 text-xs font-medium text-white/90 backdrop-blur-md border border-white/15 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                title="View All Photos"
                aria-label="View All Photos"
              >
                <Grid className="h-3.5 w-3.5" />
                <span>All ({displayImages.length})</span>
              </button>
            )}

            {/* Expand / Lightbox Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openLightbox();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/45 hover:bg-black/65 text-white/90 backdrop-blur-md border border-white/15 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
              title="Expand Fullscreen"
              aria-label="Expand Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Arrow Controls */}
        {displayImages.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-4 pointer-events-none z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/45 text-white border border-white/20 backdrop-blur-md transition-all duration-200 hover:bg-black/80 hover:scale-110 hover:border-white/40 active:scale-95 shadow-xl opacity-90 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/45 text-white border border-white/20 backdrop-blur-md transition-all duration-200 hover:bg-black/80 hover:scale-110 hover:border-white/40 active:scale-95 shadow-xl opacity-90 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        )}

        {/* Bottom Bar: Image Index Counter & Caption */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          {/* Counter pill */}
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-black/55 px-3 py-1.5 text-xs font-semibold text-white/95 backdrop-blur-md border border-white/15 shadow-sm">
            <span className="font-mono text-emerald-400">
              {String(selectedIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-white/40">/</span>
            <span className="font-mono text-white/80">
              {String(displayImages.length).padStart(2, "0")}
            </span>
          </div>

          {/* Interactive Dot Indicators (Mobile & Tablet) */}
          {displayImages.length > 1 && displayImages.length <= 12 && (
            <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1.5 backdrop-blur-md border border-white/10">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToIndex(idx);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    selectedIndex === idx
                      ? "w-5 bg-primary shadow-[0_0_8px_rgba(21,128,61,0.8)]"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Caption / Expand CTA */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openLightbox();
            }}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-xl bg-black/55 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md border border-white/15 transition-all hover:bg-black/80 hover:text-white"
          >
            <span className="hidden sm:inline">
              {currentImage.caption || "Click to zoom"}
            </span>
            <span className="sm:hidden">Zoom</span>
            <Maximize2 className="h-3 w-3 text-white/70" />
          </button>
        </div>

        {/* Autoplay Animated Progress Bar */}
        {isPlaying && displayImages.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden z-20">
            <motion.div
              key={selectedIndex}
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? "0%" : "100%" }}
              transition={{
                duration: AUTOPLAY_INTERVAL / 1000,
                ease: "linear",
              }}
              className="h-full bg-primary shadow-[0_0_8px_rgba(21,128,61,1)]"
            />
          </div>
        )}
      </div>

      {/* Thumbnails Floating Dock */}
      {displayImages.length > 1 && (
        <div className="relative group/thumbs flex items-center">
          {/* Scroll Left Button */}
          {displayImages.length > 5 && (
            <button
              type="button"
              onClick={() => scrollThumbnails("left")}
              className="hidden md:flex absolute -left-2 z-20 h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg border border-border/80 backdrop-blur-sm transition-all hover:scale-110 hover:bg-background opacity-0 group-hover/thumbs:opacity-100"
              aria-label="Scroll thumbnails left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Thumbnails Container */}
          <div
            ref={thumbnailContainerRef}
            className="flex gap-2.5 overflow-x-auto py-1 px-0.5 scrollbar-none scroll-smooth w-full"
          >
            {displayImages.map((img, idx) => {
              const isActive = selectedIndex === idx;
              return (
                <button
                  key={img.publicId || idx}
                  ref={(el) => {
                    thumbnailButtonsRef.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={cn(
                    "relative aspect-[16/11] h-14 sm:h-16 md:h-18 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "border-primary ring-2 ring-primary/40 scale-[1.04] shadow-md z-10"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]"
                  )}
                  aria-label={`View photo ${idx + 1}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <Image
                    src={img.secureUrl}
                    alt={img.caption || `Thumbnail ${idx + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                  {/* Active highlight overlay */}
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          {displayImages.length > 5 && (
            <button
              type="button"
              onClick={() => scrollThumbnails("right")}
              className="hidden md:flex absolute -right-2 z-20 h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg border border-border/80 backdrop-blur-sm transition-all hover:scale-110 hover:bg-background opacity-0 group-hover/thumbs:opacity-100"
              aria-label="Scroll thumbnails right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Fullscreen Lightbox Modal (Ultra-Luxurious Darkroom) */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-2xl p-4 md:p-6"
            onClick={() => {
              setLightboxOpen(false);
              setZoomLevel(1);
            }}
          >
            {/* Lightbox Header Bar */}
            <div
              className="flex items-center justify-between text-white z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm sm:text-base text-white/90 line-clamp-1 max-w-[200px] sm:max-w-md">
                  {title}
                </span>
                <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-mono text-emerald-400 backdrop-blur-md">
                  {lightboxIndex + 1} / {displayImages.length}
                </span>
              </div>

              {/* Lightbox Toolbar */}
              <div className="flex items-center gap-2">
                {/* Zoom In / Out Controls */}
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => (prev >= 2.5 ? 1 : prev + 0.5))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
                  title="Toggle Zoom"
                  aria-label="Toggle Zoom"
                >
                  {zoomLevel > 1 ? (
                    <RotateCcw className="h-4 w-4" />
                  ) : (
                    <ZoomIn className="h-4 w-4" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setLightboxOpen(false);
                    setZoomLevel(1);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-red-500/80 text-white transition-all hover:scale-105"
                  title="Close (Esc)"
                  aria-label="Close Lightbox"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Main Stage */}
            <div
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    scale: zoomLevel,
                    transition: { duration: 0.25 },
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative max-h-[78vh] max-w-[92vw] aspect-[16/10] w-full flex items-center justify-center"
                >
                  <Image
                    src={activeLightboxImage.secureUrl}
                    alt={activeLightboxImage.caption || `${title} - Photo ${lightboxIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Lightbox Buttons */}
              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevLightbox}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110"
                    aria-label="Previous Photo"
                  >
                    <ChevronLeft className="h-7 w-7" />
                  </button>
                  <button
                    type="button"
                    onClick={nextLightbox}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110"
                    aria-label="Next Photo"
                  >
                    <ChevronRight className="h-7 w-7" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Bottom Thumbnails Strip */}
            {displayImages.length > 1 && (
              <div
                className="flex justify-center z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-2 max-w-full overflow-x-auto py-2 px-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 scrollbar-none">
                  {displayImages.map((img, idx) => (
                    <button
                      key={img.publicId || idx}
                      type="button"
                      onClick={() => {
                        setZoomLevel(1);
                        setLightboxIndex(idx);
                        setSelectedIndex(idx);
                      }}
                      className={cn(
                        "relative aspect-[16/10] h-12 sm:h-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                        lightboxIndex === idx
                          ? "border-primary scale-105 shadow-md"
                          : "border-transparent opacity-50 hover:opacity-90"
                      )}
                      aria-label={`Jump to photo ${idx + 1}`}
                    >
                      <Image
                        src={img.secureUrl}
                        alt={`Photo ${idx + 1}`}
                        fill
                        sizes="90px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Photos Grid View Modal */}
      <AnimatePresence>
        {gridModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6 md:p-8"
            onClick={() => setGridModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl bg-neutral-900 border border-white/15 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10 bg-neutral-900/80 backdrop-blur-md">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Grid className="h-5 w-5 text-primary" />
                    সমস্ত ছবি গ্যালারি ({displayImages.length})
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setGridModalOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  aria-label="Close Gallery Grid"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Photos Grid Scrollable Area */}
              <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[calc(85vh-120px)]">
                {displayImages.map((img, idx) => (
                  <div
                    key={img.publicId || idx}
                    onClick={() => {
                      setGridModalOpen(false);
                      setSelectedIndex(idx);
                      openLightbox(idx);
                    }}
                    className="group relative aspect-[16/11] rounded-xl overflow-hidden cursor-pointer bg-neutral-950 border border-white/10 transition-all duration-300 hover:scale-[1.03] hover:border-primary hover:shadow-lg"
                  >
                    <Image
                      src={img.secureUrl}
                      alt={img.caption || `Photo ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                      <span className="text-[11px] font-medium text-white/90 truncate">
                        {img.caption || `Photo ${idx + 1}`}
                      </span>
                      <Maximize2 className="h-3.5 w-3.5 text-white shrink-0" />
                    </div>
                    <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-white/90 backdrop-blur-sm">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

