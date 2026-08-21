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
              placeholder="প্রপার্টির নাম, এলাকা বা কিওয়ার্ড লিখুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" className="gap-1.5 h-10 font-semibold">
              <Filter className="h-4 w-4" />
              ফিল্টার করুন
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="h-10 text-muted-foreground hover:text-foreground gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              রিসেট
            </Button>
          </div>
        </div>

        {/* Facet row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-border/50">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              উদ্দেশ্য (Purpose)
            </label>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">সকল ধরন (বিক্রি/ভাড়া)</option>
              <option value="SALE">বিক্রয়ের জন্য (Sale)</option>
              <option value="RENT">ভাড়ার জন্য (Rent)</option>
              <option value="LEASE">কমার্শিয়াল লিজ (Lease)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              প্রপার্টি টাইপ
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">সব ক্যাটাগরি</option>
              <option value="APARTMENT">অ্যাপার্টমেন্ট / ফ্ল্যাট</option>
              <option value="HOUSE">বাড়ি / ভিলা</option>
              <option value="VILLA">লাক্সারি ভিলা</option>
              <option value="PENTHOUSE">পেন্টহাউস</option>
              <option value="COMMERCIAL">বাণিজ্যিক স্পেস</option>
              <option value="OFFICE">অফিস স্পেস</option>
              <option value="LAND">জমি / প্লট</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              বেডরুম
            </label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">যেকোনো বেড</option>
              <option value="1">১+ বেড</option>
              <option value="2">২+ বেড</option>
              <option value="3">৩+ বেড</option>
              <option value="4">৪+ বেড</option>
              <option value="5">৫+ বেড</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              বাজেট (মূল্য)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="সর্বনিম্ন"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background text-foreground px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-muted-foreground text-xs">-</span>
              <input
                type="number"
                placeholder="সর্বোচ্চ"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background text-foreground px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              সাজান (Sort By)
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="newest">নতুন লিস্টিং আগে</option>
              <option value="price_asc">মূল্য: কম থেকে বেশি</option>
              <option value="price_desc">মূল্য: বেশি থেকে কম</option>
              <option value="popular">সর্বাধিক জনপ্রিয়</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

