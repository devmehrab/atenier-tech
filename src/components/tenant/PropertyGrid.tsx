import { IProperty } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";
import { Home } from "lucide-react";

interface PropertyGridProps {
  properties: IProperty[];
  tenantSlug?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export function PropertyGrid({
  properties,
  tenantSlug,
  emptyTitle = "No properties found",
  emptySubtitle = "There are currently no listings matching your criteria. Check back soon or try adjusting your filters.",
}: PropertyGridProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <Home className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground">{emptyTitle}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-md">{emptySubtitle}</p>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          tenantSlug={tenantSlug || property.organizationSlug}
        />
      ))}
    </div>
  );
}
