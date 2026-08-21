import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/lib/services/organization.service";
import { listProperties } from "@/lib/services/property.service";
import { listTeamMembers } from "@/lib/services/user.service";
import { TenantHero } from "@/components/tenant/TenantHero";
import { PropertyGrid } from "@/components/tenant/PropertyGrid";
import { AgentCard } from "@/components/tenant/AgentCard";
import { WhatsAppButton } from "@/components/tenant/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/motion";
import {
  Building2,
  Home,
  ShieldCheck,
  Award,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface TenantHomePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantHomePage({ params }: TenantHomePageProps) {
  const { tenant } = await params;
  const organization = await getOrganizationBySlug(tenant);

  if (!organization) {
    notFound();
  }

  // Fetch featured properties and latest properties strictly scoped to this tenant
  const [{ properties: featured }, { properties: latest }] = await Promise.all([
    listProperties(
      { limit: 3, status: "PUBLISHED" },
      organization._id
    ),
    listProperties(
      { limit: 6, status: "PUBLISHED", sortBy: "newest" },
      organization._id
    ),
  ]);

  const categories = [
    { name: "Apartments & Condos", type: "APARTMENT", count: "Luxury Units" },
    { name: "Family Houses & Villas", type: "HOUSE", count: "Prime Residential" },
    { name: "Commercial & Office", type: "COMMERCIAL", count: "Workspaces" },
    { name: "Penthouses", type: "PENTHOUSE", count: "High-Rise Living" },
  ];

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
                <span className="text-xs font-bold uppercase text-primary">
                  Spotlight Collection
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                  Featured Properties
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

      {/* Property Categories Quick Browse */}
      <section className="bg-muted/30 py-16 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase text-primary">
                Browse by Category
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                Explore Property Types
              </h2>
            </div>
          </SlideUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.08}>
            {categories.map((cat) => (
              <StaggerItem key={cat.type}>
                <Link
                  href={`/${organization.slug}/properties?propertyType=${cat.type}`}
                  className="group block rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md hover:-translate-y-0.5 h-full"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Home className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{cat.count}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SlideUp>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase text-primary">
                Fresh On Market
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                Latest Property Listings
              </h2>
            </div>
            <Link
              href={`/${organization.slug}/properties`}
              className="mt-3 sm:mt-0"
            >
              <Button variant="outline" size="sm" className="gap-1.5">
                Browse All Listings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SlideUp>

        <SlideUp delay={0.1}>
          <PropertyGrid
            properties={latest}
            tenantSlug={organization.slug}
            emptyTitle="No listings currently published"
            emptySubtitle="The agency is preparing new listings. Please contact them directly for upcoming opportunities."
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
                  Trusted Real Estate Agency
                </span>
                <h2 className="text-3xl font-extrabold text-foreground">
                  About {organization.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {organization.description ||
                    `Dedicated to delivering premier real estate advisory and transaction services across ${organization.city}. Our team connects buyers, tenants, and investors with high-value residential and commercial properties.`}
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


