"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Map,
  Marker,
  NavigationControl,
  AttributionControl,
  type MapMouseEvent,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  MapPin,
  Search,
  Crosshair,
  RotateCcw,
  Navigation,
  Loader2,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OpenFreeMapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
  city?: string;
  area?: string;
  onChange: (coords: { latitude?: number; longitude?: number }) => void;
}

const DEFAULT_CENTER: [number, number] = [-73.9855, 40.7484]; // Manhattan, New York [lng, lat]
const DEFAULT_ZOOM = 13;

const PRESET_LOCATIONS = [
  { name: "Manhattan", lng: -73.9855, lat: 40.7484 },
  { name: "Brooklyn", lng: -73.9442, lat: 40.6782 },
  { name: "Los Angeles", lng: -118.2437, lat: 34.0522 },
  { name: "Miami", lng: -80.1918, lat: 25.7617 },
  { name: "London", lng: -0.1276, lat: 51.5074 },
  { name: "Dubai", lng: 55.2708, lat: 25.2048 },
  { name: "Toronto", lng: -79.3832, lat: 43.6532 },
  { name: "Sydney", lng: 151.2093, lat: -33.8688 },
];

// OpenStreetMap (OSM) Standard Raster Tiles
const OSM_STYLE: StyleSpecification = {
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

export function OpenFreeMapPicker({
  latitude,
  longitude,
  address,
  city,
  area,
  onChange,
}: OpenFreeMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{ display_name: string; lat: string; lon: string }>
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const hasCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude);

  // Helper to create branded pin element
  const createMarkerElement = () => {
    const el = document.createElement("div");
    el.className = "group relative cursor-grab active:cursor-grabbing";
    el.innerHTML = `
      <div class="relative flex items-center justify-center">
        <span class="absolute h-8 w-8 rounded-full bg-primary/30 animate-ping opacity-75"></span>
        <div class="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl ring-4 ring-background transition-transform transform group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `;
    return el;
  };

  // Initialize Map with OpenStreetMap (OSM)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = "";
    }

    const initialCenter: [number, number] = hasCoords
      ? [longitude!, latitude!]
      : DEFAULT_CENTER;

    const initialZoom = hasCoords ? 15 : DEFAULT_ZOOM;

    const map = new Map({
      container: mapContainerRef.current,
      style: OSM_STYLE,
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    // Add navigation controls (zoom, compass)
    map.addControl(new NavigationControl({ showCompass: true }), "top-right");
    map.addControl(
      new AttributionControl({
        customAttribution:
          '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        compact: true,
      }),
      "bottom-right"
    );

    map.on("load", () => {
      map.resize();
    });

    // If initial coordinates exist, place marker
    if (hasCoords) {
      const marker = new Marker({
        element: createMarkerElement(),
        draggable: true,
      })
        .setLngLat([longitude!, latitude!])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        onChange({
          latitude: parseFloat(lngLat.lat.toFixed(6)),
          longitude: parseFloat(lngLat.lng.toFixed(6)),
        });
      });

      markerRef.current = marker;
    }

    // Map click handler to place or move marker
    map.on("click", (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      const cleanLat = parseFloat(lat.toFixed(6));
      const cleanLng = parseFloat(lng.toFixed(6));

      if (markerRef.current) {
        markerRef.current.setLngLat([cleanLng, cleanLat]);
      } else {
        const marker = new Marker({
          element: createMarkerElement(),
          draggable: true,
        })
          .setLngLat([cleanLng, cleanLat])
          .addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLngLat();
          onChange({
            latitude: parseFloat(pos.lat.toFixed(6)),
            longitude: parseFloat(pos.lng.toFixed(6)),
          });
        });

        markerRef.current = marker;
      }

      onChange({ latitude: cleanLat, longitude: cleanLng });
    });

    // ResizeObserver for reliable rendering
    if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
      const ro = new ResizeObserver(() => {
        map.resize();
      });
      ro.observe(mapContainerRef.current);
      resizeObserverRef.current = ro;
    }

    // Timers for animation settlement
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
      if (markerRef.current) {
        markerRef.current.remove();
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker position if coordinates change externally
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (hasCoords) {
      if (markerRef.current) {
        markerRef.current.setLngLat([longitude!, latitude!]);
      } else {
        const marker = new Marker({
          element: createMarkerElement(),
          draggable: true,
        })
          .setLngLat([longitude!, latitude!])
          .addTo(mapInstanceRef.current);

        marker.on("dragend", () => {
          const pos = marker.getLngLat();
          onChange({
            latitude: parseFloat(pos.lat.toFixed(6)),
            longitude: parseFloat(pos.lng.toFixed(6)),
          });
        });

        markerRef.current = marker;
      }
    } else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [latitude, longitude, hasCoords, onChange]);

  // Search Address via Nominatim
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setShowResults(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("Geocoding search error:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Select Search Result
  const selectResult = (res: { lat: string; lon: string; display_name: string }) => {
    const latVal = parseFloat(parseFloat(res.lat).toFixed(6));
    const lonVal = parseFloat(parseFloat(res.lon).toFixed(6));

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [lonVal, latVal],
        zoom: 16,
        essential: true,
      });
    }

    onChange({ latitude: latVal, longitude: lonVal });
    setShowResults(false);
    setSearchQuery(res.display_name.split(",")[0]);
  };

  // Select Preset Location
  const selectPreset = (preset: { name: string; lng: number; lat: number }) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [preset.lng, preset.lat],
        zoom: 15,
        essential: true,
      });
    }
    onChange({ latitude: preset.lat, longitude: preset.lng });
  };

  // Use Current Location
  const handleCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latVal = parseFloat(pos.coords.latitude.toFixed(6));
        const lngVal = parseFloat(pos.coords.longitude.toFixed(6));

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo({
            center: [lngVal, latVal],
            zoom: 16,
            essential: true,
          });
        }
        onChange({ latitude: latVal, longitude: lngVal });
        setGettingLocation(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Could not access your location. Please check browser permissions.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Clear Marker
  const handleClearLocation = () => {
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    onChange({ latitude: undefined, longitude: undefined });
  };

  // Auto-suggest using filled address if available
  const handleAutoSearchFromForm = () => {
    const queryParts = [address, area, city].filter(Boolean).join(", ");
    if (queryParts) {
      setSearchQuery(queryParts);
      setSearching(true);
      setShowResults(true);
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          queryParts
        )}&limit=5`
      )
        .then((r) => r.json())
        .then((data) => {
          setSearchResults(data || []);
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-card-foreground">
              OpenStreetMap (OSM) Pinpoint Location
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Click anywhere on the map or drag the pin to set the exact property coordinates
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {hasCoords ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Location Pin Set ({latitude?.toFixed(4)}, {longitude?.toFixed(4)})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              <HelpCircle className="h-3.5 w-3.5" />
              Pin Not Placed (Click map to place)
            </span>
          )}
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
              placeholder="Search address, neighborhood, city, or landmark (e.g. Manhattan, London)..."
              className="w-full rounded-xl border border-border/80 bg-background pl-9 pr-20 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={searching || !searchQuery.trim()}
              className="absolute right-1.5 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              {searching ? <Loader2 className="h-3 w-3 animate-spin" /> : "Search"}
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-xl">
              <div className="text-[10px] font-bold uppercase text-muted-foreground px-2 py-1">
                Select Location to Pin
              </div>
              {searchResults.map((res, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => selectResult(res)}
                  className="w-full text-left rounded-lg p-2 text-xs text-card-foreground hover:bg-muted transition-colors flex items-start gap-2 border-b border-border/40 last:border-0"
                >
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-tight">{res.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Location Action Buttons */}
        <div className="flex items-center gap-2">
          {(address || area || city) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoSearchFromForm}
              title="Search using address typed above"
              className="h-9 text-xs gap-1.5 whitespace-nowrap"
            >
              <Search className="h-3.5 w-3.5" />
              Find Address
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCurrentLocation}
            disabled={gettingLocation}
            title="Use current GPS location"
            className="h-9 text-xs gap-1.5 whitespace-nowrap"
          >
            {gettingLocation ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : (
              <Navigation className="h-3.5 w-3.5 text-primary" />
            )}
            My Location
          </Button>

          {hasCoords && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearLocation}
              title="Remove map pin"
              className="h-9 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear Pin
            </Button>
          )}
        </div>
      </div>

      {/* Preset Quick Jump Badges */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-semibold text-muted-foreground mr-1">Quick Jump:</span>
        {PRESET_LOCATIONS.map((preset) => (
          <button
            type="button"
            key={preset.name}
            onClick={() => selectPreset(preset)}
            className="rounded-lg bg-muted/70 hover:bg-primary/15 hover:text-primary px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-all border border-border/40"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Interactive Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-border/80 shadow-md bg-muted min-h-[380px]">
        {/* Map Canvas */}
        <div
          ref={mapContainerRef}
          className="w-full h-[380px] sm:h-[420px] rounded-2xl relative"
          style={{ width: "100%", height: "400px", minHeight: "380px" }}
        />

        {/* OSM Map Indicator Badge on Top Left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-card/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-card-foreground border border-border/70 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>OpenStreetMap (OSM)</span>
        </div>

        {/* Instruction overlay on bottom left */}
        <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-1.5 rounded-lg bg-card/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-medium text-card-foreground border border-border/70 shadow-sm">
          <Crosshair className="h-3.5 w-3.5 text-primary" />
          <span>Click anywhere to place pin • Drag pin to refine</span>
        </div>
      </div>

      {/* Manual Latitude & Longitude Coordinate Inputs with Two-Way Binding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
            Latitude
          </label>
          <div className="relative">
            <Input
              type="number"
              step="0.000001"
              placeholder="e.g. 23.792500"
              value={typeof latitude === "number" && !isNaN(latitude) ? latitude : ""}
              onChange={(e) => {
                const val = e.target.value === "" ? undefined : parseFloat(e.target.value);
                onChange({ latitude: val, longitude: longitude ?? undefined });
              }}
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-bold text-muted-foreground">
              ° N
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
            Longitude
          </label>
          <div className="relative">
            <Input
              type="number"
              step="0.000001"
              placeholder="e.g. 90.415200"
              value={typeof longitude === "number" && !isNaN(longitude) ? longitude : ""}
              onChange={(e) => {
                const val = e.target.value === "" ? undefined : parseFloat(e.target.value);
                onChange({ latitude: latitude ?? undefined, longitude: val });
              }}
            />
            <span className="absolute right-3 top-2.5 text-[10px] font-bold text-muted-foreground">
              ° E
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
