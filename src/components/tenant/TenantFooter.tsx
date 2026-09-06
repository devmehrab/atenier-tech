import Link from "next/link";
import { IOrganization } from "@/lib/types";
import { Building, MapPin, Phone, Mail, Globe, MessageSquare } from "lucide-react";

interface TenantFooterProps {
  organization: IOrganization;
}

export function TenantFooter({ organization }: TenantFooterProps) {
  return (
    <footer className="border-t border-border/60 bg-muted/40 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Agency Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Building className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                {organization.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {organization.description ||
                "Providing exceptional real estate brokerage services, property acquisitions, leasing, and advisory."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Property Categories
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={`/${organization.slug}/properties?listingType=SALE`}
                  className="hover:text-primary transition-colors"
                >
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link
                  href={`/${organization.slug}/properties?listingType=RENT`}
                  className="hover:text-primary transition-colors"
                >
                  Rental Properties
                </Link>
              </li>
              <li>
                <Link
                  href={`/${organization.slug}/properties?propertyType=APARTMENT`}
                  className="hover:text-primary transition-colors"
                >
                  Flats & Condominiums
                </Link>
              </li>
              <li>
                <Link
                  href={`/${organization.slug}/properties?propertyType=VILLA`}
                  className="hover:text-primary transition-colors"
                >
                  Luxury Villas & Penthouses
                </Link>
              </li>
              <li className="pt-2 border-t border-border/40">
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition-colors font-semibold text-foreground/90 flex items-center gap-1.5"
                >
                  <span>Agency Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Office & Inquiries
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {organization.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    {organization.address}, {organization.city}
                  </span>
                </li>
              )}
              {organization.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <a href={`tel:${organization.phone}`} className="hover:text-foreground transition-colors">
                    {organization.phone}
                  </a>
                </li>
              )}
              {organization.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a href={`mailto:${organization.email}`} className="hover:text-foreground transition-colors">
                    {organization.email}
                  </a>
                </li>
              )}
              {organization.whatsapp && (
                <li className="flex items-center gap-2.5">
                  <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                  <a
                    href={`https://wa.me/${organization.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    WhatsApp Support
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {organization.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Broker Portal
            </Link>
            <span>•</span>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Powered by Atenier
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

