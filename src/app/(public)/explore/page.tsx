import { getCurrentSession } from "@/lib/auth/guards";
import { listProperties } from "@/lib/services/property.service";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { TenantFilterBar } from "@/components/tenant/TenantFilterBar";
import { PropertyGrid } from "@/components/tenant/PropertyGrid";
import { Pagination } from "@/components/shared/Pagination";
import { IPropertyFilterParams } from "@/lib/types";
import { FadeIn, SlideUp } from "@/components/motion";

interface ExplorePageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata = {
  title: "Explore Real Estate Properties & Listings",
  description:
    "Browse homes, apartments, penthouses, villas, and commercial real estate for sale and rent across all agencies.",
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;
  const session = await getCurrentSession();

  const filterParams: IPropertyFilterParams = {
    search: resolvedParams.search,
    listingType: resolvedParams.listingType as any,
    propertyType: resolvedParams.propertyType as any,
    city: resolvedParams.city,
    area: resolvedParams.area,
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    bedrooms: resolvedParams.bedrooms ? Number(resolvedParams.bedrooms) : undefined,
    sortBy: resolvedParams.sortBy as any,
    page: resolvedParams.page ? Number(resolvedParams.page) : 1,
    limit: 12,
    status: "PUBLISHED",
  };

  const { properties, total, page, totalPages } = await listProperties(filterParams);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar user={session} />

      <main className="mx-auto max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8 w-full">
        <SlideUp distance={16}>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Real Estate Marketplace
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Discover {total} properties listed across our network of verified real estate agencies.
            </p>
          </div>
        </SlideUp>

        <FadeIn delay={0.1}>
          <TenantFilterBar />
        </FadeIn>

        <SlideUp delay={0.2}>
          <PropertyGrid
            properties={properties}
            emptyTitle="No properties match your filter criteria"
            emptySubtitle="Try loosening your search filters, adjusting the price range, or choosing a different city."
          />
        </SlideUp>

        <Pagination totalPages={totalPages} currentPage={page} />
      </main>

      <Footer />
    </div>
  );
}


