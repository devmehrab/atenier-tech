import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/lib/services/organization.service";
import {
  listProperties,
  getAvailablePropertyTypesForOrganization,
} from "@/lib/services/property.service";
import { listTeamMembers } from "@/lib/services/user.service";
import { TenantHero } from "@/components/tenant/TenantHero";
import { PropertyGrid } from "@/components/tenant/PropertyGrid";
import { AgentCard } from "@/components/tenant/AgentCard";
import { WhatsAppButton } from "@/components/tenant/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/motion";
import { PropertyType } from "@/lib/types";
import {
  Building2,
  Building,
  Home,
  ShieldCheck,
  Award,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Store,
  Briefcase,
  Trees,
} from "lucide-react";

const PROPERTY_TYPE_META: Record<
  string,
  { name: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }
> = {
  APARTMENT: {
    name: "Apartments & Condos",
    subtitle: "Residential Units",
    icon: Building2,
  },
  HOUSE: {
    name: "Single Family Homes",
    subtitle: "Private Residences",
    icon: Home,
  },
  VILLA: {
    name: "Luxury Villas & Estates",
    subtitle: "Prestigious Living",
    icon: Sparkles,
  },
  PENTHOUSE: {
    name: "Luxury Penthouses",
    subtitle: "Top-Floor Exclusives",
    icon: Building,
  },
  COMMERCIAL: {
    name: "Commercial Spaces",
    subtitle: "Retail & Investment",
    icon: Store,
  },
  OFFICE: {
    name: "Corporate Offices",
    subtitle: "Professional Spaces",
    icon: Briefcase,
  },
  LAND: {
    name: "Land & Plots",
    subtitle: "Development Parcels",
    icon: Trees,
  },
  TOWNHOUSE: {
    name: "Townhouses",
    subtitle: "Modern Urban Living",
    icon: Home,
  },
};

interface TenantHomePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantHomePage({ params }: TenantHomePageProps) {
  const { tenant } = await params;
  const organization = await getOrganizationBySlug(tenant);

  if (!organization) {
    notFound();
  }

  // Fetch featured properties, latest properties, and available categories strictly scoped to this tenant
  const [
    { properties: featured },
    { properties: latest },
    availableCategoriesData,
  ] = await Promise.all([
    listProperties(
      { limit: 3, status: "PUBLISHED" },
      organization._id
    ),
    listProperties(
      { limit: 6, status: "PUBLISHED", sortBy: "newest" },
      organization._id
    ),
    getAvailablePropertyTypesForOrganization(organization._id),
  ]);

  const categories = availableCategoriesData.map((item) => {
    const meta = PROPERTY_TYPE_META[item.propertyType] || {
      name: item.propertyType,
      subtitle: "Property Listings",
      icon: Home,
    };
    return {
      type: item.propertyType,
      name: meta.name,
      subtitle: meta.subtitle,
      count: item.count,
      icon: meta.icon,
    };
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <FadeIn>
        <TenantHero organization={organization} />
      </FadeIn>

      {/* Featured Properties Section */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase text-primary tracking-wider">
                  Featured Collection
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                  Premier Properties
                </h2>
              </div>
              <Link
                href={`/${organization.slug}/properties`}
                className="mt-3 sm:mt-0 inline-flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
              >
                <span>View All Properties</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </SlideUp>

          <SlideUp delay={0.1}>
            <PropertyGrid
              properties={featured}
              tenantSlug={organization.slug}
            />
          </SlideUp>
        </section>
      )}

      {/* Property Categories Quick Browse - Dynamic based on agency's available listings */}
      {categories.length > 0 && (
        <section className="bg-muted/30 py-16 border-y border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SlideUp>
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase text-primary tracking-wider">
                  Browse by Category
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                  Find Your Ideal Property Type
                </h2>
              </div>
            </SlideUp>

            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              staggerDelay={0.08}
            >
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <StaggerItem key={cat.type}>
                    <Link
                      href={`/${organization.slug}/properties?propertyType=${cat.type}`}
                      className="group block rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md hover:-translate-y-0.5 h-full"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-card-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{cat.subtitle}</span>
                        <span className="font-semibold text-primary/80">
                          {cat.count} {cat.count === 1 ? "Listing" : "Listings"}
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Latest Listings */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SlideUp>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase text-primary tracking-wider">
                New Additions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                Recently Added Properties
              </h2>
            </div>
            <Link
              href={`/${organization.slug}/properties`}
              className="mt-3 sm:mt-0"
            >
              <Button variant="outline" size="sm" className="gap-1.5 font-semibold">
                View All Listings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SlideUp>

        <SlideUp delay={0.1}>
          <PropertyGrid
            properties={latest}
            tenantSlug={organization.slug}
            emptyTitle="No properties currently available"
            emptySubtitle="New listings are being prepared. Contact the agency directly to inquire about upcoming inventory."
          />
        </SlideUp>
      </section>

      {/* Agency Bio & Certified Agents */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <SlideUp>
          <div className="rounded-3xl border border-border/60 bg-card text-card-foreground p-8 sm:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                  <Award className="h-3.5 w-3.5" />
                  Verified Real Estate Brokerage
                </span>
                <h2 className="text-3xl font-extrabold text-foreground">
                  About {organization.name}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {organization.description ||
                    `Dedicated to delivering bespoke real estate brokerage, property acquisitions, and tailored advisory across ${organization.city}. Our team connects qualified buyers with extraordinary properties.`}
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {organization.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{organization.address}, {organization.city}</span>
                    </div>
                  )}
                  {organization.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{organization.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3">
                <AgentCard
                  agent={null}
                  organization={organization}
                />
              </div>
            </div>
          </div>
        </SlideUp>
      </section>

      {/* Floating WhatsApp CTA */}
      <WhatsAppButton
        phone={organization.whatsapp || organization.phone}
        agencyName={organization.name}
        floating={true}
      />
    </div>
  );
}


