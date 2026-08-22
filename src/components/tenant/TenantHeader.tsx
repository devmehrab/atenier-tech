"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IOrganization } from "@/lib/types";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Building,
  Phone,
  MessageSquare,
  Menu,
  X,
  Home,
  Tag,
  Key,
  Compass,
  Mail,
} from "lucide-react";

interface TenantHeaderProps {
  organization: IOrganization;
}

export function TenantHeader({ organization }: TenantHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const brandColor = organization.branding?.primaryColor || "#15803d";

  const navLinks = [
    {
      href: `/${organization.slug}`,
      label: "হোম",
      icon: Home,
    },
    {
      href: `/${organization.slug}/properties?listingType=SALE`,
      label: "বিক্রির প্রপার্টি",
      icon: Tag,
    },
    {
      href: `/${organization.slug}/properties?listingType=RENT`,
      label: "ভাড়ার প্রপার্টি",
      icon: Key,
    },
    {
      href: `/${organization.slug}/properties`,
      label: "সকল লিস্টিং",
      icon: Compass,
    },
    {
      href: `/${organization.slug}/contact`,
      label: "যোগাযোগ",
      icon: Mail,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all duration-300">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Organization Branding */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/${organization.slug}`}
            className="flex items-center gap-3 group min-w-0"
            onClick={() => setMobileOpen(false)}
          >
            {organization.logo?.secureUrl ? (
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-xl border border-border/60 shadow-sm">
                <Image
                  src={organization.logo.secureUrl}
                  alt={organization.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-sm font-bold text-base sm:text-lg"
                style={{ backgroundColor: brandColor }}
              >
                <Building className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {organization.name}
              </h1>
              {organization.branding?.tagline && (
                <p className="text-xs text-muted-foreground font-medium truncate hidden xs:block">
                  {organization.branding.tagline}
                </p>
              )}
            </div>
          </Link>
        </div>

        {/* Middle: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {organization.whatsapp && (
            <a
              href={`https://wa.me/${organization.whatsapp.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                organization.name
              )},%20I%20am%20interested%20in%20your%20property%20listings.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 dark:bg-emerald-700 px-3.5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
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
              <span>{organization.phone}</span>
            </a>
          )}
        </div>

        {/* Mobile Actions (ThemeToggle + Phone/WhatsApp + Menu Trigger) */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          <ThemeToggle />

          {organization.phone && (
            <a
              href={`tel:${organization.phone}`}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
              title="কল করুন"
              aria-label="Call agency"
            >
              <Phone className="h-5 w-5 text-primary stroke-[1.5]" />
            </a>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors focus:outline-none"
            aria-label={mobileOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6 stroke-[1.5]" />
            ) : (
              <Menu className="h-6 w-6 stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-md px-4 pt-4 pb-6 space-y-5 animate-in slide-in-from-top-2 shadow-lg">
          <nav className="flex flex-col space-y-1 text-base font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-5 w-5 text-muted-foreground shrink-0 stroke-[1.5]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Contact Buttons on Mobile Drawer */}
          <div className="pt-4 border-t border-border/50 flex flex-col gap-2.5">
            {organization.whatsapp && (
              <a
                href={`https://wa.me/${organization.whatsapp.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                  organization.name
                )},%20I%20am%20interested%20in%20your%20property%20listings.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 dark:bg-emerald-700 py-3 px-4 text-sm font-semibold text-white shadow hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp এ মেসেজ পাঠান
              </a>
            )}
            {organization.phone && (
              <a
                href={`tel:${organization.phone}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 px-4 text-sm font-semibold text-card-foreground hover:bg-muted transition-colors shadow-sm"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>কল করুন: {organization.phone}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
