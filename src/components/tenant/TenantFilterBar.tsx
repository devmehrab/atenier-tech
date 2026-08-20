"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw, Search } from "lucide-react";

export function TenantFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [listingType, setListingType] = useState(searchParams.get("listingType") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (listingType) params.set("listingType", listingType);
    if (propertyType) params.set("propertyType", propertyType);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sortBy) params.set("sortBy", sortBy);
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    setSearch("");
    setListingType("");
    setPropertyType("");
    setBedrooms("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    router.push(pathname);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm mb-8">
      <form onSubmit={applyFilters} className="space-y-4">
        {/* Top row: search + submit */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, location, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" className="gap-1.5 h-10">
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="h-10 text-muted-foreground hover:text-foreground gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Facet row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-border/50">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Purpose
            </label>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Types (Sale/Rent)</option>
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
              <option value="LEASE">Commercial Lease</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Categories</option>
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">House / Single Family</option>
              <option value="VILLA">Luxury Villa</option>
              <option value="PENTHOUSE">Penthouse</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="OFFICE">Office Space</option>
              <option value="LAND">Land / Plot</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Bedrooms
            </label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Any Beds</option>
              <option value="1">1+ Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Price Range
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background text-foreground px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-muted-foreground text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background text-foreground px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Viewed</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

