"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IOrganization } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Home, Key } from "lucide-react";

interface TenantHeroProps {
  organization: IOrganization;
}

export function TenantHero({ organization }: TenantHeroProps) {
  const router = useRouter();
  const [listingType, setListingType] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType !== "ALL") params.set("listingType", listingType);
    if (search.trim()) params.set("search", search.trim());
    if (city.trim()) params.set("city", city.trim());

    router.push(`/${organization.slug}/properties?${params.toString()}`);
  };

  const coverUrl =
    organization.coverImage?.secureUrl ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85";

  return (
    <div className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Background Image with Dark Gradient Overlay */}
      <Image
        src={coverUrl}
        alt={organization.name}
        fill
        priority
        className="object-cover object-center opacity-30 mix-blend-multiply dark:opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted/80 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md border border-border/50 mb-6">
          <span>অফিসিয়াল প্রপার্টি ওয়েবসাইট</span>
        </div>

        <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl text-foreground drop-shadow-sm max-w-4xl mx-auto">
          খুঁজে নিন আপনার পছন্দের প্রপার্টি {" "}
          <span className="text-primary uppercase">{organization.name}</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          {organization.description ||
            `${organization.name}-এর সকল ভেরিফাইড ফ্ল্যাট, জমি ও বাণিজ্যিক প্রপার্টি লিস্টিং দেখুন এক জায়গায়।`}
        </p>

        {/* Hero Search Box */}
        <div className="mt-10 mx-auto max-w-3xl rounded-2xl bg-card/95 p-3 sm:p-4 text-card-foreground shadow-2xl backdrop-blur-md border border-border/60 text-left">
          {/* Listing Type Toggle Tabs */}
          <div className="flex items-center gap-2 mb-3 border-b border-border/50 pb-2.5">
            <button
              type="button"
              onClick={() => setListingType("ALL")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${listingType === "ALL"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
                }`}
            >
              সকল লিস্টিং
            </button>
            <button
              type="button"
              onClick={() => setListingType("SALE")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${listingType === "SALE"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
                }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setListingType("RENT")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${listingType === "RENT"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
                }`}
            >
              Rent
            </button>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3">
            <div className="sm:col-span-6 relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="এলাকা, প্রপার্টির নাম বা কিওয়ার্ড..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors"
              />
            </div>

            <div className="sm:col-span-3 relative flex items-center">
              <MapPin className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="শহর / এলাকা (e.g. Gulshan)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors"
              />
            </div>

            <div className="sm:col-span-3">
              <Button type="submit" size="lg" className="w-full h-11 rounded-xl shadow-md gap-2 font-semibold">
                <Search className="h-4 w-4" />
                প্রপার্টি খুঁজুন
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

