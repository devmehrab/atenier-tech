"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Map,
  Marker,
  NavigationControl,
  Popup,
  AttributionControl,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Layers,
  Compass,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IPropertyLocation } from "@/lib/types";

interface PropertyMapSectionProps {
  location: IPropertyLocation;
  propertyTitle: string;
  priceFormatted?: string;
  listingType?: string;
  propertyType?: string;
}

const DEFAULT_DHAKA_COORDS: [number, number] = [90.4125, 23.8103]; // [lng, lat]

// 1. High-DPI Bright / Voyager Style (Colorful, crisp, detailed streets & landmarks)
const BRIGHT_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "bright-tiles": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> / <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: "bright-layer",
      type: "raster",
      source: "bright-tiles",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

// 2. OpenStreetMap Standard (Liberty)
const LIBERTY_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: "osm-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

// 3. Positron (Minimalist Luxury Light)
const POSITRON_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "positron-tiles": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> / CARTO',
    },
  },
  layers: [
    {
      id: "positron-layer",
      type: "raster",
      source: "positron-tiles",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

// 4. Dark Matter (Sleek Dark Mode)
const DARK_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "dark-tiles": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> / CARTO',
    },
  },
  layers: [
    {
      id: "dark-layer",
      type: "raster",
      source: "dark-tiles",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

const MAP_STYLES: Record<string, string | StyleSpecification> = {
  bright: BRIGHT_STYLE,
  liberty: LIBERTY_STYLE,
  positron: POSITRON_STYLE,
  dark: DARK_STYLE,
  ofm_vector: "https://tiles.openfreemap.org/styles/bright",
};

export function PropertyMapSection({
  location,
  propertyTitle,
  priceFormatted,
  listingType,
}: PropertyMapSectionProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [copied, setCopied] = useState(false);
  const [mapStyle, setMapStyle] = useState<"bright" | "liberty" | "positron" | "dark">("liberty");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerWrapperRef = useRef<HTMLDivElement>(null);

  const hasExactCoords =
    typeof location.latitude === "number" &&
    typeof location.longitude === "number" &&
    !isNaN(location.latitude) &&
    !isNaN(location.longitude) &&
    location.latitude !== 0 &&
    location.longitude !== 0;

  const lat = hasExactCoords ? location.latitude! : DEFAULT_DHAKA_COORDS[1];
  const lng = hasExactCoords ? location.longitude! : DEFAULT_DHAKA_COORDS[0];

  const fullAddressString = [
    location.address,
    location.area,
    location.city,
    location.state,
    location.country || "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");

  // Google Maps and OSM external links
  const googleMapsUrl = hasExactCoords
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressString)}`;

  const googleDirectionsUrl = hasExactCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddressString)}`;

  // Copy coordinates or address
  const copyCoordinates = () => {
    const textToCopy = hasExactCoords
      ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      : fullAddressString;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Recenter map
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        essential: true,
      });
    }
  };

  // Switch style dynamically
  const handleStyleChange = (styleKey: "bright" | "liberty" | "positron" | "dark") => {
    setMapStyle(styleKey);
    if (mapInstanceRef.current) {
      const selectedStyle = MAP_STYLES[styleKey];
      mapInstanceRef.current.setStyle(selectedStyle);
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerWrapperRef.current) return;
    if (!document.fullscreenElement) {
      containerWrapperRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen error:", err);
      });
      setIsFullscreen(false);
    }
  };

  // Listen to fullscreen changes
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (mapInstanceRef.current) {
        setTimeout(() => mapInstanceRef.current?.resize(), 200);
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = "";
    }

    const map = new Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[mapStyle],
      center: [lng, lat],
      zoom: hasExactCoords ? 15.5 : 13,
      attributionControl: false,
    });

    // Add navigation controls
    map.addControl(new NavigationControl({ showCompass: true }), "top-right");
    map.addControl(
      new AttributionControl({
        customAttribution:
          '© <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> / <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
        compact: true,
      }),
      "bottom-right"
    );

    // Create custom pin element
    const el = document.createElement("div");
    el.className = "group relative cursor-pointer";
    el.innerHTML = `
      <div class="relative flex items-center justify-center">
        <span class="absolute h-10 w-10 rounded-full bg-primary/30 animate-ping opacity-75"></span>
        <div class="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground shadow-2xl ring-4 ring-background transition-transform transform group-hover:scale-115">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `;

    // Popup content
    const popupHtml = `
      <div class="p-3 max-w-[240px] text-left font-sans">
        ${listingType
        ? `<span class="inline-block px-2 py-0.5 mb-1.5 text-[10px] font-bold uppercase rounded bg-primary/15 text-primary">${listingType}</span>`
        : ""
      }
        <h4 class="text-xs font-bold text-gray-900 leading-snug line-clamp-2">${propertyTitle}</h4>
        ${priceFormatted
        ? `<div class="text-sm font-extrabold text-primary mt-1">${priceFormatted}</div>`
        : ""
      }
        <p class="text-[11px] text-gray-600 mt-1 line-clamp-2">${location.address}, ${location.area}</p>
      </div>
    `;

    const popup = new Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: false,
    }).setHTML(popupHtml);

    const marker = new Marker({ element: el })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    markerRef.current = marker;

    // Handle map load & resize
    map.on("load", () => {
      map.resize();
      popup.addTo(map);
    });

    // ResizeObserver
    if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
      const ro = new ResizeObserver(() => {
        map.resize();
      });
      ro.observe(mapContainerRef.current);
      resizeObserverRef.current = ro;
    }

    // Staged resize triggers
    const t1 = setTimeout(() => map.resize(), 100);
    const t2 = setTimeout(() => map.resize(), 300);
    const t3 = setTimeout(() => map.resize(), 700);

    mapInstanceRef.current = map;

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      marker.remove();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, hasExactCoords, propertyTitle, priceFormatted, listingType, location.address, location.area]);

  return (
    <div
      ref={containerWrapperRef}
      className={`rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6 ${isFullscreen ? "p-4 bg-background fixed inset-0 z-50 rounded-none overflow-y-auto" : ""
        }`}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-card-foreground">
              লোকেশন ও আশপাশের মানচিত্র
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            {location.address}, {location.area}, {location.city}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {hasExactCoords && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyCoordinates}
              className="h-8 text-xs gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  কপি হয়েছে
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  কোঅর্ডিনেটস কপি
                </>
              )}
            </Button>
          )}

          <a
            href={googleDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Navigation className="h-3.5 w-3.5" />
            দিকনির্দেশনা (Directions)
          </a>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/50 text-card-foreground text-xs font-semibold hover:bg-muted transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Google Maps
          </a>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="relative rounded-2xl overflow-hidden border border-border/70 shadow-md bg-muted min-h-[380px]">
        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className={`w-full ${isFullscreen ? "h-[calc(100vh-220px)] min-h-[500px]" : "h-[380px] sm:h-[460px]"
            } rounded-2xl relative`}
          style={{ width: "100%", height: isFullscreen ? "calc(100vh - 220px)" : "420px", minHeight: "380px" }}
        />

        {/* Top Left: Style Switcher */}
        <div className="absolute top-3 left-3 z-10 flex items-center bg-card/90 backdrop-blur-md rounded-xl p-1 border border-border/70 shadow-md text-xs font-semibold">
          <Layers className="h-3.5 w-3.5 ml-2 mr-1.5 text-muted-foreground" />
          <button
            type="button"
            onClick={() => handleStyleChange("bright")}
            className={`px-2.5 py-1 rounded-lg transition-all ${mapStyle === "bright"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            উজ্জ্বল (Bright)
          </button>
          <button
            type="button"
            onClick={() => handleStyleChange("liberty")}
            className={`px-2.5 py-1 rounded-lg transition-all ${mapStyle === "liberty"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            OSM
          </button>
          <button
            type="button"
            onClick={() => handleStyleChange("positron")}
            className={`px-2.5 py-1 rounded-lg transition-all ${mapStyle === "positron"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            পজিট্রন (Positron)
          </button>
          <button
            type="button"
            onClick={() => handleStyleChange("dark")}
            className={`px-2.5 py-1 rounded-lg transition-all ${mapStyle === "dark"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            ডার্ক (Dark)
          </button>
        </div>

        {/* Top Right: Custom Action Controls (Recenter & Fullscreen) */}
        <div className="absolute top-3 right-12 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter map on property"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-card/90 backdrop-blur-md border border-border/70 text-card-foreground shadow-md hover:bg-card transition-all"
          >
            <Compass className="h-4 w-4 text-primary" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-card/90 backdrop-blur-md border border-border/70 text-card-foreground shadow-md hover:bg-card transition-all"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Bottom Left: OpenFreeMap Badge */}
        <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-2 rounded-xl bg-card/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-semibold text-card-foreground border border-border/70 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>OpenFreeMap / OSM মানচিত্র</span>
        </div>
      </div>

      {/* Location Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            এলাকা / নেইবারহুড
          </span>
          <span className="text-sm font-bold text-card-foreground">
            {location.area || "N/A"}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            শহর / জেলা
          </span>
          <span className="text-sm font-bold text-card-foreground">
            {location.city || "N/A"}
            {location.state ? `, ${location.state}` : ""}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            হোল্ডিং / রোড ঠিকানা
          </span>
          <span
            className="text-sm font-bold text-card-foreground truncate block"
            title={location.address}
          >
            {location.address || "N/A"}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            মানচিত্র কোঅর্ডিনেটস
          </span>
          <span className="text-sm font-bold text-card-foreground font-mono">
            {hasExactCoords ? `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E` : "এরিয়া ভিত্তিক"}
          </span>
        </div>
      </div>
    </div>
  );
}
