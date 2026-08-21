import React, { Suspense } from "react";
import Link from "next/link";
import { requireOrganizationAccess } from "@/lib/auth/guards";
import { listProperties } from "@/lib/services/property.service";
import { PropertyTable } from "@/components/dashboard/PropertyTable";
import { PropertySearchBar } from "@/components/dashboard/PropertySearchBar";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PropertyStatus } from "@/lib/types";

interface PropertiesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata = {
  title: "Property Listings | Dashboard",
};

export default async function DashboardPropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const session = await requireOrganizationAccess();
  const resolvedParams = await searchParams;

  const currentStatus = resolvedParams.status as PropertyStatus | undefined;
  const search = resolvedParams.search || "";
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

  // Strict tenant scoping: organizationId = session.organizationId
  const { properties, total, totalPages } = await listProperties(
    {
      status: currentStatus,
      search,
      page,
      limit: 15,
    },
    session.organizationId!
  );
  const serializedProperties = JSON.parse(JSON.stringify(properties));

  const statusFilters = [
    { label: "All Listings", value: undefined },
    { label: "Published", value: "PUBLISHED" },
    { label: "Drafts", value: "DRAFT" },
    { label: "Sold", value: "SOLD" },
    { label: "Rented", value: "RENTED" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Property Listings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your agency&apos;s real estate portfolio ({total} total properties)
          </p>
        </div>

        <Link href="/dashboard/properties/new">
          <Button className="gap-1.5 shadow-sm">
            <PlusCircle className="h-4 w-4" />
            Add New Property
          </Button>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
        {/* Status Pill Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusFilters.map((sf) => {
            const isActive = currentStatus === sf.value;
            const href = sf.value
              ? `/dashboard/properties?status=${sf.value}${search ? `&search=${search}` : ""}`
              : `/dashboard/properties${search ? `?search=${search}` : ""}`;

            return (
              <Link
                key={sf.label}
                href={href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                {sf.label}
              </Link>
            );
          })}
        </div>

        {/* Live Debounced Search Bar */}
        <Suspense fallback={<div className="h-9 w-full sm:max-w-xs rounded-lg bg-muted animate-pulse" />}>
          <PropertySearchBar placeholder="Search by title, location, area..." />
        </Suspense>
      </div>

      {/* Table */}
      <PropertyTable
        properties={serializedProperties as any}
        tenantSlug={session.organizationSlug}
      />

      <Pagination totalPages={totalPages} currentPage={page} />
    </div>
  );
}

