import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicPropertyBySlug, listProperties } from "@/lib/services/property.service";
import { formatPrice, formatArea, formatDate } from "@/lib/utils/formatters";
import { generatePropertyJsonLd } from "@/lib/utils/seo";
import { PropertyGallery } from "@/components/tenant/PropertyGallery";
import { AgentCard } from "@/components/tenant/AgentCard";
import { WhatsAppButton } from "@/components/tenant/WhatsAppButton";
import { PropertyCard } from "@/components/tenant/PropertyCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyInquiryClient } from "./PropertyInquiryClient";
import { BrochureDownloadButton } from "@/components/brochure";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/motion";
import {
  Bed,
  Bath,
  Square,
  Car,
  Layers,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Building,
  FileText,
} from "lucide-react";

interface PropertyPageProps {
  params: Promise<{ tenant: string; slug: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { tenant, slug } = await params;
  const data = await getPublicPropertyBySlug(tenant, slug);

  if (!data) return { title: "Property Not Found" };

  const { property, organization } = data;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const canonicalUrl = `${baseUrl}/${organization.slug}/properties/${property.slug}`;
  const imageUrl =
    property.featuredImage ||
    property.images?.[0]?.secureUrl ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return {
    title: `${property.title} | ${organization.name}`,
    description: property.description.slice(0, 160),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      url: canonicalUrl,
      images: [imageUrl],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: property.description.slice(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { tenant, slug } = await params;
  const data = await getPublicPropertyBySlug(tenant, slug);

  if (!data) {
    notFound();
  }

  const { property, organization, agent } = data;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const jsonLd = generatePropertyJsonLd(property, organization, baseUrl);

  // Fetch 3 related properties from same agency
  const { properties: related } = await listProperties(
    { limit: 3, status: "PUBLISHED" },
    organization._id
  );

  const filteredRelated = related.filter((p) => p._id !== property._id).slice(0, 3);

  return (
    <div className="bg-background text-foreground pb-20">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Header */}
      <div className="border-b border-border/60 bg-card/50">
        <SlideUp distance={8}>
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link
              href={`/${organization.slug}/properties`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {organization.name} Listings
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Published on {formatDate(property.publishedAt || property.createdAt)}
              </span>
              <BrochureDownloadButton
                property={property}
                organization={organization}
                agent={agent}
                size="sm"
                variant="outline"
              />
            </div>
          </div>
        </SlideUp>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Title & Price Header */}
        <SlideUp distance={16} delay={0.05}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    property.status === "SOLD"
                      ? "destructive"
                      : property.status === "RENTED"
                        ? "warning"
                        : property.listingType === "RENT"
                          ? "info"
                          : "default"
                  }
                  className="font-bold uppercase"
                >
                  {property.status === "SOLD"
                    ? "Sold"
                    : property.status === "RENTED"
                      ? "Rented"
                      : property.listingType === "RENT"
                        ? "For Rent"
                        : "For Sale"}
                </Badge>
                <Badge variant="outline" className="font-semibold">
                  {property.propertyType}
                </Badge>
                {property.specifications.furnishedStatus !== "UNFURNISHED" && (
                  <Badge variant="secondary">
                    {property.specifications.furnishedStatus.replace("_", " ")}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {property.title}
              </h1>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>
                  {property.location.address}, {property.location.area},{" "}
                  {property.location.city}
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:items-end">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                Listing Price
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
                {formatPrice(property.price, property.currency, property.pricePeriod)}
              </div>
              {property.priceNegotiable && (
                <span className="text-xs text-primary font-semibold mt-0.5">
                  Price Negotiable
                </span>
              )}
            </div>
          </div>
        </SlideUp>

        {/* Gallery */}
        <FadeIn delay={0.1}>
          <PropertyGallery images={property.images} title={property.title} />
        </FadeIn>

        {/* Two-Column Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Specifications & Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Specs Grid */}
            <SlideUp delay={0.15}>
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                <h2 className="text-base font-bold text-card-foreground mb-6">
                  Property Specifications
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Bed className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground font-medium">Bedrooms</span>
                      <span className="font-bold text-card-foreground">{property.specifications.bedrooms} Beds</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Bath className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground font-medium">Bathrooms</span>
                      <span className="font-bold text-card-foreground">{property.specifications.bathrooms} Baths</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Square className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground font-medium">Floor Area</span>
                      <span className="font-bold text-card-foreground">
                        {formatArea(property.specifications.propertySize, property.specifications.propertySizeUnit)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground font-medium">Parking</span>
                      <span className="font-bold text-card-foreground">
                        {property.specifications.parkingSpaces || 0} Spaces
                      </span>
                    </div>
                  </div>

                  {property.specifications.floorNumber !== undefined && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Layers className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground font-medium">Floor Level</span>
                        <span className="font-bold text-card-foreground">
                          {property.specifications.floorNumber}
                          {property.specifications.totalFloors ? ` of ${property.specifications.totalFloors}` : ""}
                        </span>
                      </div>
                    </div>
                  )}

                  {property.specifications.yearBuilt && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground font-medium">Year Built</span>
                        <span className="font-bold text-card-foreground">{property.specifications.yearBuilt}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SlideUp>

            {/* Description */}
            <SlideUp delay={0.2}>
              <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-card-foreground">About This Property</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none text-sm text-muted-foreground whitespace-pre-line">
                  {property.description}
                </div>
              </div>
            </SlideUp>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <SlideUp delay={0.25}>
                <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-card-foreground">Amenities & Infrastructure</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 rounded-xl bg-muted/50 px-3.5 py-2.5 text-xs font-semibold text-card-foreground border border-border/50"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SlideUp>
            )}
          </div>

          {/* Sidebar CTA & Agent Details */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <SlideUp delay={0.2}>
              <PropertyInquiryClient
                organizationId={organization._id}
                propertyId={property._id}
                propertyTitle={property.title}
                organizationName={organization.name}
                whatsapp={organization.whatsapp || organization.phone}
                phone={organization.phone}
              />
            </SlideUp>

            <SlideUp delay={0.22}>
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-card-foreground">Property Brochure</h3>
                    <p className="text-xs text-muted-foreground">Download printable PDF presentation</p>
                  </div>
                </div>
                <BrochureDownloadButton
                  property={property}
                  organization={organization}
                  agent={agent}
                  className="w-full"
                  variant="outline"
                />
              </div>
            </SlideUp>

            <SlideUp delay={0.25}>
              <AgentCard agent={agent} organization={organization} />
            </SlideUp>
          </div>
        </div>

        {/* Related Properties */}
        {filteredRelated.length > 0 && (
          <section className="pt-12 border-t border-border/60">
            <SlideUp>
              <h2 className="text-2xl font-extrabold text-foreground mb-6">
                More Properties from {organization.name}
              </h2>
            </SlideUp>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
              {filteredRelated.map((rel) => (
                <StaggerItem key={rel._id}>
                  <PropertyCard
                    property={rel}
                    tenantSlug={organization.slug}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        )}
      </div>

      {/* Floating WhatsApp CTA */}
      <WhatsAppButton
        phone={organization.whatsapp || organization.phone}
        agencyName={organization.name}
        propertyTitle={property.title}
        floating={true}
      />
    </div>
  );
}


