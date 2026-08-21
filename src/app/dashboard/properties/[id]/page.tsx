import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { requireOrganizationAccess } from "@/lib/auth/guards";
import { getPropertyById } from "@/lib/services/property.service";
import { getOrganizationById } from "@/lib/services/organization.service";
import { formatPrice, formatArea, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { BrochureDownloadButton } from "@/components/brochure";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Edit,
  ArrowLeft,
  Bed,
  Bath,
  Square,
  MapPin,
  Eye,
  CheckCircle2,
} from "lucide-react";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardPropertyViewPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const session = await requireOrganizationAccess();

  const property = await getPropertyById(id, session);
  if (!property) {
    notFound();
  }

  const organization = await getOrganizationById(property.organizationId);

  const publicUrl = session.organizationSlug
    ? `/${session.organizationSlug}/properties/${property.slug}`
    : `/explore`;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/properties">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              All Properties
            </Button>
          </Link>
          <StatusBadge status={property.status} />
        </div>

        <div className="flex items-center gap-2">
          {property.status === "PUBLISHED" && (
            <Link href={publicUrl} target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-4 w-4" />
                View Public Page
              </Button>
            </Link>
          )}
          <BrochureDownloadButton
            property={property}
            organization={organization}
            size="sm"
            variant="outline"
          />
          <Link href={`/dashboard/properties/${property._id}/edit`}>
            <Button size="sm" className="gap-1.5 shadow-sm">
              <Edit className="h-4 w-4" />
              Edit Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase text-primary">
              {property.propertyType} • {property.listingType}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-card-foreground">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>
                {property.location.address}, {property.location.area}, {property.location.city}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold uppercase text-muted-foreground block">
              Price
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-card-foreground">
              {formatPrice(property.price, property.currency, property.pricePeriod)}
            </span>
          </div>
        </div>

        {/* Image Grid Preview */}
        {property.images?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {property.images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border/60"
              >
                <Image
                  src={img.secureUrl}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/40 border border-border/60 text-xs">
          <div>
            <span className="text-muted-foreground block font-medium">Bedrooms</span>
            <span className="font-bold text-card-foreground text-sm">{property.specifications.bedrooms} Beds</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Bathrooms</span>
            <span className="font-bold text-card-foreground text-sm">{property.specifications.bathrooms} Baths</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Area</span>
            <span className="font-bold text-card-foreground text-sm">
              {formatArea(property.specifications.propertySize, property.specifications.propertySizeUnit)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Parking</span>
            <span className="font-bold text-card-foreground text-sm">{property.specifications.parkingSpaces || 0} Spaces</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-card-foreground">Description</h3>
          <p className="text-xs text-muted-foreground whitespace-pre-line">
            {property.description}
          </p>
        </div>

        {/* Amenities */}
        {property.amenities?.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <h3 className="text-sm font-bold text-card-foreground">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

