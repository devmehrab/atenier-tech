import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/lib/services/organization.service";
import { listProperties } from "@/lib/services/property.service";
import { TenantFilterBar } from "@/components/tenant/TenantFilterBar";
import { PropertyGrid } from "@/components/tenant/PropertyGrid";
import { Pagination } from "@/components/shared/Pagination";
import { IPropertyFilterParams } from "@/lib/types";
import { FadeIn, SlideUp } from "@/components/motion";

interface TenantPropertiesPageProps {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ params }: TenantPropertiesPageProps) {
  const { tenant } = await params;
  const org = await getOrganizationBySlug(tenant);
  if (!org) return { title: "Agency Not Found" };

  return {
    title: `All Properties | ${org.name}`,
    description: `Explore available properties for sale and rent by ${org.name}.`,
  };
}

export default async function TenantPropertiesPage({
  params,
  searchParams,
}: TenantPropertiesPageProps) {
  const { tenant } = await params;
  const resolvedSearchParams = await searchParams;

  const organization = await getOrganizationBySlug(tenant);
  if (!organization) {
    notFound();
  }

  const filterParams: IPropertyFilterParams = {
    search: resolvedSearchParams.search,
    listingType: resolvedSearchParams.listingType as any,
    propertyType: resolvedSearchParams.propertyType as any,
    city: resolvedSearchParams.city,
    area: resolvedSearchParams.area,
    minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
    bedrooms: resolvedSearchParams.bedrooms ? Number(resolvedSearchParams.bedrooms) : undefined,
    sortBy: resolvedSearchParams.sortBy as any,
    page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
    limit: 12,
    status: "PUBLISHED",
  };

  // Strictly enforce tenant isolation: pass organization._id as scope
  const { properties, total, page, totalPages } = await listProperties(
    filterParams,
    organization._id
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SlideUp distance={16}>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">
            All Properties by {organization.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse <span className="font-bold text-foreground">{total} {total === 1 ? "available listing" : "available listings"}</span> curated for your lifestyle and investment goals
          </p>
        </div>
      </SlideUp>

      <FadeIn delay={0.1}>
        <TenantFilterBar />
      </FadeIn>

      <SlideUp delay={0.2}>
        <PropertyGrid
          properties={properties}
          tenantSlug={organization.slug}
          emptyTitle="No properties found matching criteria"
          emptySubtitle="Try clearing or adjusting your search filters to view other available listings."
        />
      </SlideUp>

      <Pagination totalPages={totalPages} currentPage={page} />
    </div>
  );
}


