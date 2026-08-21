import Link from "next/link";
import Image from "next/image";
import { IOrganization } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Building, Phone, MessageSquare, ArrowLeft } from "lucide-react";

interface TenantHeaderProps {
  organization: IOrganization;
}

export function TenantHeader({ organization }: TenantHeaderProps) {
  const brandColor = organization.branding?.primaryColor || "#15803d";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/${organization.slug}`}
            className="flex items-center gap-3 group"
          >
            {organization.logo?.secureUrl ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border/60 shadow-sm">
                <Image
                  src={organization.logo.secureUrl}
                  alt={organization.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground shadow-sm font-bold text-lg"
                style={{ backgroundColor: brandColor }}
              >
                <Building className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {organization.name}
              </h1>
              {organization.branding?.tagline && (
                <p className="text-xs text-muted-foreground font-medium">
                  {organization.branding.tagline}
                </p>
              )}
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-foreground">
          <Link
            href={`/${organization.slug}`}
            className="hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href={`/${organization.slug}/properties?listingType=SALE`}
            className="hover:text-primary transition-colors"
          >
            For Sale
          </Link>
          <Link
            href={`/${organization.slug}/properties?listingType=RENT`}
            className="hover:text-primary transition-colors"
          >
            For Rent
          </Link>
          <Link
            href={`/${organization.slug}/properties`}
            className="hover:text-primary transition-colors"
          >
            All Listings
          </Link>
          <Link
            href={`/${organization.slug}/contact`}
            className="hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {organization.whatsapp && (
            <a
              href={`https://wa.me/${organization.whatsapp.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                organization.name
              )},%20I%20am%20interested%20in%20your%20property%20listings.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp
            </a>
          )}
          {organization.phone && (
            <a
              href={`tel:${organization.phone}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-card-foreground hover:bg-muted transition-colors shadow-sm"
            >
              <Phone className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">{organization.phone}</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

