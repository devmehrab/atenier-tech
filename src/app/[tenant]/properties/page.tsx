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
    title: `সকল প্রপার্টি | ${org.name}`,
    description: `${org.name}-এর বিক্রয়যোগ্য ও ভাড়ার ফ্ল্যাট, বাড়ি, জমি ও বাণিজ্যিক প্রপার্টির সম্পূর্ণ তালিকা।`,
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
            {organization.name}-এর সকল প্রপার্টি
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            মোট <span className="font-bold text-foreground">{total}টি</span> এভেইলেবল লিস্টিং থেকে আপনার বাজেট ও পছন্দের প্রপার্টি বেছে নিন
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
          emptyTitle="এই ফিল্টারে কোনো প্রপার্টি পাওয়া যায়নি"
          emptySubtitle="ফিল্টার রিসেট করে অথবা সার্চ পরিবর্তন করে এজেন্সির বাকি এভেইলেবল প্রপার্টিগুলো দেখুন।"
        />
      </SlideUp>

      <Pagination totalPages={totalPages} currentPage={page} />
    </div>
  );
}


