import { IProperty, IOrganization } from "@/lib/types";
import { formatPrice, formatArea } from "@/lib/utils/formatters";

/**
 * Generates a Facebook post caption from existing database property details.
 * Strictly includes only fields that exist / are non-empty in the database.
 */
export function generateFacebookCaption(
  property: IProperty,
  organization?: Partial<IOrganization> | null,
  publicUrl?: string
): string {
  const lines: string[] = [];

  // Headline
  lines.push(`🔥 ${property.title}`);
  lines.push("");

  // Purpose & Property Type
  const listingTypeText =
    property.listingType === "RENT"
      ? "For Rent"
      : property.listingType === "LEASE"
      ? "Commercial Lease"
      : "For Sale";

  const propertyTypeMap: Record<string, string> = {
    APARTMENT: "Apartment / Condominium",
    HOUSE: "Private Residence / Villa",
    VILLA: "Luxury Villa",
    COMMERCIAL: "Commercial Asset",
    LAND: "Land / Development Parcel",
    OFFICE: "Office Suite",
    PENTHOUSE: "Penthouse",
    TOWNHOUSE: "Townhouse",
  };

  const propertyTypeText = propertyTypeMap[property.propertyType] || property.propertyType;
  lines.push(`🏢 Property Type: ${propertyTypeText} • ${listingTypeText}`);

  // Location (only available parts)
  const locParts = [
    property.location?.address,
    property.location?.area,
    property.location?.city,
  ].filter(Boolean);
  if (locParts.length > 0) {
    lines.push(`📍 Location: ${locParts.join(", ")}`);
  }

  // Price
  if (property.price !== undefined && property.price !== null) {
    const formattedPrice = formatPrice(
      property.price,
      property.currency,
      property.pricePeriod
    );
    const negotiableText = property.priceNegotiable ? " (Negotiable)" : "";
    lines.push(`💰 Price: ${formattedPrice}${negotiableText}`);
  }

  lines.push("");

  // Specifications (only if present)
  const specs: string[] = [];
  if (property.specifications?.bedrooms) {
    specs.push(`▫️ Bedrooms: ${property.specifications.bedrooms}`);
  }
  if (property.specifications?.bathrooms) {
    specs.push(`▫️ Bathrooms: ${property.specifications.bathrooms}`);
  }
  if (property.specifications?.propertySize) {
    specs.push(
      `▫️ Total Area: ${formatArea(
        property.specifications.propertySize,
        property.specifications.propertySizeUnit
      )}`
    );
  }
  if (property.specifications?.parkingSpaces && property.specifications.parkingSpaces > 0) {
    specs.push(`▫️ Dedicated Parking: ${property.specifications.parkingSpaces} spaces`);
  }
  if (property.specifications?.floorNumber !== undefined) {
    const totalFl = property.specifications.totalFloors
      ? ` (of ${property.specifications.totalFloors} floors)`
      : "";
    specs.push(`▫️ Floor Level: ${property.specifications.floorNumber}${totalFl}`);
  }
  if (
    property.specifications?.furnishedStatus &&
    property.specifications.furnishedStatus !== "UNFURNISHED"
  ) {
    const furnishedMap: Record<string, string> = {
      SEMI_FURNISHED: "Semi-Furnished",
      FULLY_FURNISHED: "Fully Furnished",
    };
    specs.push(
      `▫️ Furnishing: ${
        furnishedMap[property.specifications.furnishedStatus] ||
        property.specifications.furnishedStatus
      }`
    );
  }
  if (property.specifications?.yearBuilt) {
    specs.push(`▫️ Built: ${property.specifications.yearBuilt}`);
  }

  if (specs.length > 0) {
    lines.push("📌 Key Property Highlights:");
    lines.push(...specs);
  }

  // Amenities (only if array is non-empty)
  if (property.amenities && property.amenities.length > 0) {
    lines.push("");
    lines.push("✨ Features & Amenities:");
    property.amenities.forEach((amenity) => {
      lines.push(`✔️ ${amenity}`);
    });
  }

  // Description (only if available)
  if (property.description?.trim()) {
    lines.push("");
    lines.push("📝 Overview:");
    lines.push(property.description.trim());
  }

  // Contact Info (only if available)
  const phone = property.contactInfo?.phone || organization?.phone;
  const whatsapp = property.contactInfo?.whatsapp || organization?.whatsapp || phone;
  const email = property.contactInfo?.email || organization?.email;
  const orgName = organization?.name || property.organizationName;

  const contacts: string[] = [];
  if (phone) contacts.push(`📞 Phone: ${phone}`);
  if (whatsapp) contacts.push(`💬 WhatsApp: ${whatsapp}`);
  if (email) contacts.push(`✉️ Email: ${email}`);
  if (orgName) contacts.push(`🏢 Agency: ${orgName}`);
  if (publicUrl) contacts.push(`🌐 View full gallery & specifications: ${publicUrl}`);

  if (contacts.length > 0) {
    lines.push("");
    lines.push("📲 Inquiries & Private Viewings:");
    lines.push(...contacts);
  }

  // Relevant hashtags based on available data
  lines.push("");
  const tags: string[] = ["#LuxuryRealEstate", "#PropertyInvestment", "#PrimeLocation"];

  if (property.propertyType === "APARTMENT" || property.propertyType === "PENTHOUSE") {
    tags.push(property.listingType === "RENT" ? "#LuxuryApartmentForRent" : "#ApartmentForSale", "#PenthouseLiving");
  } else if (property.propertyType === "LAND") {
    tags.push("#LandForSale", "#DevelopmentParcel", "#PrimeLand");
  } else if (property.propertyType === "COMMERCIAL" || property.propertyType === "OFFICE") {
    tags.push("#CommercialRealEstate", "#PrimeOfficeSpace");
  } else if (property.propertyType === "HOUSE" || property.propertyType === "VILLA") {
    tags.push(property.listingType === "RENT" ? "#VillaForRent" : "#VillaForSale", "#LuxuryHomes");
  }

  if (property.location?.city) tags.push(`#${property.location.city.replace(/\s+/g, "")}`);
  if (property.location?.area) tags.push(`#${property.location.area.replace(/\s+/g, "")}`);
  if (orgName) {
    const cleanOrg = orgName.replace(/[^a-zA-Z0-9]/g, "");
    if (cleanOrg) tags.push(`#${cleanOrg}`);
  }

  lines.push(tags.join(" "));

  return lines.join("\n");
}
