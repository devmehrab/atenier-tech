import Link from "next/link";
import { IProperty } from "@/lib/types";
import { formatPrice, formatArea } from "@/lib/utils/formatters";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, Eye } from "lucide-react";

interface PropertyCardProps {
  property: IProperty;
  tenantSlug?: string;
}

export function PropertyCard({ property, tenantSlug }: PropertyCardProps) {
  const activeTenantSlug = tenantSlug || property.organizationSlug || "explore";
  const imageUrl =
    property.featuredImage ||
    property.images?.[0]?.secureUrl ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

  const href = `/${activeTenantSlug}/properties/${property.slug}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image & Badges */}
      <Link href={href} className="relative aspect-[16/10] w-full overflow-hidden block">
        <ImageWithFallback
          src={imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
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
            className="font-bold uppercase shadow-sm"
          >
            {property.status === "SOLD"
              ? "বিক্রি"
              : property.status === "RENTED"
                ? "ভাড়া"
                : property.listingType === "RENT"
                  ? "ভাড়ার জন্য"
                  : "বিক্রির জন্য"}
          </Badge>

          <span className="rounded-md bg-background/80 px-2 py-0.5 text-xs font-semibold text-foreground backdrop-blur-sm">
            {property.propertyType}
          </span>
        </div>

        {/* Price on Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <span className="text-xl font-extrabold drop-shadow-md">
              {formatPrice(property.price, property.currency, property.pricePeriod)}
            </span>
            {property.priceNegotiable && (
              <span className="ml-1.5 text-xs text-neutral-200 font-medium">(আলোচনা সাপেক্ষ)</span>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 font-sans">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">
            {property.location.area}, {property.location.city}
          </span>
        </div>

        <Link href={href} className="group-hover:text-primary transition-colors">
          <h3 className="text-base font-bold text-card-foreground line-clamp-1">
            {property.title}
          </h3>
        </Link>

        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {property.description}
        </p>

        {/* Specs footer */}
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5" title="বেডরুম">
            <Bed className="h-4 w-4 text-muted-foreground/70" />
            <span>{property.specifications.bedrooms} বেড</span>
          </div>

          <div className="flex items-center gap-1.5" title="বাথরুম">
            <Bath className="h-4 w-4 text-muted-foreground/70" />
            <span>{property.specifications.bathrooms} বাথ</span>
          </div>

          <div className="flex items-center gap-1.5" title="আয়তন">
            <Square className="h-4 w-4 text-muted-foreground/70" />
            <span>
              {formatArea(
                property.specifications.propertySize,
                property.specifications.propertySizeUnit
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

