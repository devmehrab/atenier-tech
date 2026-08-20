import { IOrganization, IProperty } from "@/lib/types";

export function generatePropertyJsonLd(
  property: IProperty,
  organization: IOrganization,
  baseUrl: string
) {
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
    url: `${baseUrl}/${organization.slug}/properties/${property.slug}`,
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
      url: `${baseUrl}/${organization.slug}`,
      telephone: organization.phone,
      email: organization.email,
    },
  };
}

export function generateOrganizationJsonLd(
  organization: IOrganization,
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: organization.name,
    description: organization.description,
    url: `${baseUrl}/${organization.slug}`,
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
