import { IOrganization, IProperty } from "@/lib/types";

/**
 * Resolves the application base URL with the following priority:
 * 1. NEXT_PUBLIC_APP_URL (if explicitly provided in development or custom env)
 * 2. URL (automatically provided by Netlify in production and deploy contexts)
 * 3. http://localhost:3000 (local development fallback)
 *
 * Normalizes protocol and ensures no trailing slashes for consistent URL formatting.
 */
export function getBaseUrl(): string {
  let rawUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.URL ||
    "http://localhost:3000";

  rawUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(rawUrl)) {
    rawUrl = `https://${rawUrl}`;
  }

  return rawUrl.replace(/\/+$/, "");
}

export function generatePropertyJsonLd(
  property: IProperty,
  organization: IOrganization,
  baseUrl: string = getBaseUrl()
) {
  const origin = baseUrl.replace(/\/+$/, "");
  const images = property.images?.length
    ? property.images.map((img) => img.secureUrl)
    : property.featuredImage
    ? [property.featuredImage]
    : [];

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${origin}/${organization.slug}/properties/${property.slug}`,
    image: images,
    datePosted: property.publishedAt || property.createdAt,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency || "USD",
      availability:
        property.status === "PUBLISHED"
          ? "https://schema.org/InStock"
          : property.status === "SOLD"
          ? "https://schema.org/Discontinued"
          : "https://schema.org/OutOfStock",
      businessFunction:
        property.listingType === "RENT"
          ? "https://schema.org/LeaseOut"
          : "https://schema.org/SellAction",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location.address,
      addressLocality: property.location.city,
      addressRegion: property.location.area,
      postalCode: property.location.zipCode || "",
      addressCountry: property.location.country || "US",
    },
    geo: property.location.latitude && property.location.longitude
      ? {
          "@type": "GeoCoordinates",
          latitude: property.location.latitude,
          longitude: property.location.longitude,
        }
      : undefined,
    numberOfRooms: property.specifications?.bedrooms || 0,
    numberOfBathroomsTotal: property.specifications?.bathrooms || 0,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.specifications?.propertySize || 0,
      unitCode: property.specifications?.propertySizeUnit === "sqm" ? "MTK" : "FTK",
    },
    provider: {
      "@type": "RealEstateAgent",
      name: organization.name,
      url: `${origin}/${organization.slug}`,
      telephone: organization.phone,
      email: organization.email,
    },
  };
}

export function generateOrganizationJsonLd(
  organization: IOrganization,
  baseUrl: string = getBaseUrl()
) {
  const origin = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: organization.name,
    description: organization.description,
    url: `${origin}/${organization.slug}`,
    logo: organization.logo?.secureUrl,
    telephone: organization.phone,
    email: organization.email,
    address: organization.address
      ? {
          "@type": "PostalAddress",
          streetAddress: organization.address,
          addressLocality: organization.city || "",
          addressCountry: organization.country || "",
        }
      : undefined,
    sameAs: Object.values(organization.socialLinks || {}).filter(Boolean),
  };
}

export function generatePlatformJsonLd(baseUrl: string = getBaseUrl()) {
  const origin = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: "Atenier",
        description:
          "রিয়েল এস্টেট এজেন্সির জন্য নিজস্ব প্রপার্টি লিস্টিং ও ওয়েবসাইট প্ল্যাটফর্ম",
        inLanguage: "bn-BD",
      },
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: "Atenier Technologies",
        url: origin,
        logo: `${origin}/favicon.png`,
        description:
          "Digital platform enabling Bangladeshi real-estate agencies and agents to create a professional online presence and showcase properties.",
      },
    ],
  };
}
